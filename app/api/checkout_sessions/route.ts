import useCheckStripe from "@/src/hooks/useCheckStripe";
import useServerData from "@/src/hooks/useServerData";
import { User } from "@prisma/client";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

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

  const user: User[] = await useServerData("user", { id: userId });
  const { stripeAccount } = user[0];

  if (!stripeAccount)
    throw new Error("Missing of the destination to receive the funds");

  const stripe = useCheckStripe();

  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: {
        startTime,
        endTime,
        serviceId,
        stripePriceId,
        userId,
        serviceName,
        addedOption: addedOption?.name || null,
        formData: JSON.stringify(formData),
      },
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of
          // the product you want to sell
          price: stripePriceId,
          quantity: 1,
        },
        ...(addedOption
          ? [
              {
                // Add an option for 20 euros
                price_data: {
                  currency: "eur",
                  product_data: {
                    name: addedOption.name,
                  },
                  unit_amount: addedOption.price,
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      payment_intent_data: {
        application_fee_amount: 250,
        transfer_data: {
          destination: stripeAccount,
        },
      },
      mode: "payment",
      return_url: `${process.env.NEXT_PUBLIC_HOST}/checkout/success`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    if (err.type === "StripeIdempotencyError") {
      console.log("Réservation en cours sur ce créneau, merci de changer");
      return new Response(
        "Réservation en cours sur ce créneau, merci de changer",
        {
          status: err.statusCode, // Ou tout autre statut HTTP approprié
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    return new Response(
      "Erreur lors de la création de la session de paiement",
      {
        status: 500, // Ou tout autre statut HTTP approprié
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  // break;
  //   case "GET":
  //     try {
  //       const session =
  //         await stripe.checkout.sessions.retrieve(req.query.session_id);

  //       res.send({
  //         status: session.status,
  //         customer_email: session.customer_details.email
  //       });
  //     } catch (err) {
  //       res.status(err.statusCode || 500).json(err.message);
  //     }
  //     break;
  //   default:
  //     res.setHeader('Allow', req.method);
  //     res.status(405).end('Method Not Allowed');
  // }
}
