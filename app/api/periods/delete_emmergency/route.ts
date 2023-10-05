import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";

export async function DELETE(request: Request) {
  try {
    const result = await prisma.booking.deleteMany({
      where: {
        startTime: {
          gte: "2023-10-01T00:00:00.000+00:00",
        },
        endTime: {
          lte: "2023-10-31T23:00:00.000+00:00",
        },
      },
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    return new Response("Period cannot be deleted", { status: 400 });
  }
}
