import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'

// NextAuth configuration using GitHub and Google providers and MongoDB adapter.
// Requires env vars: NEXTAUTH_SECRET, GITHUB_ID, GITHUB_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and MONGODB_URI.
export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || process.env.NEXT_OAUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET || process.env.NEXT_OAUTH_GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.NEXT_OAUTH_GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Support NEXTAUTH_URL or BASE_URL for local setups
  secret: process.env.NEXTAUTH_SECRET,
  pages: {},
  // Allow NEXTAUTH_URL or fallback to BASE_URL
  // Note: Next.js expects NEXTAUTH_URL in env for some flows; we don't set it here but will read BASE_URL elsewhere if needed.
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.sub
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
      }
      return session
    },
  },
})
