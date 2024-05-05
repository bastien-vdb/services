"use server";
import { prisma } from "@/src/db/prisma";

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
