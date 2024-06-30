"use server";
import { prisma } from "@/src/db/prisma";
import useCheckStripe from "@/src/hooks/useCheckStripe";
import { Service } from "@prisma/client";

async function actionDeleteService({ service }: { service: Service }) {
  try {
    const stripe = useCheckStripe();
    if (!service.stripeId) throw new Error("Stripe id is not defined");
    console.log("actionDeleteService");
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
    throw new Error("Service cannot be deleted");
  }
}

export default actionDeleteService;
