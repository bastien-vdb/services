"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/src/db/prisma";
import useCheckStripe from "@/src/hooks/useCheckStripe";
import { isOwner } from "@/src/utils/isOwner";
import { Service } from "@prisma/client";
import { getServerSession } from "next-auth";

async function actionDeleteService({ service }: { service: Service }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) throw new Error("Session is not defined");

    //Abstraction de vérification du role Owner
    await isOwner(session.user.id);

    const stripe = useCheckStripe();
    if (!service.stripeId) throw new Error("Stripe id is not defined");
    return await stripe.products
      .update(service.stripeId, { active: false })
      .then(
        async () =>
          await prisma.service.delete({
            where: {
              id: service.id,
            },
          })
      );
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export default actionDeleteService;
