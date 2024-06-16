import { Elements } from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const EmbeddedCheckoutComp = ({
  stripePromise,
  clientSecret,
}: {
  stripePromise: Promise<Stripe | null>;
  clientSecret: string | undefined;
}) => {
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
  };
  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
};
export default EmbeddedCheckoutComp;
