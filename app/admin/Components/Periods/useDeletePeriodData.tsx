'use server'
import { prisma } from '@/src/db/prisma';
import { Periods } from '@prisma/client';
import moment from 'moment';

async function useDeletePeriodData({period }: {period: Periods}) {

    try {
      const response = await prisma.booking.deleteMany({
        where: {
          startTime: {
            gte: period.start,
          },
          endTime: {
            lte: moment(period.end).add(1, "seconds").toDate(),
          },
        },
      });
  
      if (!response) throw new Error("Period cannot be deleted");
  
      await prisma.periods.delete({
        where: {
          id: period.id,
        },
      });
  
      const result = await prisma.periods.findMany();
      return result;
    } catch (error: unknown) {
      console.error(error);
      throw new Error("Period cannot be deleted");
    }
}

export default useDeletePeriodData;