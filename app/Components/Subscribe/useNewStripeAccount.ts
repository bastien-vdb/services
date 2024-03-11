"use server";
import useCheckStripe from "@/src/hooks/useCheckStripe";

const useNewStripeAccount = async ({ userId }: { userId: string }) => {
  const stripe = useCheckStripe();

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

export default useNewStripeAccount;
