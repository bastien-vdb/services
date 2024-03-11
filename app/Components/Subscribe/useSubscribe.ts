"use server";
import Stripe from "stripe";
import useNewStripeAccount from "./useNewStripeAccount";
import useCheckStripe from "@/src/hooks/useCheckStripe";

const useSubscribe = async ({ userId, stripeAccount }: { userId: string; stripeAccount?: string }) => {
  const stripe = useCheckStripe();

  try {
    if (!stripeAccount) {
      const newStripeAccountId = await useNewStripeAccount({ userId });
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
