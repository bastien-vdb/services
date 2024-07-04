"use server";
import { prisma } from "@/src/db/prisma";
import { Employee } from "@prisma/client";

async function actionDeleteEmployee({ employee }: { employee: Employee }) {
  try {
    return await prisma.employee.delete({
      where: {
        id: employee.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Employee cannot be deleted");
  }
}

export default actionDeleteEmployee;
