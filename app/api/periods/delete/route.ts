import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;

  try {
    await prisma.periods.delete({
      where: {
        id,
      },
    });

    const result = await (prisma["periods"] as any).findMany();
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.log("quoi ?", error);
    return new Response("Period cannot be deleted", { status: 400 });
  }
}
