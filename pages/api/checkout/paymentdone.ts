import { metadata } from "./../../../app/layout";
import { NextApiRequest, NextApiResponse } from "next";
import type { Readable } from "node:stream";
import useSendEmail from "@/src/emails/useSendEmail";
import EmailRdvBooked from "@/src/emails/EmailBooked";
import useCheckStripe from "@/src/hooks/useCheckStripe";
import EmailNotBooked from "@/src/emails/EmailNotBooked";
import actionCreateBooking from "@/app/admin/Components/Bookings/action-createBooking";
import moment from "moment-timezone";
import { J } from "@fullcalendar/core/internal-common";
import EmailPaymentReceived from "@/src/emails/EmailPaymentReceived";
import useServerData from "@/src/hooks/useServerData";
import { PrismaClient } from "@prisma/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

type metadataType = {
  dates: [string, string];
  serviceId: string;
  stripePriceId: string;
  bookingId: string;
  userId: string;
  serviceName: string;
  addedOption: string;
  formData: string;
  employeeId: string;
  employeeName: string;
};

const prisma = new PrismaClient();

async function buffer(readable: Readable) {
  const chunks: any = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stripe = useCheckStripe();

  const buf = await buffer(req);

  if (!process.env.STRIPE_WEBHOOK_SECRET)
    throw new Error("Stripe webhook secret key is not defined");

  const signature = req.headers["stripe-signature"];

  if (signature === undefined)
    throw new Error("Stripe signature is not defined");

  const webhookEvent = stripe.webhooks.constructEvent(
    buf,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  try {
    switch (webhookEvent.type) {
      case "charge.succeeded":
        const metadata = webhookEvent.data.object.metadata;
        const customerDetails = webhookEvent.data.object.billing_details;
        const {
          dates,
          serviceId,
          userId,
          serviceName,
          addedOption,
          formData,
          employeeId,
          employeeName,
        } = metadata;

        const userEmployee = await prisma.user.findFirst({
          where: { id: employeeId },
        });

        const startTime = JSON.parse(dates)[0];
        const endTime = JSON.parse(dates)[1];

        const startDateTmz = moment
          .utc(startTime)
          .tz("Europe/Paris")
          .format("YYYY-MM-DD HH:mm:ss");

        const bookingCreated = await actionCreateBooking({
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          serviceId,
          userId: employeeId,
          amountPayed: webhookEvent.data.object.amount_captured / 100,
          form: formData,
          customerInfo: {
            name: customerDetails?.name ? customerDetails.name : "NC",
            email: customerDetails?.email ? customerDetails.email : "NC",
            phone: customerDetails?.phone ? customerDetails.phone : "NC",
            firstname: customerDetails.address?.city, //TODO: hack pour récupe le firstname avec Stripe (solution la plus simple pour le moment)
          },
        });

        if (bookingCreated && customerDetails?.email) {
          await useSendEmail({
            from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
            to: [customerDetails.email],
            subject: `Rendez-vous ${serviceName} en attente.`,
            react: EmailRdvBooked({
              customerName: customerDetails.address?.city ?? "",
              bookingStartTime: startDateTmz,
              serviceName,
              employeeName,
              businessPhysicalAddress: userEmployee?.address ?? "",
              phone: String(userEmployee?.phone),
            }),
          });

          userEmployee?.email &&
            (await useSendEmail({
              from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
              to: [userEmployee.email],
              subject: `Vous avez un Rendez-vous ${serviceName} en attente.`,
              react: EmailPaymentReceived({
                customerName: `${customerDetails.address?.city} ${customerDetails.name}`,
                bookingStartTime: startDateTmz,
                serviceName,
                employeeName,
                businessPhysicalAddress: userEmployee.address ?? "",
                phone: String(userEmployee.phone),
              }),
            }));
        }
        if (!bookingCreated && customerDetails?.email) {
          await useSendEmail({
            from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
            to: [String(customerDetails.email)],
            subject: `${customerDetails.address?.city} Votre n'a pas pu être réservé`,
            react: EmailNotBooked({
              customerName: customerDetails.name ?? "",
              bookingStartTime: startDateTmz,
            }),
          });
        }
        break;
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(400).send("Webhook error");
  }
}
