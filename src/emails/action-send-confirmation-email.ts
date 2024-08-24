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
  customerFirstname: string;
  bookingStartTime: string;
  forCollaborator?: boolean;
  businessPhysicalAddress: string;
  phone: string;
};

const actionSendConfirmationEmail = async ({
  from,
  to,
  subject,
  customerName,
  customerFirstname,
  bookingStartTime,
  forCollaborator = false,
  businessPhysicalAddress,
  phone,
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
          customerFirstname,
          bookingStartTime,
          businessPhysicalAddress,
          phone,
        })
      : EmailConfirmedCollaborator({
          customerName,
          customerFirstname,
          bookingStartTime,
          businessPhysicalAddress,
          phone,
        }),
  });
};

export default actionSendConfirmationEmail;
