import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import moment from "moment";

export async function DELETE(request: Request) {
  const body = await request.json();
  const { period } = body;

  try {
    const response = await prisma.booking.deleteMany({
      where: {
        startTime: {
          gte: period.start,
        },
        endTime: {
          lte: moment(period.end).add(1, "seconds").toDate(),
        },
      },
    });

    if (!response) throw new Error("Period cannot be deleted");

    await prisma.periods.delete({
      where: {
        id: period.id,
      },
    });

    const result = await (prisma["periods"] as any).findMany();
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.log("quoi ?", error);
    return new Response("Period cannot be deleted", { status: 400 });
  }
}
