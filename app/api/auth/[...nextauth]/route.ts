import NextAuth, { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/src/db/prisma";

export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // ...add more providers here
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
} satisfies NextAuthOptions;

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
