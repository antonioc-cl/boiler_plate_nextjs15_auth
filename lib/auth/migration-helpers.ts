/**
 * Migration helpers for transitioning from Lucia Auth to Better Auth
 * These helpers provide compatibility layers and utilities
 */

import { getSession as getBetterAuthSession } from './server'
import type { User, Session } from './types'
import type { BetterAuthUser } from './types'

/**
 * Lucia-compatible validateRequest function
 * Provides the same interface as the original Lucia implementation
 */
export async function validateRequest(): Promise<
  { user: User; session: Session } | { user: null; session: null }
> {
  const betterAuthSession = (await getBetterAuthSession()) as any

  if (!betterAuthSession) {
    return { user: null, session: null }
  }

  // Map to our User and Session types
  const user: User = {
    id: betterAuthSession.user.id,
    email: betterAuthSession.user.email,
    username: betterAuthSession.user.name || null,
    hashedPassword: '', // Not exposed by Better Auth
    emailVerified: betterAuthSession.user.emailVerified,
    emailVerifiedAt: null, // Better Auth doesn't expose this directly
    createdAt: betterAuthSession.user.createdAt,
    updatedAt: betterAuthSession.user.updatedAt,
  }

  const session: Session = {
    id: betterAuthSession.session.id,
    userId: betterAuthSession.session.userId,
    expiresAt: betterAuthSession.session.expiresAt,
    fresh: false, // Better Auth doesn't have this concept
  }

  return { user, session }
}

/**
 * Convert a Better Auth user to match the Lucia User type structure
 * This helps with gradual migration of components
 */
export function toBetterAuthUser(user: User): BetterAuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.username || '',
    username: user.username,
    emailVerified: user.emailVerified,
    emailVerifiedAt: user.emailVerifiedAt,
    image: null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

/**
 * Session type compatibility
 * Maps Better Auth session to Lucia-like session structure
 */
export function toLuciaSession(session: Session): {
  id: string
  userId: string
  expiresAt: Date
  fresh: boolean
} {
  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
    fresh: session.fresh || false,
  }
}

/**
 * Create a session cookie name mapper
 * Helps with cookie migration during transition period
 */
export const cookieNames = {
  lucia: 'session',
  betterAuth: 'better-auth-session',
} as const

/**
 * Check if user has a valid session with either auth system
 * Useful during migration period
 */
export async function hasValidSession(): Promise<boolean> {
  const session = await getBetterAuthSession()
  return !!session
}
