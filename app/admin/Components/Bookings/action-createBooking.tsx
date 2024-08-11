import { Customer, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function actionCreateBooking({
  startTime,
  endTime,
  serviceId,
  userId,
  amountPayed,
  form,
  customerInfo,
}: {
  startTime: Date;
  endTime: Date;
  serviceId: string;
  userId: string;
  amountPayed;
  form: string;
  customerInfo: Partial<Customer>;
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
        userId,
      },
    });

    if (!availability) {
      throw new Error("No availability found");
    }

    // Gérer la création de la réservation et la mise à jour des disponibilités dans une transaction
    return await prisma.$transaction(async (prisma) => {
      // Si la réservation commence après le début de la disponibilité
      if (startTime > availability.startTime) {
        await prisma.availability.create({
          data: {
            startTime: availability.startTime,
            endTime: startTime,
            userId: availability.userId,
          },
        });
      }

      // Si la réservation finit avant la fin de la disponibilité
      if (endTime < availability.endTime) {
        await prisma.availability.create({
          data: {
            startTime: endTime,
            endTime: availability.endTime,
            userId: availability.userId,
          },
        });
      }

      // Supprimer l'ancienne disponibilité
      await prisma.availability.delete({
        where: { id: availability.id },
      });

      // Rechercher ou créer un client basé sur l'email fourni
      let customer = await prisma.customer.findFirst({
        where: { email: customerInfo.email },
      });

      if (
        customer &&
        (customer.firstname !== customerInfo.firstname ||
          customer?.name !== customerInfo.name ||
          customer?.phone !== customerInfo.phone)
      ) {
        customer = await prisma.customer.update({
          where: { id: customer?.id },
          data: {
            name: customerInfo.name ?? "",
            firstname: customerInfo.firstname ?? "",
            phone: customerInfo.phone ?? "",
          },
        });
      }

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: customerInfo.name ?? "", // Assurez-vous que les champs nécessaires sont fournis
            email: customerInfo.email ?? "",
            phone: customerInfo.phone ?? "",
            address: {
              city: customerInfo.address?.city ?? "",
              state: customerInfo.address?.state ?? "",
              zip: customerInfo.address?.zip ?? "",
              country: customerInfo.address?.country ?? "",
              line1: customerInfo.address?.line1 ?? "",
              line2: customerInfo.address?.line2 || "", // `line2` peut être facultatif
            },
          },
        });
      }

      if (!customer) throw new Error("Customer not found or cannot be created");

      // Créer la nouvelle réservation
      return await prisma.booking.create({
        data: {
          startTime,
          endTime,
          serviceId,
          userId,
          status: "PENDING",
          payedBy: customerInfo.email ?? "",
          amountPayed,
          form,
          customerId: customer.id,
        },
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create booking");
  }
}

export default actionCreateBooking;
