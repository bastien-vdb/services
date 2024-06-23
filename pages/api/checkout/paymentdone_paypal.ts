import actionCreateBooking from "@/app/admin/Components/Bookings/action-createBooking";
import EmailRdvBooked from "@/src/emails/EmailBooked";
import EmailNotBooked from "@/src/emails/EmailNotBooked";
import useSendEmail from "@/src/emails/useSendEmail";
import {
  paypalCheckoutOrderApprovedType,
  paypalCustomIdType,
  paypalDescriptionTransactionType,
} from "@/src/types/paypal";
import { buffer } from "micro";
import moment from "moment-timezone";
import { NextApiRequest, NextApiResponse } from "next";

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
      const { serviceId, formData } = JSON.parse(
        description
      ) as paypalDescriptionTransactionType;

      console.log("startTime ==>", startTime);
      console.log("endTime ==>", endTime);
      console.log("userId ==>", userId);
      console.log("serviceId ==>", serviceId);
      console.log("formData ==>", formData);

      const startDateTmz = moment
        .utc(startTime)
        .tz("Europe/Paris")
        .format("YYYY-MM-DD HH:mm:ss");

      const bookingCreated = await actionCreateBooking({
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        serviceId,
        userId,
        amountPayed: Number(
          webhookEvent.resource.purchase_units[0].payments.captures[0].amount
            .value
        ),
        form: JSON.stringify(formData),
        customerInfo: {
          name:
            webhookEvent.resource.purchase_units[0].shipping.name.full_name ??
            "NC",
          email:
            webhookEvent.resource.purchase_units[0].payee.email_address ?? "NC",
          phone: "NC",
          address: {
            city:
              webhookEvent.resource.purchase_units[0].shipping.address
                .admin_area_2 ?? "NC",
            country:
              webhookEvent.resource.purchase_units[0].shipping.address
                .country_code ?? "NC",
            state:
              webhookEvent.resource.purchase_units[0].shipping.address
                .admin_area_1 ?? "NC",
            zip:
              webhookEvent.resource.purchase_units[0].shipping.address
                .postal_code ?? "NC",
            line1:
              webhookEvent.resource.purchase_units[0].shipping.address
                .address_line_1 ?? "NC",
            line2:
              webhookEvent.resource.purchase_units[0].shipping.address
                .admin_area_1 ?? "NC",
          },
        },
      });

      if (
        bookingCreated &&
        webhookEvent.resource.purchase_units[0].payee.email_address
      ) {
        await useSendEmail({
          from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
          to: [webhookEvent.resource.purchase_units[0].payee.email_address],
          subject: `Rendez-vous ${webhookEvent.resource.purchase_units[0].items[0].name} en attente.`,
          react: EmailRdvBooked({
            customerName:
              webhookEvent.resource.purchase_units[0].shipping.name.full_name ??
              "",
            bookingStartTime: startDateTmz,
            serviceName: webhookEvent.resource.purchase_units[0].items[0].name,
            employeeName: "Natacha S",
            businessPhysicalAddress: "36 chemin des huats, 93000 Bobigny",
          }),
        });
      }
      if (
        !bookingCreated &&
        webhookEvent.resource.purchase_units[0].payee.email_address
      ) {
        await useSendEmail({
          from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
          to: [
            String(webhookEvent.resource.purchase_units[0].payee.email_address),
          ],
          subject: `${webhookEvent.resource.purchase_units[0].shipping.name.full_name} Votre n'a pas pu être réservé`,
          react: EmailNotBooked({
            customerName:
              webhookEvent.resource.purchase_units[0].items[0].name ?? "",
            bookingStartTime: startDateTmz,
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
