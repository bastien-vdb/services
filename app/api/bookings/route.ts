import { NextResponse } from "next/server";
import { prisma } from "@/src/db/prisma";
import moment from "moment";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const dateParam = params.get("date");

  if (!dateParam) {
    console.log("no date");
    try {
      const result = await prisma["booking"].findMany();
      return NextResponse.json(result);
    } catch (error) {
      console.log(error);
      throw new Error("Data cannot be reach from the db");
    }
  }

  try {
    const date = moment(dateParam);
    const startOfDay = date.clone().startOf("day").toDate();
    const endOfDay = date.clone().endOf("day").toDate();

    console.log("startOfDay", startOfDay);
    console.log("endOfDay", endOfDay);

    const result = await prisma["booking"].findMany({
      where: {
        startTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
        isAvailable: true,
      },
    });

    console.log("result !!!333", result);
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    throw new Error("Data cannot be reach from the db");
  }
}
