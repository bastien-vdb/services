import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import useSendEmail from "@/src/emails/useSendEmail";
import EmailRdvBooked from "@/src/emails/EmailBooked";
import actionSetBookingUser from "@/app/admin/Components/Bookings/action-setBookingUser";
import {
  paypalCheckoutOrderApprovedType,
  paypalCustomIdType,
  paypalDescriptionTransactionType,
} from "@/src/types/paypal";

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
    const webhookEvent = JSON.parse(rawBody) as paypalCheckoutOrderApprovedType; //TODO à vérifier avec ZOD

    if (webhookEvent.event_type === "CHECKOUT.ORDER.APPROVED") {
      console.log("webhookEvent res ==>", webhookEvent.resource.purchase_units);

      const { email_address: customerEmail } =
        webhookEvent.resource.purchase_units[0].payee;
      const { custom_id } = webhookEvent.resource.purchase_units[0];
      const { description } = webhookEvent.resource.purchase_units[0];
      const { startTime, endTime, userId } = JSON.parse(
        custom_id
      ) as paypalCustomIdType;
      const { serviceId, formData, addedOption } = JSON.parse(
        description
      ) as paypalDescriptionTransactionType;

      console.log("startTime ==>", startTime);
      console.log("endTime ==>", endTime);
      console.log("userId ==>", userId);
      console.log("serviceId ==>", serviceId);
      console.log("formData ==>", formData);
      console.log("addedOption ==>", addedOption);

      return res.status(200).send("Webhook traité avec succès");
    }
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    return res.status(400).send("Erreur de traitement du webhook");
  }
}
