import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method !== "POST") res.status(405).json({ message: "Method not allowed" });

  if (!process.env.STRIPE_SECRET_KEY) return res.status(400).json("Stripe secret key is not defined");

  const body = await req.json();

  const { stripePriceId, startTime: slot, userId, serviceId } = body;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  console.log("inside stripe 1: ");

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
    success_url: `${process.env.NEXT_PUBLIC_HOST}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_HOST}/checkout/cancel`,
  });

  console.log("session stripe: ", session);

  if (!session.url) return NextResponse.json("Session cannot be created"); //return res.status(400).json("Session cannot be created");
  return NextResponse.json(session.url); //res.status(200).json(session.url);
}