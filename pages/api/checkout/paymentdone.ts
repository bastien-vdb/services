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
    console.log('step 1 pass');
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe secret key is not defined");
  console.log('step 2 pass');

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  console.log('step 3 pass');

  const rawBody = await getRawBody(req);

  console.log('step 4 pass');



  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error("Stripe webhook secret key is not defined");

  console.log('step5');

  const signature = req.headers["stripe-signature"];

  console.log('la signature==>', signature);

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
