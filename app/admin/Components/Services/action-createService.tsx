"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/src/db/prisma";
import useCheckStripe from "@/src/hooks/useCheckStripe";
import { isOwner } from "@/src/utils/isOwner";
import { getServerSession } from "next-auth/next";

async function actionCreateService({
  name,
  price: productPrice,
  duration,
  userId,
}: {
  name: string;
  price: number;
  duration: number;
  userId: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Session is not defined");

  try {
    //Abstraction de vérification du role Owner
    await isOwner(session.user.id);

    const stripe = useCheckStripe();
    const service = await stripe.products.create({
      name,
    });

    const price = await stripe.prices.create({
      unit_amount: productPrice,
      currency: "eur",
      product: service.id,
    });

    return await prisma.service.create({
      data: {
        name: service.name,
        price: price.unit_amount ?? 0,
        duration,
        createdById: session.user.id,
        stripeId: service.id,
        stripePriceId: price.id,
        userId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export default actionCreateService;
