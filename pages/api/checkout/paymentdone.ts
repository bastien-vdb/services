import { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
import useSetBookingUser from "@/app/admin/Components/Bookings/useSetBookingUser";
import getRawBody from "raw-body";
import type { Readable } from 'node:stream';
import { prisma } from '@/src/db/prisma';


export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks:any = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe secret key is not defined");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  const buf = await buffer(req);

  // Récupère le corps de la requête sous forme de chaîne de caractères
//   const rawBody = JSON.stringify(req.body);
// const rawBody = await getRawBody(req.body);


  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error("Stripe webhook secret key is not defined");

  const signature = req.headers["stripe-signature"];

  if (signature === undefined) throw new Error("Stripe signature is not defined");

  // Construit l'événement à partir du corps de la requête et de la signature
  const webhookEvent = stripe.webhooks.constructEvent(buf, signature, process.env.STRIPE_WEBHOOK_SECRET);

  try {
    switch (webhookEvent.type) {    
      case "checkout.session.completed":
        const session = webhookEvent.data.object.metadata as any;
        const {
          bookingStartTime,
          serviceId,
          stripePriceId,
          bookingId,
          userId,
        } = session;

        console.log('bookingId:', bookingId, 'userId:', userId);

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