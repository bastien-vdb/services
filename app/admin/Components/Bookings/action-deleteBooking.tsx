"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/src/db/prisma";
import { getServerSession } from "next-auth";

async function actionDeleteBooking(id: string) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Utilisateur non connecté");

  try {
    return await prisma.booking.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Suppression impossible");
  }
}

export default actionDeleteBooking;
