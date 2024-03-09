'use server'
import Stripe from "stripe";
import actionNewStripeAccount from "./actionNewStripeAccount";

const useSubscribe = async ({ userId, stripeAccount }: { userId: string; stripeAccount?: string }) => {
    console.log('front ou back ?')
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe secret key is not defined");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

  //Stripe.Response<Stripe.AccountLink> | undefined;

  try {
    if (!stripeAccount) {
      const newStripeAccountId = await actionNewStripeAccount({ userId });
      const link = await stripe.accountLinks.create({
        account: newStripeAccountId,
        refresh_url: `${process.env.NEXT_PUBLIC_HOST}/`,
        return_url: `${process.env.NEXT_PUBLIC_HOST}/`,
        type: "account_onboarding",
      });
      return link.url;
    } else {
      const link = await stripe.accountLinks.create({
        account: stripeAccount,
        refresh_url: `${process.env.NEXT_PUBLIC_HOST}/`,
        return_url: `${process.env.NEXT_PUBLIC_HOST}/`,
        type: "account_onboarding",
      });
      return link.url;
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
export default useSubscribe;
