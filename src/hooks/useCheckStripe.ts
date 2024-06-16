import Stripe from "stripe";

const useCheckStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("stripe key missing");
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10",
  });
};

export default useCheckStripe;
