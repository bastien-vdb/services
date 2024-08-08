import { Elements } from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const EmbeddedCheckoutComp = ({
  stripePromise,
  clientSecret,
  setPaymentValided,
  name,
  email,
  phone,
}: {
  stripePromise: Promise<Stripe | null>;
  clientSecret: string | undefined;
  setPaymentValided: (value: boolean) => void;
  name: string;
  email: string;
  phone: string;
}) => {
  const options = {
    clientSecret,
  };
  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm
        clientSecret={clientSecret}
        setPaymentValided={setPaymentValided}
        name={name}
        email={email}
        phone={phone}
      />
    </Elements>
  );
};
export default EmbeddedCheckoutComp;
