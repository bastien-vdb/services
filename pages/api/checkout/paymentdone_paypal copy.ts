import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import useSendEmail from "@/src/emails/useSendEmail";
import EmailRdvBooked from "@/src/emails/EmailBooked";
import actionSetBookingUser from "@/app/admin/Components/Bookings/action-setBookingUser";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buf = await buffer(req);
  const rawBody = buf.toString("utf-8");

  const paypalTransmissionId = req.headers["paypal-transmission-id"];

  if (!paypalTransmissionId) {
    return res.status(400).send("Requête invalide");
  }

  try {
    const webhookEvent = JSON.parse(rawBody);

    if (webhookEvent.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      console.log("webhookEvent res ==>", webhookEvent.resource);
      const { email_address: customerEmail } = webhookEvent.resource.payee;
      const { custom_id: bookingId } = webhookEvent.resource;

      const hasBeenPassedToReserved = await actionSetBookingUser({
        bookingId,
        status: "CONFIRMED",
      });

      const bookingFound = await prisma?.booking.findUnique({
        where: { id: bookingId },
        include: { service: true, customer: true },
      });

      if (hasBeenPassedToReserved && customerEmail) {
        await useSendEmail({
          from: "QuickReserve <no-answer@quickreserve.app>",
          to: [String(customerEmail)],
          subject: `Votre créneau a bien été réservé`,
          react: EmailRdvBooked({
            customerName: customerEmail ?? "",
            bookingStartTime: bookingFound?.startTime.toString() ?? "",
            serviceName: bookingFound?.service?.name ?? "",
            employeeName: "Natacha S",
            businessPhysicalAddress: "36 chemin des huats, 93000 Bobigny",
          }),
          // bookingStartTime: bookingStartTime,
        });
      }
      return res.status(200).send("Webhook traité avec succès");
    }
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    return res.status(400).send("Erreur de traitement du webhook");
  }
}
