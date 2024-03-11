import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import useCheckStripe from "@/src/hooks/useCheckStripe";

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id, stripeId } = body;

  try {
    const stripe = useCheckStripe();
    await stripe.products.update(stripeId, { active: false });
    await prisma.service.delete({
      where: {
        id,
      },
    });

    const result = await (prisma["service"] as any).findMany();
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
  }
}
