'use server'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/src/db/prisma';
import { getServerSession } from 'next-auth';

async function useSetBookingUser({ bookingId, userId }: { bookingId: string, userId:string }) {

  try {

    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        payed: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Réservation impossible");
  }
}

export default useSetBookingUser;