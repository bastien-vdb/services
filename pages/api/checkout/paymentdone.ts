import { NextApiRequest, NextApiResponse } from "next";
import useSetBookingUser from "@/app/admin/Components/Bookings/useSetBookingUser";
import type { Readable } from "node:stream";
import useSendEmail from "@/src/emails/useSendEmail";
import EmailRdvBooked from "@/src/emails/EmailBooked";
import useRenewIdemPotent from "@/pages/api/checkout/useRenewIdemPotent";
import useCheckStripe from "@/src/hooks/useCheckStripe";
import EmailNotBooked from "@/src/emails/EmailNotBooked";

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const stripe = useCheckStripe();

  const buf = await buffer(req);

  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error("Stripe webhook secret key is not defined");

  const signature = req.headers["stripe-signature"];

  if (signature === undefined) throw new Error("Stripe signature is not defined");

  const webhookEvent = stripe.webhooks.constructEvent(buf, signature, process.env.STRIPE_WEBHOOK_SECRET);

  try {
    switch (webhookEvent.type) {
      case "checkout.session.completed": {
        const session = webhookEvent.data.object.metadata as { bookingStartTime: string; serviceId: string; stripePriceId: string; bookingId: string; userId: string };
        const customerDetails = webhookEvent.data.object.customer_details;
        const { bookingStartTime, serviceId, stripePriceId, bookingId, userId } = session;

        console.log('bookingStartTime ==>', bookingStartTime);

        const hasBeenPassedToReserved = await useSetBookingUser({ bookingId, customerEmail: customerDetails?.email });
        if (hasBeenPassedToReserved && customerDetails?.email) {
          await useSendEmail({
            from: "QuickReserve <no-answer@quickreserve.app>",
            to: [String(customerDetails.email)],
            subject: `${customerDetails.name} Votre créneau a bien été réservé`,
            react: EmailRdvBooked({ customerName: customerDetails.name ?? "", bookingStartTime:bookingStartTime }),
          });
        }
        if (!hasBeenPassedToReserved && customerDetails?.email) {
          await useSendEmail({
            from: "QuickReserve <no-answer@quickreserve.app>",
            to: [String(customerDetails.email)],
            subject: `${customerDetails.name} Votre n'a pas pu être réservé`,
            react: EmailNotBooked({ magicLink: process.env.NEXTAUTH_URL }),
          });
        }
        break;
      }

      case "checkout.session.expired": {
        const session = webhookEvent.data.object.metadata as { bookingStartTime: string; serviceId: string; stripePriceId: string; bookingId: string; userId: string };
        const customerDetails = webhookEvent.data.object.customer_details;
        if(customerDetails) {  
        await useSendEmail({
            from: "QuickReserve <no-answer@quickreserve.app>",
            to: [String(customerDetails.email)],
            subject: `${customerDetails.name} Votre n'a pas pu être réservé`,
            react: EmailNotBooked({ magicLink: process.env.NEXTAUTH_URL }),
          });
        }
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = webhookEvent.data.object.metadata as { bookingStartTime: string; serviceId: string; stripePriceId: string; bookingId: string; userId: string };
        const customerDetails = webhookEvent.data.object.customer_details;
        if(customerDetails) {  
        await useSendEmail({
            from: "QuickReserve <no-answer@quickreserve.app>",
            to: [String(customerDetails.email)],
            subject: `${customerDetails.name} Votre n'a pas pu être réservé`,
            react: EmailNotBooked({ magicLink: process.env.NEXTAUTH_URL }),
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
