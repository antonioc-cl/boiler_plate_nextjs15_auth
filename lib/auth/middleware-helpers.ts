import { auth } from '@/lib/auth/better-auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { User } from '@/lib/auth/types'

/**
 * Server-side authentication check for protected routes
 * Use this in your server components or route handlers
 * Now using Better Auth instead of Lucia
 */
export async function requireAuth(): Promise<{
  user: User
  sessionId: string
}> {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as any

  if (!session) {
    redirect('/login')
  }

  // Map Better Auth user to our User type
  const user: User = {
    id: session.user.id,
    email: session.user.email,
    username: session.user.name || null,
    hashedPassword: '', // Not exposed by Better Auth
    emailVerified: session.user.emailVerified,
    emailVerifiedAt: null, // Better Auth doesn't expose this directly
    createdAt: session.user.createdAt,
    updatedAt: session.user.updatedAt,
  }

  return {
    user,
    sessionId: session.session.id,
  }
}

/**
 * Server-side check for auth routes (login, signup, etc.)
 * Redirects to dashboard if already authenticated
 */
export async function requireGuest(): Promise<void> {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as any

  if (session) {
    redirect('/dashboard')
  }
}

/**
 * Get current user without requiring authentication
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as any

  if (!session) {
    return null
  }

  // Map Better Auth user to our User type
  const user: User = {
    id: session.user.id,
    email: session.user.email,
    username: session.user.name || null,
    hashedPassword: '', // Not exposed by Better Auth
    emailVerified: session.user.emailVerified,
    emailVerifiedAt: null, // Better Auth doesn't expose this directly
    createdAt: session.user.createdAt,
    updatedAt: session.user.updatedAt,
  }

  return user
}

/**
 * Sign out the current user
 * Better Auth handles cookie management automatically
 */
export async function signOut(): Promise<void> {
  await auth.api.signOut({
    headers: await headers(),
  })
}

/**
 * Create a new session for a user
 * Note: With Better Auth, sessions are created automatically during sign-in
 * This function is kept for compatibility but shouldn't be used directly
 */
export async function createSession(): Promise<void> {
  console.warn(
    'createSession is deprecated with Better Auth. Sessions are created automatically during sign-in.'
  )
  // Better Auth handles session creation internally
}
