import Stripe from "stripe";

const useCheckStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("stripe key missing");
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
};

export default useCheckStripe;
