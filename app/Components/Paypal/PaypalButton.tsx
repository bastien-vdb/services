"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

export default function PayPalButton() {
  const router = useRouter();

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    throw new Error("Paypal client ID missing");
  }
  return (
    <PayPalScriptProvider
      options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
    >
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE", // Ajoutez cette ligne,
            purchase_units: [
              {
                amount: {
                  value: "1.99", // Montant du paiement
                  currency_code: "USD",
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          if (!actions.order) throw new Error("Paiement échoué");
          return actions.order?.capture().then((details) => {
            router.push(`${process.env.NEXT_PUBLIC_HOST}/checkout/success`);
          });
        }}
      />
    </PayPalScriptProvider>
  );
}
