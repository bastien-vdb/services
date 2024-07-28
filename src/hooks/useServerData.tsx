"use server";
import { prisma } from "@/src/db/prisma";
import { PrismaClient } from "@prisma/client";

async function useServerData(
  prismaKey: keyof PrismaClient,
  where: { [key: string]: unknown }
): Promise<any> {
  try {
    return await (prisma[prismaKey] as any).findMany({
      where,
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export default useServerData;
