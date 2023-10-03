import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import Stripe from "stripe";
import { th } from "date-fns/locale";

export async function PUT(request: Request) {
  const body = await request.json();
  const { id } = body;

  if (!process.env.STRIPE_SECRET_KEY) return new Response("Stripe secret key is not defined", { status: 400 });
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

    const updatedBooking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        isAvailable: true,
      },
    });
    if (updatedBooking) {
      const result = await (prisma["booking"] as any).findMany();
      return NextResponse.json(result);
    }
  } catch (error: unknown) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Appoitment cannot be booked" }), { status: 400 });
  }
}
