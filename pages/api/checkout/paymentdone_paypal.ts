import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import useSendEmail from "@/src/emails/useSendEmail";
import EmailRdvBooked from "@/src/emails/EmailBooked";
import useSetBookingUser from "@/app/admin/Components/Bookings/useSetBookingUser";

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

    if (webhookEvent.event_type === "CHECKOUT.ORDER.APPROVED") {
      return res.status(200).send("Webhook traité avec succès");
    }

    if (webhookEvent.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      console.log("webhookEvent res ==>", webhookEvent.resource);
      const { email_address: customerEmail } = webhookEvent.resource.payee;
      const { custom_id: bookingId } = webhookEvent.resource;

      const hasBeenPassedToReserved = await useSetBookingUser({
        bookingId,
        customerEmail,
      });
      if (hasBeenPassedToReserved && customerEmail) {
        await useSendEmail({
          from: "QuickReserve <no-answer@quickreserve.app>",
          to: [String(customerEmail)],
          subject: `Votre créneau a bien été réservé`,
          react: EmailRdvBooked({
            customerName: customerEmail ?? "",
            bookingStartTime: new Date().toString(), // a supprimer
            // bookingStartTime: bookingStartTime,
          }),
        });
      }
      return res.status(200).send("Webhook traité avec succès");
    }
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    return res.status(400).send("Erreur de traitement du webhook");
  }
}
