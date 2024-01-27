import next, { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
import getRawBody from "raw-body";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request, res: NextResponse) {
    console.log('la route temu fonctionne et est accessible');
    return new NextResponse("la route temu fonctionne");
}
