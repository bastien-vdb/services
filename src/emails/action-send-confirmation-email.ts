"use server";
import { Resend } from "resend";
import EmailConfirmed from "./EmailConfirmed";
import EmailConfirmedCollaborator from "./EmailConfirmedCollaborator";

const resendApiKey = process.env.RESEND_API_KEY;

type actionSendConfirmationEmail = {
  from: string;
  to: string[];
  subject: string;
  customerName: string;
  bookingStartTime: string;
  forCollaborator?: boolean;
};

const actionSendConfirmationEmail = async ({
  from,
  to,
  subject,
  customerName,
  bookingStartTime,
  forCollaborator = false,
}: actionSendConfirmationEmail) => {
  if (!resendApiKey) throw new Error("No valid resend API key filled");
  const resend = new Resend(resendApiKey);

  return await resend.emails.send({
    from,
    to,
    subject,
    react: !forCollaborator
      ? EmailConfirmed({
          customerName,
          bookingStartTime,
        })
      : EmailConfirmedCollaborator({
          customerName,
          bookingStartTime,
        }),
  });
};

export default actionSendConfirmationEmail;
