"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
const prisma = new PrismaClient();

async function actionGetBooking(userId?: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Utilisateur non connecté");
  try {
    const r = await prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        customer: true, // Inclure les détails du client
        service: true, // Inclure les détails du service
      },
    });
    console.log("Réservations récupérées", r);
    return r;
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les réservations");
  }
}

export default actionGetBooking;
