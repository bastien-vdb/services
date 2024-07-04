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

  console.log("name, firstname, email", name, firstname, email);

  try {
    return await prisma.employee.create({
      data: {
        name: name,
        firstname: firstname,
        email: email,
        createdById: session.user.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Employee cannot be created");
  }
}

export default actionCreateEmployee;
