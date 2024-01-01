'use server'
import { prisma } from '@/src/db/prisma';
import { Periods } from '@prisma/client';
import moment from 'moment';

async function useDeletePeriodData({ period }: { period: Periods }) {

  try {
    await prisma.booking.deleteMany({
      where: {
        startTime: {
          gte: period.start,
        },
        endTime: {
          lte: moment(period.end).add(1, "seconds").toDate(),
        },
      },
    });
  } catch (error) {
    console.error(error)
    throw new Error("Impossible de supprimer les rendez-vous de cette période");
  }

  try {
    await prisma.periods.delete({
      where: {
        id: period.id,
      },
    })
  }
  catch (error) {
    console.error(error);
    throw new Error("La période ne peut pas être supprimée");
  }

  try {
    const result = await prisma.periods.findMany({
      where: {
        createdById: period.createdById
      }
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de recharger les périodes");
  }
}

export default useDeletePeriodData;