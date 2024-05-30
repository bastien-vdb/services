import useCheckStripe from "@/src/hooks/useCheckStripe";
import { useStripe } from "@stripe/react-stripe-js";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/db/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { code, state } = req.body;

    const stripe = useCheckStripe();

    try {
      const response = await stripe.oauth.token({
        grant_type: "authorization_code",
        code,
      });

      const connected_account_id = response.stripe_user_id;

      await prisma.user.update({
        where: { id: state },
        data: { stripeAccount: connected_account_id },
      });

      res.status(200).json({ connected_account_id });
    } catch (err) {
      console.error("Stripe OAuth error:", err);
      res.status(500).json({ error: "Failed to connect Stripe account" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
