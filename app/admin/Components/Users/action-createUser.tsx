"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/src/db/prisma";
import useCheckStripe from "@/src/hooks/useCheckStripe";
import { getServerSession } from "next-auth/next";

async function actionCreateUser({
  name,
  firstname,
  email,
  ownerId,
}: {
  name: string;
  firstname: string;
  email: string;
  ownerId: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Session is not defined");
  const userRole = await prisma.user
    .findFirst({
      where: {
        id: session.user.id,
      },
    })
    .then((user) => user?.role);

  if (userRole !== "OWNER") {
    throw new Error("User is not an admin");
  }

  try {
    return await prisma.$transaction(async (prisma) => {
      // Créer un utilisateur avec le rôle EMPLOYEE et le relier à son employeur
      const user = await prisma.user.create({
        data: {
          name,
          firstname,
          email,
          role: "EMPLOYEE",
          ownerId, // Assigner l'ID de l'employeur ici
          image: "/images/newArrivant.jpg",
        },
      });

      return user;
    });
  } catch (error) {
    console.error(error);
    throw new Error("Service cannot be created");
  }
}

export default actionCreateUser;
