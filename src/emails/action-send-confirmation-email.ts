"use server";
import { Resend } from "resend";
import EmailRdvBooked from "./EmailBooked";

const resendApiKey = process.env.RESEND_API_KEY;

type actionSendConfirmationEmail = {
  from: string;
  to: string[];
  subject: string;
  customerName: string;
  bookingStartTime: string;
};

const actionSendConfirmationEmail = async ({
  from,
  to,
  subject,
  customerName,
  bookingStartTime,
}: actionSendConfirmationEmail) => {
  if (!resendApiKey) throw new Error("No valid resend API key filled");
  const resend = new Resend(resendApiKey);

  return await resend.emails.send({
    from,
    to,
    subject,
    react: EmailRdvBooked({
      customerName,
      bookingStartTime,
    }),
  });
};

export default actionSendConfirmationEmail;
