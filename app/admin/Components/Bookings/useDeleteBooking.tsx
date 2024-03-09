'use server'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/src/db/prisma';
import { Booking } from '@prisma/client';
import { getServerSession } from 'next-auth';

async function useDeleteBooking({ booking }: { booking: Booking }) {

  const session = await getServerSession(authOptions);

  if (!session) throw new Error("Utilisateur non connecté");

  try {

    await prisma.booking.delete({
      where: {
        id: booking.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Suppression impossible");
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

export default useDeleteBooking;