import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import {
  users,
  sessions,
  emailVerificationTokens,
  passwordResetTokens,
} from '@/lib/db/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      session: sessions,
      account: undefined, // We're not using OAuth providers yet
      verification: emailVerificationTokens,
      passwordResetToken: passwordResetTokens,
    },
  }),

  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  emailAndPassword: {
    enabled: true,
    requireEmailVerification:
      process.env.EMAIL_VERIFICATION_REQUIRED === 'true',
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update session if older than 1 day
  },

  // User configuration is handled by the schema

  // Account linking disabled by default

  plugins: [],

  secret:
    process.env.AUTH_SECRET || 'default-secret-please-change-in-production',

  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'],

  rateLimit: {
    enabled: true,
    window: 60, // 1 minute
    max: 10, // 10 requests per minute
  },

  advanced: {
    cookiePrefix: 'better-auth',
    generateId: false, // Use database's UUID generation
    crossSubDomainCookies: {
      enabled: false,
    },
    useSecureCookies: process.env.NODE_ENV === 'production',
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      path: '/',
    },
  },
})

// Export type-safe auth client
export type Auth = typeof auth

// Helper to get the session from headers
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session
}
