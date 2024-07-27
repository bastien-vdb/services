"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/src/db/prisma";
import useCheckStripe from "@/src/hooks/useCheckStripe";
import { isOwner } from "@/src/utils/isOwner";
import { User } from "@prisma/client";
import { tr } from "date-fns/locale";
import { getServerSession } from "next-auth";

async function actionDeleteUser(userId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) throw new Error("Session is not defined");

    //Abstraction de vérification du role Owner
    await isOwner(session.user.id);

    if (userId === session.user.id)
      throw new Error("Vous ne pouvez pas supprimer votre propre compte");

    return await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export default actionDeleteUser;
