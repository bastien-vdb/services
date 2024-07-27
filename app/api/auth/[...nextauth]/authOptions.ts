import { prisma } from "@/src/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { SendVerificationRequestParams } from "next-auth/providers";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { Resend } from "resend";

// resend.ts
export const sendVerificationRequest = async (
  params: SendVerificationRequestParams
) => {
  let {
    identifier: email,
    url,
    provider: { from },
  } = params;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: from,
      to: email,
      subject: "Login Link to your Account",
      html:
        '<p>Click the magic link below to sign in to your account:</p>\
             <p><a href="' +
        url +
        '"><b>Sign in</b></a></p>',
    });
  } catch (error) {
    console.error({ error });
  }
};

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    EmailProvider({
      from: "noreply@quickreserve.app",
      // Custom sendVerificationRequest() function
      sendVerificationRequest,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email;
      if (!email) {
        return false;
      }
      // Vérifiez si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        // Si l'utilisateur n'existe pas, créez un nouvel utilisateur avec ownerId = id
        const newUser = await prisma.user.create({
          data: {
            email: email,
            name: user.name || email,
            image: user.image || "",
            ownerId: null,
            role: "OWNER", // Rôle par défaut
          },
        });

        await prisma.user.update({
          data: {
            ownerId: newUser.id,
          },
          where: {
            id: newUser.id,
          },
        });
      }

      return true;
    },
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
