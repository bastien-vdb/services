'use server'
import { prisma } from '@/src/db/prisma';

async function useSetBookingUser({ bookingId }: { bookingId: string }) {

  try {
    const bookinFound = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (bookinFound?.payed) throw new Error("Réservation déjà payée");

    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        payed: true,
        isAvailable: false
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default useSetBookingUser;