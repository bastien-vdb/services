import next, { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
import getRawBody from "raw-body";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe secret key is not defined");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16" ,
  });

  const rawBody = await req.text()

  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error("Stripe webhook secret key is not defined");

  const signature = req.headers["stripe-signature"];

  if (signature === undefined) throw new Error("Stripe signature is not defined");
  const webhookEvent = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);

  if (webhookEvent.type === "checkout.session.completed") {
    const session = webhookEvent.data.object as any;
    // const { slot, serviceId, stripePriceId, userId } = session.metadata;
    NextResponse.redirect(`https://www.youtube.com/`);
    return new NextResponse(session);
  }
  NextResponse.redirect(`https://www.orange.fr/`);
  return new NextResponse("La session ne peut être créée");
}
