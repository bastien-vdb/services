"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/src/db/prisma";
import { getServerSession } from "next-auth/next";
import { Availability, User } from "@prisma/client";

async function actionGetBookingAllOwned({ users }: { users: User[] }) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("You are not allowed to access this resource.");

  try {
    return await prisma.booking.findMany({
      where: {
        userId: {
          in: users.map((user) => user.id),
        },
      },
      include: {
        user: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la prise de rendez-vous");
  }
}

export default actionGetBookingAllOwned;
