import { Elements } from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const EmbeddedCheckoutComp = ({
  stripePromise,
  clientSecret,
  setPaypmentValided,
}: {
  stripePromise: Promise<Stripe | null>;
  clientSecret: string | undefined;
  setPaypmentValided: (value: boolean) => void;
}) => {
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
  };
  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm
        clientSecret={clientSecret}
        setPaypmentValided={setPaypmentValided}
      />
    </Elements>
  );
};
export default EmbeddedCheckoutComp;
