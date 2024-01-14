'use server'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/src/db/prisma';
import { Service } from '@prisma/client';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';

async function useDeleteServerData({ service }: { service: Service }) {

  const session = await getServerSession(authOptions);
  if (!process.env.STRIPE_SECRET_KEY) return new Response("Stripe secret key is not defined", { status: 400 });
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
    if (!service.stripeId) throw new Error("Stripe id is not defined");
    await stripe.products.update(service.stripeId, { active: false });

    await prisma.service.delete({
      where: {
        id: service.id,
      },
    });

    const result = await prisma.service.findMany({
      where: {
        createdById: session?.user.id,
      },
    });
    return result;
  } catch (error: unknown) {
    console.log("error", error);
    throw new Error("Service cannot be deleted");
  }
}

export default useDeleteServerData;