import { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
import useSetBookingUser from "@/app/admin/Components/Bookings/useSetBookingUser";
import type { Readable } from "node:stream";
import useSendEmail from "@/src/emails/useSendEmail";
import EmailBooked from "@/src/emails/EmailBooked";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks: any = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe secret key is not defined");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  const buf = await buffer(req);

  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error("Stripe webhook secret key is not defined");

  const signature = req.headers["stripe-signature"];

  if (signature === undefined) throw new Error("Stripe signature is not defined");

  const webhookEvent = stripe.webhooks.constructEvent(buf, signature, process.env.STRIPE_WEBHOOK_SECRET);

  try {
    switch (webhookEvent.type) {
      case "checkout.session.completed":
        const session = webhookEvent.data.object.metadata as any;
        const customerDetails = webhookEvent.data.object.customer_details;
        const { bookingStartTime, serviceId, stripePriceId, bookingId, userId } = session;

        const isBooked = await useSetBookingUser({ bookingId });
        if (isBooked && customerDetails?.email) {
          await useSendEmail({
            from: "QuickReserve <no-answer@quickreserve.app>",
            to: [String(customerDetails.email)],
            subject: `${customerDetails.name} Votre créneau a bien été réservé`,
            react: EmailBooked({ magicLink: process.env.NEXTAUTH_URL }),
          });
        }

        break;
      default:
    }
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(400).send("Webhook error");
  }
}
