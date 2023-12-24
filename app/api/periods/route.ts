import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const result = await (prisma["periods"] as any).findMany({
      where: {
        createdById: session.user.id,
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    throw new Error("Data cannot be reach from the db");
  }
}
