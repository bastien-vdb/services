import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import { createSetOfSLots } from "@/src/contexts/booking.context/createSetOfSlots";
import moment from "moment";

export async function POST(request: Request) {
  const body = await request.json();
  const { start, end, serviceId } = body;

  console.log("start !-", start);
  console.log("end !-", end);

  try {
    const periods = await prisma.periods.create({
      data: {
        date: start,
        start: start,
        end: end,
      },
    });
    if (periods) {
      const startOfDay = moment(start).clone().startOf("day").toDate();
      const endOfDay = moment(end).clone().endOf("day").toDate();

      const listOfSlot = createSetOfSLots(startOfDay, endOfDay);

      const bookingsData = listOfSlot.map((slot) => ({
        date: new Date(),
        startTime: slot.from,
        endTime: slot.to,
        isAvailable: true,
        serviceId: "64b38177863f172be9fa3923",
        userId: "64b079598769f2cee43679c9",
      }));

      await prisma.booking.createMany({
        data: bookingsData,
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Une erreur est survenue lors de la prise de rendez-vous");
  } finally {
    const result = await (prisma["periods"] as any).findMany();
    return NextResponse.json(result);
  }
}
