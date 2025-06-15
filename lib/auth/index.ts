// Re-export everything from Better Auth configuration
export { auth, type Auth, getSession } from './better-auth'

// Re-export server utilities
export {
  getCurrentUser,
  requireAuth,
  requireVerifiedEmail,
  signOut,
} from './server'

// Re-export client utilities
export { authClient } from './client'

// Re-export types
export type { User, Session } from './types'

// Re-export email utilities
export { sendVerificationEmail, sendPasswordResetEmail } from './email'

// Legacy compatibility function for validateRequest
import { cache } from 'react'
import type { User, Session } from './types'
import { getSession as getSessionFromAuth } from './better-auth'

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const betterAuthSession = (await getSessionFromAuth()) as any

    if (!betterAuthSession) {
      return { user: null, session: null }
    }

    return {
      user: betterAuthSession.user as User,
      session: {
        id: betterAuthSession.session.id,
        userId: betterAuthSession.session.userId,
        expiresAt: new Date(betterAuthSession.session.expiresAt),
        fresh: false, // Better Auth doesn't have this concept
      },
    }
  }
)
