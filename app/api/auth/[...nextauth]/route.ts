import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github";



export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // ...add more providers here
  ],
}

export const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};