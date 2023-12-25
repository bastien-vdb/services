import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, price: productPrice } = body;

  const session = await getServerSession(authOptions);

  if (!session) return new Response("You are not authenticated", { status: 400 });

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
        createdById: session.user.id,
        stripeId: service.id,
        stripePriceId: price.id,
      },
    });
    if (services) {
      const result = await prisma.service.findMany({
        where: {
          createdById: session.user.id,
        },
      });
      return NextResponse.json(result);
    }
  } catch (error: unknown) {
    console.log(error);
    // return new Response("Service cannot be created", { status: 400 });
  }
}
