import { prisma } from "@/src/db/prisma";

//Middleware pour vérifier si l'utilisateur est un Owner
export const isOwner = async (id: string) => {
  const userRole = await prisma.user
    .findFirst({
      where: {
        id,
      },
    })
    .then((user) => user?.role);

  console.log("userRole", userRole);

  if (userRole !== "OWNER") {
    throw new Error("User is not an admin");
  }
};
