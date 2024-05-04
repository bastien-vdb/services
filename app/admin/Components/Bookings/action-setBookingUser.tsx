"use server";
import { prisma } from "@/src/db/prisma";

async function actionSetBookingUser({
  bookingId,
  customerEmail,
  serviceId,
}: {
  bookingId: string;
  customerEmail?: string | null;
  serviceId?: string;
}) {
  try {
    const bookinFound = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (bookinFound?.status === "CONFIRMED")
      throw new Error("Réservation déjà payée");

    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CONFIRMED",
        serviceId: serviceId,
        ...(customerEmail && { payedBy: String(customerEmail) }),
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default actionSetBookingUser;
