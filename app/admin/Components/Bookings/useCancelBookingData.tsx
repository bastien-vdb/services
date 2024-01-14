'use server'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/src/db/prisma';
import { Booking } from '@prisma/client';
import { getServerSession } from 'next-auth';

async function useCancelBookingData({ booking }: { booking: Booking }) {

  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Utilisateur non connecté");

  try {

    await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        isAvailable: false,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Annulation impossible");
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