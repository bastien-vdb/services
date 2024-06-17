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

export default function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState<string | undefined | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = useState("");

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
  }, [stripe]);

  console.log("elements", elements);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            email,
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
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          fields: { billingDetails: { email: "auto", phone: "auto" } },
        }}
        id="payment-element"
      />
      {/* <AddressElement
        options={{
          mode: "billing",
          fields: {
            phone: "always",
          },
          validation: {
            phone: {
              required: "always",
            },
          },
        }}
      /> */}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email"
          placeholder="Email"
        />
      </div>
      <Button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            "Payer maintenant"
          )}
        </span>
      </Button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
