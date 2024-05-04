"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/src/db/prisma";
import { getServerSession } from "next-auth";

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
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Utilisateur non connecté");

  console.log("emailCustomer", emailCustomer);

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
