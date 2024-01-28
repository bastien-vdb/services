import { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('pay1 pass');

  const rawBody = await getRawBody(req);
  console.log(rawBody)
    res.status(200).send("Webhook received");
}
