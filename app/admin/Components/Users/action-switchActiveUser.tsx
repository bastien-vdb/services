"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/src/db/prisma";
import { isOwner } from "@/src/utils/isOwner";
import { getServerSession } from "next-auth/next";

async function actionSwitchActiveUser({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Session is not defined");

  try {
    //Abstraction de vérification du role Owner
    await isOwner(session.user.id);

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        active,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export default actionSwitchActiveUser;
