import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { env, validateEnvironment } from "@/lib/env"

// Validate environment on startup
validateEnvironment()

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      return token
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  debug: env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }
