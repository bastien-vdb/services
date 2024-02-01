"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { createSetOfSLots } from "@/src/lib/createSetOfSlots";
import { prisma } from "@/src/db/prisma";
import { now } from "moment";
import { getServerSession } from "next-auth/next";

async function useCreatePeriodData({ start, end, duree, joursOuvrables }: { start: Date; end: Date; duree: number; joursOuvrables: number[] }) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("You are not allowed to access this resource.");

  try {
    const periodeExistante = await prisma.periods.findMany({
      where: {
        createdById: session.user.id,
        OR: [
          {
            start: {
              lte: end,
            },
            end: {
              gte: start,
            },
          },
        ],
      },
    });
    if (periodeExistante && periodeExistante.length > 0) {
      throw new Error("Une période existe déjà sur cette période");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erreur lors de la recherche de périodes existantes");
  }

  try {
    const periods = await prisma.periods.create({
      data: {
        date: new Date(now()),
        start: start,
        end: end,
        createdById: session.user.id,
      },
    });
    if (periods) {
      const listOfSlot = createSetOfSLots(start, end, duree);

      const bookingsData = listOfSlot
        .map((slot) => {
          if (!joursOuvrables.includes(slot.from.getDay())) return;
          return {
            date: new Date(),
            startTime: slot.from,
            endTime: slot.to,
            serviceId: "64b38177863f172be9fa3923",
            userId: session.user.id,
          };
        })
        .filter((a) => a !== undefined);

      await prisma.booking.createMany({
        data: bookingsData as any,
      });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la prise de rendez-vous");
  } finally {
    const result = await prisma.periods.findMany({
      where: {
        createdById: session.user.id,
      },
    });
    return result;
  }
}

export default useCreatePeriodData;
