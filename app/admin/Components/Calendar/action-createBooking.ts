"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { createSetOfSLots } from "@/src/lib/createSetOfSlots";
import { prisma } from "@/src/db/prisma";
import { now } from "moment";
import { getServerSession } from "next-auth/next";
import { Booking } from "@prisma/client";

async function actionCreateBooking({ start, end }: { start: Date; end: Date }) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("You are not allowed to access this resource.");

  try {
    return await prisma.booking.create({
      data: {
        date: new Date(),
        startTime: start,
        endTime: end,
        serviceId: "64b38177863f172be9fa3923", // par default
        userId: session.user.id,
        payedBy: "",
      } as Booking,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la prise de rendez-vous");
  }
}

export default actionCreateBooking;
