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
import { PrismaClient } from "@prisma/client";
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
      const { customer, formData } = JSON.parse(
        webhookEvent.resource.purchase_units[0].custom_id
      ) as paypalCustomIdType;
      const { name, firstName: firstname, email, phone } = customer;
      const serviceId = webhookEvent.resource.purchase_units[0].description;
      const { startTime, endTime } = JSON.parse(
        webhookEvent.resource.purchase_units[0].items[0].description
      ) as paypalDescriptionItemType;

      const service = await prisma.service.findFirst({
        where: { id: serviceId },
      });

      if (!service || !service.userId) throw new Error("Service not found");

      const userEmployee = await prisma.user.findFirst({
        where: { id: service.userId },
      });

      const startDateTmz = moment
        .utc(startTime)
        .tz("Europe/Paris")
        .format("YYYY-MM-DD HH:mm:ss");

      if (!userEmployee) throw new Error("Employee not found");

      const bookingCreated = await actionCreateBooking({
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        serviceId,
        userId: userEmployee.id,
        amountPayed: Number(
          webhookEvent.resource.purchase_units[0].amount.value
        ),
        form: JSON.stringify(formData),
        customerInfo: {
          name,
          firstname,
          email,
          phone,
        },
      });

      if (bookingCreated && email) {
        await useSendEmail({
          from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
          to: [email],
          subject: `Rendez-vous ${service?.name} en attente.`,
          react: EmailRdvBooked({
            customerName: firstname,
            bookingStartTime: startDateTmz,
            serviceName: service?.name ?? "",
            employeeName: userEmployee.name ?? "",
            businessPhysicalAddress: userEmployee?.address ?? "",
            phone: String(userEmployee?.phone),
          }),
        });

        userEmployee.email &&
          (await useSendEmail({
            from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
            to: [userEmployee.email],
            subject: `Vous avez un Rendez-vous ${service.name} en attente.`,
            react: EmailPaymentReceived({
              customerName: `${firstname} ${name}`,
              bookingStartTime: startDateTmz,
              serviceName: service?.name ?? "",
              employeeName: userEmployee.name ?? "",
              businessPhysicalAddress: userEmployee.address ?? "",
              phone: String(userEmployee?.phone),
            }),
          }));
      }
      if (!bookingCreated && email) {
        await useSendEmail({
          from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
          to: [email],
          subject: `${webhookEvent.resource.purchase_units[0].shipping.name.full_name} Votre rendez-vous n'a pas pu être réservé`,
          react: EmailNotBooked({
            customerName: firstname,
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
