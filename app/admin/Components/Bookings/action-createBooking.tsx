"use server";
import { prisma } from "@/src/db/prisma";
import { co } from "@fullcalendar/core/internal-common";

async function actionCreateBooking({
  startTime,
  endTime,
  serviceId,
  userId,
  emailCustomer,
}: {
  startTime: Date;
  endTime: Date;
  serviceId: string;
  userId: string;
  emailCustomer: string | undefined | null;
}) {
  try {
    //reduce the availability by the booking time
    const avaibility = await prisma.availability.findFirst({
      where: {
        startTime: {
          lte: endTime,
        },
        endTime: {
          gte: startTime,
        },
      },
    });

    console.log("avaibility", avaibility);

    if (!avaibility) {
      console.log("No availability found");
      throw new Error("No availability found");
    }

    // Create a new booking
    return await prisma.booking.create({
      data: {
        startTime,
        endTime,
        serviceId,
        userId,
        status: "PENDING",
        payedBy: emailCustomer ?? "",
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Activation impossible");
  }
}

export default actionCreateBooking;
