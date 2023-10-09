import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") res.status(405).json({ message: "Method not allowed" });

  if (!process.env.STRIPE_SECRET_KEY) return res.status(400).json("Stripe secret key is not defined");

  const { stripePriceId, slot, userId, serviceId } = req.body;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  const session = await stripe.checkout.sessions.create({
    metadata: {
        slot,
        serviceId,
        stripePriceId,
        userId,
      },
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/cancel`,
  });

  if (!session.url) return res.status(400).json("Session cannot be created");
  res.status(200).json(session.url);
}
