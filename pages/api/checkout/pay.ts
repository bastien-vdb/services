import { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('pay2 pass');

    try {
      if (req.method !== 'POST') {
          throw new Error('Method not allowed !!');
      }

      // const rawBody = await getRawBody(req);
      const rawBody = await req.body;

      console.log(rawBody);
      res.status(200).send("Webhook received");
  } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send("Internal Server Error");
  }
  res.status(200).send("Webhook received");
}
