import { Elements } from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Booking } from "@prisma/client";

const EmbeddedCheckoutComp = ({
  stripePromise,
  clientSecret,
  setPaymentValided,
  name,
  firstName,
  email,
  phone,
  bookingSelected,
  employeeId,
}: {
  stripePromise: Promise<Stripe | null>;
  clientSecret: string | undefined;
  setPaymentValided: (value: boolean) => void;
  name: string;
  firstName: string;
  email: string;
  phone: string;
  bookingSelected: Booking;
  employeeId: string;
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
        firstName={firstName}
        bookingSelected={bookingSelected}
        employeeId={employeeId}
      />
    </Elements>
  );
};
export default EmbeddedCheckoutComp;
