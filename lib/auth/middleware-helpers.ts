import { lucia, validateRequest } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { User } from '@/lib/db/schema'

/**
 * Server-side authentication check for protected routes
 * Use this in your server components or route handlers
 */
export async function requireAuth(): Promise<{
  user: User
  sessionId: string
}> {
  const { user, session } = await validateRequest()

  if (!user || !session) {
    redirect('/login')
  }

  return { user, sessionId: session.id }
}

/**
 * Server-side check for auth routes (login, signup, etc.)
 * Redirects to dashboard if already authenticated
 */
export async function requireGuest(): Promise<void> {
  const { user, session } = await validateRequest()

  if (user && session) {
    redirect('/dashboard')
  }
}

/**
 * Get current user without requiring authentication
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const { user } = await validateRequest()
  return user
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const { session } = await validateRequest()

  if (!session) {
    return
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  ;(await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
}

/**
 * Create a new session for a user
 */
export async function createSession(userId: string): Promise<void> {
  const session = await lucia.createSession(userId, {})
  const sessionCookie = lucia.createSessionCookie(session.id)

  ;(await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
}
