import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import useCheckStripe from "@/src/hooks/useCheckStripe";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, price: productPrice } = body;

  const session = await getServerSession(authOptions);

  if (!session) return new Response("You are not authenticated", { status: 400 });

  try {
    const stripe = useCheckStripe();
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
    console.error(error);
  }
}
