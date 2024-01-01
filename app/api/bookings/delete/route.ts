import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import Stripe from "stripe";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function PUT(request: Request) {
  const body = await request.json();
  const { id } = body;

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

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
      const result = await prisma.booking.findMany({
        where: {
          userId: session.user.id,
        },
      });
      return NextResponse.json(result);
    }
  } catch (error: unknown) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Appoitment cannot be booked" }), { status: 400 });
  }
}
