import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import moment from "moment";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const dateParam = params.get("date");
  const availableParam = params.get("available");
  const userId = params.get("userId");

  const session = await getServerSession(authOptions);

  if (!userId && !session) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (dateParam === "undefined" || dateParam === null) {
    try {
      const available = availableParam === "true" ? true : false;

      const result = await prisma.booking.findMany({
        where: {
          isAvailable: available,
          userId: userId ? userId : session?.user.id,
        },
      });
      return NextResponse.json(result);
    } catch (error) {
      throw new Error("Data cannot be reach from the db");
    }
  }

  try {
    const date = moment(dateParam);
    const startOfDay = date.clone().startOf("day").toDate();
    const endOfDay = date.clone().endOf("day").toDate();

    const result = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
        isAvailable: true,
        userId: userId ? userId : session?.user.id,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    throw new Error("Data cannot be reach from the db");
  }
}
