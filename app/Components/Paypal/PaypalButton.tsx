"use client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import {
  paypalCustomIdType,
  paypalDescriptionItemType,
} from "@/src/types/paypal";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Booking } from "@prisma/client";
import useFormStore from "../SelectService/useFormStore";
import useUsersStore from "@/app/admin/Components/Users/useUsersStore";
import useBookingsStore from "@/app/admin/Components/Bookings/useBookingsStore";

export default function PayPalButton({
  deposit,
  prixFixDeposit,
  setPaymentValided,
}: {
  deposit: boolean;
  prixFixDeposit: { stripePriceId: string; price: number };
  setPaymentValided: (value: boolean) => void;
}) {
  const { serviceSelected } = useServiceStore();
  const { optionSelected } = useServiceStore();
  const { bookingSelected } = useBookingsStore();
  const { formData } = useFormStore();
  const { userSelectedFront } = useUsersStore();

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    throw new Error("Paypal client ID missing");
  }

  if (!serviceSelected?.price) throw new Error("Prix du service non défini");

  const currency =
    process.env.NEXT_PUBLIC_NODE_ENV === "development" ? "USD" : "EUR";

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: currency,
        disableFunding: "credit,card", // Très très étrange mais trouvé par hasard, c'est le seul moyen de Disable credit and debit cards tout en gardant le button paypal jaune
      }}
    >
      {bookingSelected && (
        <PayPalButtons
          forceReRender={[
            bookingSelected?.id,
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

            if (!userSelectedFront) throw new Error("No employee Selected");
            if (!bookingSelected.serviceId)
              throw new Error("No booking Selected");

            return actions.order.create({
              intent: "CAPTURE", // Ajoutez cette ligne,
              purchase_units: [
                {
                  description: bookingSelected.serviceId,
                  custom_id: JSON.stringify({
                    userId: bookingSelected.userId,
                    formData,
                    employeeId: userSelectedFront.id,
                    employeeName: String(userSelectedFront?.name),
                  } satisfies paypalCustomIdType),
                  amount: {
                    value: String(totalPrice / 100), // Montant du paiement
                    currency_code: currency,
                    breakdown: {
                      item_total: {
                        // Total des articles, doit correspondre à la somme des prix des articles * quantité
                        currency_code: currency,
                        value: String(totalPrice / 100),
                      },
                    },
                  },
                  items: [
                    {
                      name: serviceSelected.id,
                      description: JSON.stringify({
                        startTime: bookingSelected.startTime,
                        endTime: bookingSelected.endTime,
                      } satisfies paypalDescriptionItemType),
                      unit_amount: {
                        currency_code: currency,
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
                            description: String(bookingSelected.startTime),
                            unit_amount: {
                              currency_code: currency,
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
            return actions.order?.capture().then(() => setPaymentValided(true));
          }}
        />
      )}
    </PayPalScriptProvider>
  );
}
