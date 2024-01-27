import { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
import getRawBody from "raw-body";
import useSetBookingUser from "@/app/admin/Components/Bookings/useSetBookingUser";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('on a bien accès à cette route API paymentDone depuis l\'exterieur');
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe secret key is not defined");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  const rawBody = await getRawBody(req);

  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error("Stripe webhook secret key is not defined");

  const signature = req.headers["stripe-signature"];

  if (signature === undefined) throw new Error("Stripe signature is not defined");
  const webhookEvent = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);

  try {
    switch (webhookEvent.type) {
      case "checkout.session.completed":
        const session = webhookEvent.data.object as any;
        // Payment was successful, you can retrieve relevant details from the session object

        // const { slot, serviceId, stripePriceId, userId } = session.metadata;

       const {
            bookingStartTime,
            serviceId,
            stripePriceId,
            bookingId,
            userId,
          } = session.metadata;

        await useSetBookingUser({bookingId, userId});
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
