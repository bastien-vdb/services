import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";

export async function GET(request: Request) {
  try {
    const result = await (prisma["periods"] as any).findMany();
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    throw new Error("Data cannot be reach from the db");
  }
}
