import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import Stripe from "stripe";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export async function PUT(request: Request) {
  const body = await request.json();
  const { id } = body;

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
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
