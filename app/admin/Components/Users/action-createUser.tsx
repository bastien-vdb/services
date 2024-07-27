"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/src/db/prisma";
import { isOwner } from "@/src/utils/isOwner";
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

  try {
    //Abstraction de vérification du role Owner
    await isOwner(session.user.id);

    return await prisma.user.create({
      data: {
        name,
        firstname,
        email,
        role: "EMPLOYEE",
        ownerId, // Assigner l'ID de l'employeur ici
        image: "/images/newArrivant.jpg",
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export default actionCreateUser;
