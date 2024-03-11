'use server'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/src/db/prisma';
import useCheckStripe from '@/src/hooks/useCheckStripe';
import { Service } from '@prisma/client';
import { getServerSession } from 'next-auth';

async function useDeleteServerData({ service }: { service: Service }) {

  const session = await getServerSession(authOptions);
  try {
    const stripe = useCheckStripe();
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
    console.error(error);
    throw new Error("Service cannot be deleted");
  }
}

export default useDeleteServerData;