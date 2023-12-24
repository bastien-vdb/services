import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import { createSetOfSLots } from "@/src/contexts/booking.context/createSetOfSlots";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { start, end, serviceId } = body;

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const periods = await prisma.periods.create({
      data: {
        date: start,
        start: start,
        end: end,
      },
    });
    if (periods) {
      // const startOfDay = moment(start).startOf("day").toDate();
      // const endOfDay = moment(end).endOf("day").toDate();

      const listOfSlot = createSetOfSLots(start, end);

      const bookingsData = listOfSlot.map((slot) => ({
        date: new Date(),
        startTime: slot.from,
        endTime: slot.to,
        isAvailable: true,
        serviceId: "64b38177863f172be9fa3923",
        userId: session.user.id,
      }));

      await prisma.booking.createMany({
        data: bookingsData,
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Une erreur est survenue lors de la prise de rendez-vous");
  } finally {
    const result = await (prisma["periods"] as any).findMany({
      where: {
        userId: session.user.id,
      },
    });
    return NextResponse.json(result);
  }
}
