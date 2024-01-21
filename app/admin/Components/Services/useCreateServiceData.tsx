'use server'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/src/db/prisma';
import { getServerSession } from 'next-auth/next';
import Stripe from 'stripe';

async function useCreateServerData({ name, price: productPrice }: { name: string, price: number }) {

  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Session is not defined");

  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe secret key is not defined");
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    const service = await stripe.products.create({
      name,
    });

    const price = await stripe.prices.create({
      unit_amount: productPrice,
      currency: "eur",
      product: service.id,
    });

    const services = await prisma.service.create({
      data: {
        name: service.name,
        price: price.unit_amount ?? 0,
        createdById: session.user.id,
        stripeId: service.id,
        stripePriceId: price.id,
      },
    });
    if (services) {
      const result = await prisma.service.findMany({
        where: {
          createdById: session.user.id,
        },
      });
      return result;
    }
  } catch (error: unknown) {
    console.log(error);
    throw new Error("Service cannot be created");
  }

}

export default useCreateServerData;