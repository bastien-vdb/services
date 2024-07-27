import actionCreateBooking from "@/app/admin/Components/Bookings/action-createBooking";
import EmailRdvBooked from "@/src/emails/EmailBooked";
import EmailNotBooked from "@/src/emails/EmailNotBooked";
import EmailPaymentReceived from "@/src/emails/EmailPaymentReceived";
import useSendEmail from "@/src/emails/useSendEmail";
import {
  paypalCheckoutOrderApprovedType,
  paypalCustomIdType,
  paypalDescriptionItemType,
} from "@/src/types/paypal";
import { PrismaClient, Service } from "@prisma/client";
import { buffer } from "micro";
import moment from "moment-timezone";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

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
      const { userId, formData, employeeName, employeeId } = JSON.parse(
        webhookEvent.resource.purchase_units[0].custom_id
      ) as paypalCustomIdType;
      const serviceId = webhookEvent.resource.purchase_units[0].description;
      const { startTime, endTime } = JSON.parse(
        webhookEvent.resource.purchase_units[0].items[0].description
      ) as paypalDescriptionItemType;

      const startDateTmz = moment
        .utc(startTime)
        .tz("Europe/Paris")
        .format("YYYY-MM-DD HH:mm:ss");

      const { employee: employeeEmail } = formData;

      const bookingCreated = await actionCreateBooking({
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        serviceId,
        userId: employeeId,
        amountPayed: Number(
          webhookEvent.resource.purchase_units[0].amount.value
        ),
        form: JSON.stringify(formData),
        customerInfo: {
          name:
            webhookEvent.resource.purchase_units[0].shipping.name.full_name ??
            "NC",
          email: webhookEvent.resource.payer.email_address ?? "NC",
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

      let service: Service | null;
      try {
        service = await prisma.service.findFirst({
          where: { id: serviceId },
        });
      } catch (error) {
        console.error("Erreur lors de la recherche du service:", error);
        return res.status(400).send("Erreur lors de la recherche du service");
      }

      if (bookingCreated && webhookEvent.resource.payer.email_address) {
        await useSendEmail({
          from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
          to: [webhookEvent.resource.payer.email_address],
          subject: `Rendez-vous ${service?.name} en attente.`,
          react: EmailRdvBooked({
            customerName:
              webhookEvent.resource.purchase_units[0].shipping.name.full_name ??
              "",
            bookingStartTime: startDateTmz,
            serviceName: service?.name ?? "",
            employeeName,
            businessPhysicalAddress: "36 chemin des huats, 93000 Bobigny",
          }),
        });

        employeeEmail &&
          (await useSendEmail({
            from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
            to: [employeeEmail],
            subject: `Vous avez un Rendez-vous ${service?.name} en attente.`,
            react: EmailPaymentReceived({
              customerName:
                webhookEvent.resource.purchase_units[0].shipping.name
                  .full_name ?? "",
              bookingStartTime: startDateTmz,
              serviceName: service?.name ?? "",
              employeeName,
              businessPhysicalAddress: "36 chemin des huats, 93000 Bobigny",
            }),
          }));
      }
      if (!bookingCreated && webhookEvent.resource.payer.email_address) {
        await useSendEmail({
          from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
          to: [webhookEvent.resource.payer.email_address],
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
