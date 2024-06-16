import { NextApiRequest, NextApiResponse } from "next";
import type { Readable } from "node:stream";
import useSendEmail from "@/src/emails/useSendEmail";
import EmailRdvBooked from "@/src/emails/EmailBooked";
import useCheckStripe from "@/src/hooks/useCheckStripe";
import EmailNotBooked from "@/src/emails/EmailNotBooked";
import actionCreateBooking from "@/app/admin/Components/Bookings/action-createBooking";
import moment from "moment-timezone";

export const config = {
  api: {
    bodyParser: false,
  },
};

type metadataType = {
  startTime: string;
  endTime: string;
  serviceId: string;
  stripePriceId: string;
  bookingId: string;
  userId: string;
  serviceName: string;
  addedOption: string;
  formData: string;
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
    // switch (webhookEvent.type) {
    //   case "payment_intent.succeeded": {
    //     const session = webhookEvent.data.object.metadata as metadataType;
    //     const customerDetails = webhookEvent.data.object.customer_details;
    //     const {
    //       startTime,
    //       endTime,
    //       serviceId,
    //       userId,
    //       serviceName,
    //       addedOption,
    //       formData,
    //     } = session;

    //     const startDateTmz = moment
    //       .utc(startTime)
    //       .tz("Europe/Paris")
    //       .format("YYYY-MM-DD HH:mm:ss");

    //     const bookingCreated = await actionCreateBooking({
    //       startTime: new Date(startTime),
    //       endTime: new Date(endTime),
    //       serviceId,
    //       userId,
    //       amountPayed: webhookEvent.data.object.amount_total,
    //       form: formData,
    //       customerInfo: {
    //         name: customerDetails?.name ? customerDetails.name : "NC",
    //         email: customerDetails?.email ? customerDetails.email : "NC",
    //         phone: customerDetails?.phone ? customerDetails.phone : "NC",
    //         address: {
    //           city: customerDetails?.address?.city
    //             ? customerDetails.address.city
    //             : "NC",
    //           country: customerDetails?.address?.country
    //             ? customerDetails.address.country
    //             : "NC",
    //           state: customerDetails?.address?.state
    //             ? customerDetails.address.state
    //             : "NC",
    //           zip: customerDetails?.address?.postal_code
    //             ? customerDetails.address.postal_code
    //             : "NC",
    //           line1: customerDetails?.address?.line1
    //             ? customerDetails.address.line1
    //             : "NC",
    //           line2: customerDetails?.address?.line2
    //             ? customerDetails.address.line2
    //             : "NC",
    //         },
    //       },
    //     });

    //     if (bookingCreated && customerDetails?.email) {
    //       await useSendEmail({
    //         from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
    //         to: [customerDetails.email],
    //         subject: `Rendez-vous ${serviceName} en attente.`,
    //         react: EmailRdvBooked({
    //           customerName: customerDetails.name ?? "",
    //           bookingStartTime: startDateTmz,
    //           serviceName,
    //           employeeName: "Natacha S",
    //           businessPhysicalAddress: "36 chemin des huats, 93000 Bobigny",
    //         }),
    //       });
    //     }
    //     if (!bookingCreated && customerDetails?.email) {
    //       await useSendEmail({
    //         from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
    //         to: [String(customerDetails.email)],
    //         subject: `${customerDetails.name} Votre n'a pas pu être réservé`,
    //         react: EmailNotBooked({
    //           customerName: customerDetails.name ?? "",
    //           bookingStartTime: startDateTmz,
    //         }),
    //       });
    //     }
    //     break;
    //   }

    //   case "checkout.session.expired": {
    //     const session = webhookEvent.data.object.metadata as metadataType;
    //     const customerDetails = webhookEvent.data.object.customer_details;
    //     const { startTime } = session;

    //     const startDateTmz = moment
    //       .utc(startTime)
    //       .tz("Europe/Paris")
    //       .format("YYYY-MM-DD HH:mm:ss");

    //     if (customerDetails) {
    //       await useSendEmail({
    //         from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
    //         to: [String(customerDetails.email)],
    //         subject: `${customerDetails.name} Votre n'a pas pu être réservé`,
    //         react: EmailNotBooked({
    //           customerName: customerDetails.name ?? "",
    //           bookingStartTime: startDateTmz,
    //         }),
    //       });
    //     }
    //     break;
    //   }

    //   case "checkout.session.async_payment_failed": {
    //     const session = webhookEvent.data.object.metadata as metadataType;
    //     const customerDetails = webhookEvent.data.object.customer_details;
    //     const { startTime } = session;

    //     const startDateTmz = moment
    //       .utc(startTime)
    //       .tz("Europe/Paris")
    //       .format("YYYY-MM-DD HH:mm:ss");

    //     if (customerDetails) {
    //       await useSendEmail({
    //         from: "Finest lash - Quickreserve.app <no-answer@quickreserve.app>",
    //         to: [String(customerDetails.email)],
    //         subject: `${customerDetails.name} Votre n'a pas pu être réservé`,
    //         react: EmailNotBooked({
    //           customerName: customerDetails.name ?? "",
    //           bookingStartTime: startDateTmz,
    //         }),
    //       });
    //     }
    //     break;
    //   }
    // default:
    // }

    switch (webhookEvent.type) {
      case "payment_intent.succeeded":
        const paymentIntent = webhookEvent.data.object;
        const charge = paymentIntent.invoice; // Get the first charge
        console.log(`invoice --> ${charge}!`);

        const receiptemail = paymentIntent.receipt_email; // Get the first charge
        console.log(`receiptemail --> ${receiptemail}!`);
        // Then define and call a function to handle the event payment_intent.succeeded
        // e.g., update the order in your database
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${webhookEvent.type}`);
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(400).send("Webhook error");
  }
}
