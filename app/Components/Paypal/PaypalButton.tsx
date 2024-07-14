"use client";
import useEmployeeStore from "@/app/admin/Components/Employee/useEmpoyeesStore";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import {
  paypalCustomIdType,
  paypalDescriptionItemType,
} from "@/src/types/paypal";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Booking } from "@prisma/client";
import useFormStore from "../SelectService/useFormStore";

export default function PayPalButton({
  bookingSelectedPaypal,
  deposit,
  prixFixDeposit,
  setPaymentValided,
}: {
  bookingSelectedPaypal: Booking;
  deposit: boolean;
  prixFixDeposit: { stripePriceId: string; price: number };
  setPaymentValided: (value: boolean) => void;
}) {
  const { serviceSelected } = useServiceStore();
  const { optionSelected } = useServiceStore();
  const { formData } = useFormStore();
  const { employeeSelected } = useEmployeeStore();

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

          if (!employeeSelected) throw new Error("No employee Selected");

          return actions.order.create({
            intent: "CAPTURE", // Ajoutez cette ligne,
            purchase_units: [
              {
                description: bookingSelectedPaypal.serviceId,
                custom_id: JSON.stringify({
                  userId: bookingSelectedPaypal.userId,
                  formData,
                  employeeId: employeeSelected.id,
                  employeeName: employeeSelected?.name,
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
                      startTime: bookingSelectedPaypal.startTime,
                      endTime: bookingSelectedPaypal.endTime,
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
                          description: String(bookingSelectedPaypal.startTime),
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
    </PayPalScriptProvider>
  );
}
