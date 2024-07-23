import { prisma } from "@/src/db/prisma";
import Steps from "@/app/Components/Steps";
import { Booking, Service } from "@prisma/client";

async function Business({ params }: { params: { userId: string } }) {
  const { userId } = params;

  let services: Service[] = [];
  let bookings: Booking[] = [];

  try {
    const res = await prisma.service.findMany({
      where: {
        createdById: userId,
      },
    });
    services.push(...res);
  } catch (error) {
    throw new Error("Data cannot be reach from the db");
  }

  try {
    const res = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
    });
    bookings.push(...res);
  } catch (error) {
    throw new Error("Data cannot be reach from the db");
  }

  return <Steps userId={userId} />;
}

export default Business;
