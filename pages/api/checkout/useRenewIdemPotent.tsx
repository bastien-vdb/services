'use server'
import { prisma } from '@/src/db/prisma';
import { v4 as uuidv4 } from 'uuid';

async function useRenewIdemPotent({ bookingId }: { bookingId: string }) {
  try {

    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        idemPotentKey: uuidv4(),
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default useRenewIdemPotent;