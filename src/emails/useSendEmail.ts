"use server";
import { Resend } from "resend";
import { ReactNode } from "react";

const resendApiKey = process.env.RESEND_API_KEY;

type useSendEmailType = {
  from: string;
  to: string[];
  subject: string;
  react: ReactNode;
};

const useSendEmail = async ({ from, to, subject, react }: useSendEmailType) => {
  if (!resendApiKey) throw new Error("No valid resend API key filled");
  const resend = new Resend(resendApiKey);

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    react,
  } as any);
  if (error) return error;
  console.error(error);
  return data;
};

export default useSendEmail;
