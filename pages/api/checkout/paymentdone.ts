import { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
import useSetBookingUser from "@/app/admin/Components/Bookings/useSetBookingUser";
import getRawBody from "raw-body";

export const config = {
  api: {
    bodyParser: false, // Désactive le bodyParser de Next.js
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe secret key is not defined");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  console.log('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY)

  // Récupère le corps de la requête sous forme de chaîne de caractères
  const rawBody = JSON.stringify(req.body);
// const rawBody = await getRawBody(req);

console.log('rawBody', rawBody);

  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error("Stripe webhook secret key is not defined");

  const signature = req.headers["stripe-signature"];

  if (signature === undefined) throw new Error("Stripe signature is not defined");

  // Construit l'événement à partir du corps de la requête et de la signature
  const webhookEvent = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);

  try {
    switch (webhookEvent.type) {
      case "checkout.session.completed":
        const session = webhookEvent.data.object as any;
        const {
          bookingStartTime,
          serviceId,
          stripePriceId,
          bookingId,
          userId,
        } = session.metadata;

        await useSetBookingUser({ bookingId, userId });
        break;
      default:
        console.log("Unhandled event type:", webhookEvent.type);
    }
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(400).send("Webhook error");
  }
}