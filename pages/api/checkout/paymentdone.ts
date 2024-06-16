import { NextApiRequest, NextApiResponse } from "next";
import type { Readable } from "node:stream";
import useSendEmail from "@/src/emails/useSendEmail";
import EmailRdvBooked from "@/src/emails/EmailBooked";
import useCheckStripe from "@/src/hooks/useCheckStripe";
import EmailNotBooked from "@/src/emails/EmailNotBooked";
import actionCreateBooking from "@/app/admin/Components/Bookings/action-createBooking";
import moment from "moment-timezone";

export const config = {
  api: {
    bodyParser: false,
  },
};

type metadataType = {
  startTime: string;
  endTime: string;
  serviceId: string;
  stripePriceId: string;
  bookingId: string;
  userId: string;
  serviceName: string;
  addedOption: string;
  formData: string;
};

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

  let webhookEvent;
  try {
    webhookEvent = stripe.webhooks.constructEvent(
      buf,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (webhookEvent.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = webhookEvent.data.object;
        const metadata = paymentIntent.metadata as metadataType;

        const {
          startTime,
          endTime,
          serviceId,
          userId,
          serviceName,
          addedOption,
          formData,
        } = metadata;

        const startDateTmz = moment
          .utc(startTime)
          .tz("Europe/Paris")
          .format("YYYY-MM-DD HH:mm:ss");

        const customerDetails = {
          name: paymentIntent.shipping?.name ?? "NC",
          email: paymentIntent.receipt_email ?? "NC",
          phone: paymentIntent.shipping?.phone ?? "NC",
          address: paymentIntent.shipping?.address ?? {
            city: "NC",
            country: "NC",
            state: "NC",
            zip: "NC",
            line1: "NC",
            line2: "NC",
          },
        };

        const bookingCreated = await actionCreateBooking({
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          serviceId,
          userId,
          amountPayed: paymentIntent.amount,
          form: formData,
          customerInfo: customerDetails,
        });

        if (bookingCreated && customerDetails.email !== "NC") {
          await useSendEmail({
            from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
            to: [customerDetails.email],
            subject: `Rendez-vous ${serviceName} en attente.`,
            react: EmailRdvBooked({
              customerName: customerDetails.name,
              bookingStartTime: startDateTmz,
              serviceName,
              employeeName: "Natacha S",
              businessPhysicalAddress: "36 chemin des huats, 93000 Bobigny",
            }),
          });
        }
        if (!bookingCreated && customerDetails.email !== "NC") {
          await useSendEmail({
            from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
            to: [customerDetails.email],
            subject: `${customerDetails.name} Votre rendez-vous n'a pas pu être réservé`,
            react: EmailNotBooked({
              customerName: customerDetails.name,
              bookingStartTime: startDateTmz,
            }),
          });
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = webhookEvent.data.object;
        const metadata = paymentIntent.metadata as metadataType;

        const { startTime } = metadata;

        const startDateTmz = moment
          .utc(startTime)
          .tz("Europe/Paris")
          .format("YYYY-MM-DD HH:mm:ss");

        const customerEmail = paymentIntent.receipt_email ?? "NC";

        if (customerEmail !== "NC") {
          await useSendEmail({
            from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
            to: [customerEmail],
            subject: `Votre rendez-vous n'a pas pu être réservé`,
            react: EmailNotBooked({
              customerName: paymentIntent.shipping?.name ?? "Client",
              bookingStartTime: startDateTmz,
            }),
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${webhookEvent.type}`);
    }
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(400).send("Webhook error");
  }
}
