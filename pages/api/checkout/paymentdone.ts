import { NextApiRequest, NextApiResponse } from "next";
import type { Readable } from "node:stream";
import useSendEmail from "@/src/emails/useSendEmail";
import EmailRdvBooked from "@/src/emails/EmailBooked";
import useCheckStripe from "@/src/hooks/useCheckStripe";
import EmailNotBooked from "@/src/emails/EmailNotBooked";
import actionCreateBooking from "@/app/admin/Components/Bookings/action-createBooking";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks: any = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stripe = useCheckStripe();

  const buf = await buffer(req);

  if (!process.env.STRIPE_WEBHOOK_SECRET)
    throw new Error("Stripe webhook secret key is not defined");

  const signature = req.headers["stripe-signature"];

  if (signature === undefined)
    throw new Error("Stripe signature is not defined");

  const webhookEvent = stripe.webhooks.constructEvent(
    buf,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  try {
    switch (webhookEvent.type) {
      case "checkout.session.completed": {
        const session = webhookEvent.data.object.metadata as {
          startTime: string;
          endTime: string;
          serviceId: string;
          stripePriceId: string;
          bookingId: string;
          userId: string;
        };
        const customerDetails = webhookEvent.data.object.customer_details;
        const { startTime, endTime, serviceId, userId } = session;

        const bookingCreated = await actionCreateBooking({
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          serviceId,
          userId,
          amountPayed: webhookEvent.data.object.amount_total,
          customerInfo: {
            name: customerDetails?.name ? customerDetails.name : "NC",
            email: customerDetails?.email ? customerDetails.email : "NC",
            phone: customerDetails?.phone ? customerDetails.phone : "NC",
            address: {
              city: customerDetails?.address?.city
                ? customerDetails.address.city
                : "NC",
              country: customerDetails?.address?.country
                ? customerDetails.address.country
                : "NC",
              state: customerDetails?.address?.state
                ? customerDetails.address.state
                : "NC",
              zip: customerDetails?.address?.postal_code
                ? customerDetails.address.postal_code
                : "NC",
              line1: customerDetails?.address?.line1
                ? customerDetails.address.line1
                : "NC",
              line2: customerDetails?.address?.line2
                ? customerDetails.address.line2
                : "NC",
            },
          },
        });

        const serviceName = await prisma?.service.findFirst({
          where: { id: serviceId },
          select: { name: true },
        });

        console.log("serviceName", serviceName);

        if (bookingCreated && customerDetails?.email && serviceName) {
          await useSendEmail({
            from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
            to: [customerDetails.email],
            subject: `Rendez-vous ${serviceName} en attente.`,
            react: EmailRdvBooked({
              customerName: customerDetails.name ?? "",
              bookingStartTime: startTime,
              serviceName: serviceName?.name ?? "",
              employeeName: "Natacha S",
              businessPhysicalAddress: "36 chemin des huats, 93000 Bobigny",
            }),
          });
        }
        if (!bookingCreated && customerDetails?.email) {
          await useSendEmail({
            from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
            to: [String(customerDetails.email)],
            subject: `${customerDetails.name} Votre n'a pas pu être réservé`,
            react: EmailNotBooked({
              customerName: customerDetails.name ?? "",
              bookingStartTime: session.startTime,
            }),
          });
        }
        break;
      }

      case "checkout.session.expired": {
        const session = webhookEvent.data.object.metadata as {
          bookingStartTime: string;
          serviceId: string;
          stripePriceId: string;
          bookingId: string;
          userId: string;
        };
        const customerDetails = webhookEvent.data.object.customer_details;

        if (customerDetails) {
          await useSendEmail({
            from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
            to: [String(customerDetails.email)],
            subject: `${customerDetails.name} Votre n'a pas pu être réservé`,
            react: EmailNotBooked({
              customerName: customerDetails.name ?? "",
              bookingStartTime: session.bookingStartTime,
            }),
          });
        }
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = webhookEvent.data.object.metadata as {
          bookingStartTime: string;
          serviceId: string;
          stripePriceId: string;
          bookingId: string;
          userId: string;
        };
        const customerDetails = webhookEvent.data.object.customer_details;
        if (customerDetails) {
          await useSendEmail({
            from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
            to: [String(customerDetails.email)],
            subject: `${customerDetails.name} Votre n'a pas pu être réservé`,
            react: EmailNotBooked({
              customerName: customerDetails.name ?? "",
              bookingStartTime: session.bookingStartTime,
            }),
          });
        }
        break;
      }
      default:
    }
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(400).send("Webhook error");
  }
}
