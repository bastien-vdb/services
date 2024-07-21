"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/src/db/prisma";
import { getServerSession } from "next-auth/next";

async function actionCreateEmployee({
  name,
  firstname,
  email,
}: {
  name: string;
  firstname: string;
  email: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Session is not defined");

  try {
    // Utiliser une transaction pour s'assurer que les deux opérations réussissent ou échouent ensemble
    return await prisma.$transaction(async (prisma) => {
      // Créer un utilisateur avec le rôle EMPLOYEE et le relier à son employeur
      const user = await prisma.user.create({
        data: {
          name: `${firstname} ${name}`,
          email: email,
          role: "EMPLOYEE",
          image: "/images/newArrivant.jpg",
          ownerId: session.user.id, // Lier l'utilisateur à son employeur
        },
      });

      // Créer un profil d'employé
      const employee = await prisma.employee.create({
        data: {
          name: name,
          firstname: firstname,
          email: email,
          userId: user.id, // Relier l'employé à l'utilisateur
        },
      });

      return employee;
    });
  } catch (error) {
    console.error(error);
    throw new Error("Employee cannot be created");
  }
}

export default actionCreateEmployee;
