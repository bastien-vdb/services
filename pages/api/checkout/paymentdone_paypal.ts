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
      console.log("webhookEvent ==>", webhookEvent);
      // const {email_address, } = webhookEvent.resource.payer;
      // await useSendEmail({
      //   from: "QuickReserve <no-answer@quickreserve.app>",
      //   to: [String(payerEmail)],
      //   subject: `${customerDetails.name} Votre créneau a bien été réservé`,
      //   react: EmailRdvBooked({ customerName: customerDetails.name ?? "", bookingStartTime:bookingStartTime }),
      // });
      return res.status(200).send("Webhook traité avec succès");
    }
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    return res.status(400).send("Erreur de traitement du webhook");
  }
}
