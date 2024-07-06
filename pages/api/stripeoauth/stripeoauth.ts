import useCheckStripe from "@/src/hooks/useCheckStripe";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/db/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { code, state } = req.query as { code: string; state: string }; // Utilisation de req.query pour GET

    if (!code || !state) {
      return res
        .status(400)
        .json({ error: "Code and state parameters are required" });
    }

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
      console.error("Stripe OAuth error:", err); // Log l'erreur complète pour plus de détails
      if (err.raw) {
        console.error("Stripe Error Details:", {
          statusCode: err.raw.statusCode,
          requestId: err.raw.requestId,
          message: err.raw.message,
        });
      }
      res.status(500).json({ error: "Failed to connect Stripe account" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
