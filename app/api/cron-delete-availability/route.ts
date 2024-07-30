import { prisma } from "@/src/db/prisma";
import { NextApiResponse } from "next";

export async function DELETE(req: Request, res: NextApiResponse) {
  try {
    const { count } = await prisma.availability.deleteMany({
      where: {
        endTime: {
          lte: new Date(),
        },
      },
    });

    return res.status(200).json({
      message: "Old availabilities deleted successfully",
      count,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to delete old availabilities" });
  }
}
