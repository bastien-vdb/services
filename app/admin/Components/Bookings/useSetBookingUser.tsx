'use server'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/src/db/prisma';
import { getServerSession } from 'next-auth';

async function useCancelBookingData({ bookingId, userId }: { bookingId: string, userId:string }) {

  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Utilisateur non connecté");

  try {

    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        userId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Réservation impossible");
  }

  try {
    await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Recharge des rendez-vous impossible");
  }
}

export default useCancelBookingData;