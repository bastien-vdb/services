"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import EmailTemplate from './EmailTemplate';
import { Resend } from "resend";

const useSendEmail = async () => {
  const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["bastien.deboisrolin@gmail.com"],
      subject: "Hello world",
      react: EmailTemplate({ firstName: "Johny deps" }),
    } as any) as any;
    if (error) return error;
    return data;
};

export default useSendEmail;
