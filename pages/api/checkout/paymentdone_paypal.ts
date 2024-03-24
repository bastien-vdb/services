import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import useSendEmail from "@/src/emails/useSendEmail";
import EmailRdvBooked from "@/src/emails/EmailBooked";

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
      console.log("webhookEvent res ==>", webhookEvent);
      const { email_address } = webhookEvent.resource.payee;
      await useSendEmail({
        from: "QuickReserve <no-answer@quickreserve.app>",
        to: [String(email_address)],
        subject: `Votre créneau a bien été réservé`,
        react: EmailRdvBooked({
          customerName: email_address ?? "",
          bookingStartTime: new Date().toString(), // a supprimer
          // bookingStartTime: bookingStartTime,
        }),
      });
      return res.status(200).send("Webhook traité avec succès");
    }
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    return res.status(400).send("Erreur de traitement du webhook");
  }
}
