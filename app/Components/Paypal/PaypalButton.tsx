"use client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Booking } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function PayPalButton({
  bookingSelectedPaypal,
  deposit,
  prixFixDeposit,
}: {
  bookingSelectedPaypal: Booking;
  deposit: boolean;
  prixFixDeposit: { stripePriceId: string; price: number };
}) {
  const router = useRouter();
  const { serviceSelected } = useServiceStore();
  const { optionSelected } = useServiceStore();

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    throw new Error("Paypal client ID missing");
  }

  if (!serviceSelected?.price) throw new Error("Prix du service non défini");

  console.log("NEXT_PUBLIC_NODE_ENV", process.env.NEXT_PUBLIC_NODE_ENV);

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        disableFuiding: "", // Très très étrange mais trouvé par hasard,
        //c'est le seul moyen de Disable credit
        //and debit cards tout en gardant le button paypal jaune
      }}
    >
      <PayPalButtons
        forceReRender={[
          bookingSelectedPaypal.id,
          deposit,
          serviceSelected,
          optionSelected,
        ]}
        style={{
          layout: "horizontal",
          tagline: false,
          shape: "rect",
          color: "white",
        }} // il faut aussi ce bout de code css pour voir le bouton ... très étrange mais fonctionnel
        createOrder={(data, actions) => {
          const totalPrice = deposit
            ? prixFixDeposit.price
            : serviceSelected.price +
              (optionSelected?.price ? optionSelected.price : 0);

          return actions.order.create({
            intent: "CAPTURE", // Ajoutez cette ligne,
            purchase_units: [
              {
                custom_id: bookingSelectedPaypal.id,
                amount: {
                  value: String(totalPrice / 100), // Montant du paiement
                  currency_code:
                    process.env.NEXT_PUBLIC_NODE_ENV === "development"
                      ? "USD"
                      : "EUR",
                  breakdown: {
                    item_total: {
                      // Total des articles, doit correspondre à la somme des prix des articles * quantité
                      currency_code:
                        process.env.NEXT_PUBLIC_NODE_ENV === "development"
                          ? "USD"
                          : "EUR",
                      value: String(totalPrice / 100),
                    },
                  },
                },
                items: [
                  {
                    name: serviceSelected.name,
                    description: String(bookingSelectedPaypal.startTime),
                    unit_amount: {
                      currency_code:
                        process.env.NEXT_PUBLIC_NODE_ENV === "development"
                          ? "USD"
                          : "EUR",
                      value: String(
                        deposit
                          ? prixFixDeposit.price / 100
                          : serviceSelected.price / 100
                      ),
                    },
                    quantity: "1",
                  },
                  ...(optionSelected && !deposit
                    ? [
                        {
                          name: optionSelected.name,
                          description: String(bookingSelectedPaypal.startTime),
                          unit_amount: {
                            currency_code:
                              process.env.NEXT_PUBLIC_NODE_ENV === "development"
                                ? "USD"
                                : "EUR",
                            value: String(optionSelected.price / 100),
                          },
                          quantity: "1",
                        },
                      ]
                    : []),
                ],
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
