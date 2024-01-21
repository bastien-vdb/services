import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import Stripe from "stripe";

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id, stripeId } = body;

  console.log("id:", id);
  console.log("stripe:Id", stripeId);

  if (!process.env.STRIPE_SECRET_KEY) return new Response("Stripe secret key is not defined", { status: 400 });
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    await stripe.products.update(stripeId, { active: false });

    await prisma.service.delete({
      where: {
        id,
      },
    });

    const result = await (prisma["service"] as any).findMany();
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.log("quoi ?", error);
    // return new Response("Service cannot be created", { status: 400 });
  }
}
