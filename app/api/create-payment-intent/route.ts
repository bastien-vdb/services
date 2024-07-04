import useCheckStripe from "@/src/hooks/useCheckStripe";
import useServerData from "@/src/hooks/useServerData";
import { User } from "@prisma/client";
import { useStripe } from "@stripe/react-stripe-js";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

// This is your test secret API key.

const stripe = useCheckStripe();

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

export async function POST(req: Request, res: NextApiResponse) {
  const body: {
    stripePriceId: string;
    startTime: string;
    endTime: string;
    userId: string;
    serviceId: string;
    serviceName: string;
    addedOption:
      | {
          price: number;
          name: string;
        }
      | undefined;
    formData: any;
    amount: number;
    deposit: boolean;
    employeeId: string;
    employeeName: string;
  } = await req.json();

  const {
    stripePriceId,
    startTime,
    endTime,
    userId,
    serviceId,
    serviceName,
    employeeId,
    employeeName,
    addedOption,
    formData,
    amount,
    deposit,
  } = body;

  const user: User[] = await useServerData("user", { id: userId });
  const { stripeAccount } = user[0];

  if (!stripeAccount)
    throw new Error("Missing of the destination to receive the funds");

  let totalAmount = amount;

  if (addedOption && !deposit) totalAmount = totalAmount + addedOption.price;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount, //alculateOrderAmount(items),
    application_fee_amount: amount * 0.06,
    transfer_data: {
      destination: stripeAccount,
    },
    currency: "eur",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },

    metadata: {
      dates: JSON.stringify([startTime, endTime]), //Pour empêcher la conversion en date par Stripe
      serviceId,
      stripePriceId,
      userId,
      serviceName,
      employeeId,
      employeeName,
      addedOption: addedOption?.name || null,
      formData: JSON.stringify(formData),
    },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
