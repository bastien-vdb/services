import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) return new Response("You are not authenticated", { status: 400 });

  try {
    const result = await (prisma["service"] as any).findMany({
      where: {
        createdById: session.user.id,
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    throw new Error("Data cannot be reach from the db");
  }
}
