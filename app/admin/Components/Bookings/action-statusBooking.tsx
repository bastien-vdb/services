"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/src/db/prisma";
import { BookingStatus } from "@prisma/client";
import { getServerSession } from "next-auth";

async function actionStatusBooking(id: string, status: BookingStatus) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Utilisateur non connecté");

  try {
    return await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Activation impossible");
  }
}

export default actionStatusBooking;
