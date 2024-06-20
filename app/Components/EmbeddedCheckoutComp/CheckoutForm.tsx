import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/src/components/ui/button";
import Email from "next-auth/providers/email";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { set } from "date-fns";
import ShimmerButton from "@/src/components/syntax-ui/ShimmerButton";
import TextRevealButton from "@/src/components/syntax-ui/TextRevealButton";
import { PaymentIntent } from "@stripe/stripe-js/types/api";
import ShoppingCart from "@/src/components/cart/ShoppingCart";

export default function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState<string | undefined | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent>();

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        return;
      }
      setPaymentIntent(paymentIntent);

      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, clientSecret]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name && !email) return setMessage("Veuillez remplir tous les champs");

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    // if (!name && !email) return setMessage("Veuillez remplir tous les champs");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name,
            email,
            phone,
          },
        },
        // Make sure to change this to your payment completion page
        return_url: `${process.env.NEXT_PUBLIC_HOST}/checkout/success`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form className="flex flex-col" id="payment-form" onSubmit={handleSubmit}>
      {/* <ShoppingCart
        items={[
          { name: paymentIntent?.description, price: paymentIntent?.amount },
        ]}
      /> */}
      <PaymentElement
        options={{
          fields: { billingDetails: { email: "auto", phone: "auto" } },
        }}
        id="payment-element"
      />

      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2.5 Label">
        <Input
          className="text-[1.1rem]"
          onChange={(e) => setName(e.target.value)}
          type="name"
          id="name"
          placeholder="Nom*"
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2.5">
        <Input
          className="text-[1.1rem]"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email"
          placeholder="Email*"
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5 my-2.5">
        <Input
          className="text-[1.1rem]"
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          id="tel"
          placeholder="(+33)"
        />
      </div>

      {/* Show any error or success messages */}
      <span className="m-auto my-2">
        {message && <div id="payment-message">{message}</div>}
      </span>
      <Button
        className="animate-buttonheartbeat rounded-md bg-rose-500 px-4 py-1 text-sm font-semibold text-white"
        disabled={isLoading || !stripe || !elements}
        id="submit"
        onClick={() => setIsLoading(false)}
      >
        <span id="button-text">
          {isLoading || !paymentIntent?.amount ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            `À payer: ${paymentIntent.amount / 100} €`
          )}
        </span>
      </Button>
    </form>
  );
}
