import { NextApiResponse } from "next";

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
  } = await req.json();

  const {
    stripePriceId,
    startTime,
    endTime,
    userId,
    serviceId,
    serviceName,
    addedOption,
    formData,
  } = body;

  console.log("baaaaakcEND");

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 20000, //alculateOrderAmount(items),
    currency: "eur",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  console.log("paymentIntent", paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}
