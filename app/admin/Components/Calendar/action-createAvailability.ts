"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/src/db/prisma";
import { getServerSession } from "next-auth/next";
import { Availability } from "@prisma/client";

async function actionCreateAvailability({
  startTime,
  endTime,
  userId,
}: {
  startTime: Date;
  endTime: Date;
  userId: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("You are not allowed to access this resource.");

  try {
    return await prisma.availability.create({
      data: {
        startTime,
        endTime,
        userId,
      } as Availability,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la prise de rendez-vous");
  }
}

export default actionCreateAvailability;
