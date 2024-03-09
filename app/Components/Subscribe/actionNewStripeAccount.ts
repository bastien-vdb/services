"use server";
import Stripe from "stripe";

const actionNewStripeAccount = async ({ userId }: { userId: string }) => {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("stripe key missing");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

  const newStripeAccount = await stripe.accounts.create({ type: "express" });
  await prisma?.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeAccount: newStripeAccount.id,
    },
  });
  return newStripeAccount.id;
};

export default actionNewStripeAccount;
