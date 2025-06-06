import NextAuth, { DefaultSession } from "next-auth"
import GithubProvider from "next-auth/providers/github"

interface ExtendedSession extends DefaultSession {
  accessToken?: string
}

interface ExtendedToken {
  accessToken?: string
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: { session: ExtendedSession; token: ExtendedToken }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    },
  },
})

export { handler as GET, handler as POST }

