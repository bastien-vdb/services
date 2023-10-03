import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";

export async function GET(req: Request) {
  try {
    const result = await (prisma["service"] as any).findMany();
    return NextResponse.json(result);
  } catch (error) {
    throw new Error("Data cannot be reach from the db");
  }
}
