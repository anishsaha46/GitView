import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

// Log environment variables for debugging (will be visible in Netlify function logs)
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("GITHUB_ID length:", process.env.GITHUB_ID?.length);

// Get the GitHub ID directly to avoid any potential truncation
const GITHUB_ID = process.env.GITHUB_ID || "";
const GITHUB_SECRET = process.env.GITHUB_SECRET || "";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
    async redirect({ url, baseUrl }) {
      // Log the redirect parameters for debugging
      console.log("NextAuth Redirect:", { url, baseUrl });
      
      if (url.startsWith(baseUrl)) return url
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString()
      return baseUrl + "/dashboard"
    },
  },
  debug: true, // Enable debug logs
  pages: {
    signIn: '/auth/signin',
  }
})

export { handler as GET, handler as POST }