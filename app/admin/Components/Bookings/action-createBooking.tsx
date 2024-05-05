import { av } from "@fullcalendar/core/internal-common";
import { Availability, PrismaClient } from "@prisma/client";
import { de } from "date-fns/locale";
const prisma = new PrismaClient();

async function actionCreateBooking({
  startTime,
  endTime,
  serviceId,
  userId,
  emailCustomer,
}: {
  startTime: Date;
  endTime: Date;
  serviceId: string;
  userId: string;
  emailCustomer: string | undefined | null;
}) {
  try {
    // Chercher la première disponibilité qui chevauche la réservation
    const availability = await prisma.availability.findFirst({
      where: {
        startTime: {
          lte: endTime,
        },
        endTime: {
          gte: startTime,
        },
      },
    });

    if (!availability) {
      throw new Error("No availability found");
    }

    // Gérer la création de la réservation et la mise à jour des disponibilités dans une transaction
    const result = await prisma.$transaction(async (prisma) => {
      const updates = [] as Availability[];

      // Si la réservation commence après le début de la disponibilité
      if (startTime > availability.startTime) {
        const newAvailability = await prisma.availability.create({
          data: {
            startTime: availability.startTime,
            endTime: startTime,
            userId: availability.userId,
          },
        });
        updates.push(newAvailability);
      }

      // Si la réservation finit avant la fin de la disponibilité
      if (endTime < availability.endTime) {
        const newAvailability = await prisma.availability.create({
          data: {
            startTime: endTime,
            endTime: availability.endTime,
            userId: availability.userId,
          },
        });
        updates.push(newAvailability);
      }

      // Supprimer l'ancienne disponibilité
      await prisma.availability.delete({
        where: { id: availability.id },
      });

      // Créer la nouvelle réservation
      const booking = await prisma.booking.create({
        data: {
          startTime,
          endTime,
          serviceId,
          userId,
          status: "PENDING",
          payedBy: emailCustomer ?? "",
        },
      });

      updates.push(booking);

      return updates;
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create booking");
  }
}

export default actionCreateBooking;
