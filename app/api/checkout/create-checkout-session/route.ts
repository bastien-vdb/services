import useServerData from "@/src/hooks/useServerData";
import { User } from "@prisma/client";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export interface RequestBody {
  stripePriceId: string;
  startTime: Date;
  userId: string;
  serviceId: string;
  bookingId: string;
  idemPotentKey: string;
}

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method !== "POST") res.status(405).json({ message: "Method not allowed" });

  if (!process.env.STRIPE_SECRET_KEY) return res.status(400).json("Stripe secret key is not defined");

  const body: RequestBody = await req.json();

  const { stripePriceId, startTime: startTime, userId, serviceId, bookingId, idemPotentKey } = body;

  const user: User[] = await useServerData("user", { id: userId });
  const { stripeAccount } = user[0];
  if (!stripeAccount) throw new Error("no destination for the founds");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

  const session = await stripe.checkout.sessions.create(
    {
      metadata: {
        bookingStartTime: String(startTime),
        bookingId,
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
      payment_intent_data: {
        application_fee_amount: 123,
        transfer_data: {
          destination: stripeAccount,
        },
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_HOST}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_HOST}/checkout/cancel`,
    },
    {
      idempotencyKey: idemPotentKey,
    }
  );

  if (!session.url) return NextResponse.json("Session cannot be created"); //return res.status(400).json("Session cannot be created");
  return NextResponse.json(session.url); //res.status(200).json(session.url);
}
