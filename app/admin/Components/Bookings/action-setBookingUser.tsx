"use server";
import { prisma } from "@/src/db/prisma";
import { BookingStatus } from "@prisma/client";

async function actionSetBookingUser({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatus;
}) {
  try {
    const bookinFound = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (bookinFound?.status === status)
      throw new Error(`La réservation est déjà ${status}`);

    return await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: status,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de mettre à jour la réservation");
  }
}

export default actionSetBookingUser;
