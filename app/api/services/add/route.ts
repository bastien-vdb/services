import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, price: productPrice } = body;

  if (!process.env.STRIPE_SECRET_KEY) return new Response("Stripe secret key is not defined", { status: 400 });
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

    const service = await stripe.products.create({
      name,
    });

    const price = await stripe.prices.create({
      unit_amount: productPrice,
      currency: "eur",
      product: service.id,
    });

    const services = await prisma.service.create({
      data: {
        name: service.name,
        price: price.unit_amount ?? 0,
        stripeId: service.id,
        stripePriceId: price.id,
      },
    });
    if (services) {
      const result = await (prisma["service"] as any).findMany();
      return NextResponse.json(result);
    }
  } catch (error: unknown) {
    console.log(error);
    // return new Response("Service cannot be created", { status: 400 });
  }
}
