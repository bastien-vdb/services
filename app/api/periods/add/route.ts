import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import { createSetOfSLots } from "@/src/lib/createSetOfSlots";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { start, end, duree } = body;

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

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
    if (periodeExistante.length > 0) {
      throw new Error("Une période existe déjà sur cette période");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Erreur lors de la recherche de périodes existantes");
  }

  try {
    const periods = await prisma.periods.create({
      data: {
        date: start,
        start: start,
        end: end,
        createdById: session.user.id,
      },
    });
    if (periods) {
      const listOfSlot = createSetOfSLots(start, end, duree);

      const bookingsData = listOfSlot.map((slot) => ({
        date: new Date(),
        startTime: slot.from,
        endTime: slot.to,
        isAvailable: true,
        serviceId: "64b38177863f172be9fa3923",
        userId: session.user.id,
      }));

      await prisma.booking.createMany({
        data: bookingsData,
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Une erreur est survenue lors de la prise de rendez-vous");
  } finally {
    const result = await prisma.periods.findMany({
      where: {
        createdById: session.user.id,
      },
    });
    return NextResponse.json(result);
  }
}
