import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const EmbeddedCheckoutComp = ({
  stripePromise,
  clientSecret,
}: {
  stripePromise: Promise<Stripe | null>;
  clientSecret: string | null | undefined;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, [clientSecret]);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
export default EmbeddedCheckoutComp;
