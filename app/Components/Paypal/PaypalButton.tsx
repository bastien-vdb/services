"use client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Booking } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function PayPalButton({
  bookingSelectedPaypal,
}: {
  bookingSelectedPaypal: Booking;
}) {
  const router = useRouter();
  const { serviceSelected } = useServiceStore();

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    throw new Error("Paypal client ID missing");
  }

  if (!serviceSelected?.price) throw new Error("Prix du service non défini");

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
        style={{
          layout: "horizontal",
          tagline: false,
          shape: "rect",
          color: "white",
        }} // il faut aussi ce bout de code css pour voir le bouton ... très étrange mais fonctionnel
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE", // Ajoutez cette ligne,
            purchase_units: [
              {
                custom_id: bookingSelectedPaypal.id,
                amount: {
                  value: String(serviceSelected.price / 100), // Montant du paiement
                  currency_code: "EUR",
                  breakdown: {
                    item_total: {
                      // Total des articles, doit correspondre à la somme des prix des articles * quantité
                      currency_code: "EUR",
                      value: String(serviceSelected.price / 100),
                    },
                  },
                },
                items: [
                  {
                    name: serviceSelected.name,
                    description: String(bookingSelectedPaypal.startTime),
                    unit_amount: {
                      currency_code: "USD",
                      value: String(serviceSelected.price / 100),
                    },
                    quantity: "1",
                  },
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
