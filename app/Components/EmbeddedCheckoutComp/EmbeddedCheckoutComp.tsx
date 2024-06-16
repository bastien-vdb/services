import {
  Elements,
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
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
    appearance,
  };
  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>

    // <div id="checkout">
    //   <Elements options={options} stripe={stripePromise}>
    //     <CheckoutForm clientSecret={clientSecret} />
    //   </Elements>
    // </div>
  );
};
export default EmbeddedCheckoutComp;
