import { auth } from './better-auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'

/**
 * Get the current session from Better Auth
 * This function is cached per request
 */
export const getSession = cache(async () => {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as any

  return session
})

/**
 * Get the current user from the session
 * Returns null if no session exists
 */
export const getCurrentUser = cache(async () => {
  const session = await getSession()
  return session?.user || null
})

/**
 * Protect a server component or route handler
 * Redirects to sign in if no session exists
 */
export async function requireAuth() {
  const session = (await getSession()) as any

  if (!session) {
    redirect('/sign-in')
  }

  return session
}

/**
 * Check if the current user's email is verified
 * Redirects to email verification if not verified
 */
export async function requireVerifiedEmail() {
  const session = await requireAuth()

  if (!session.user.emailVerified) {
    redirect('/verify-email')
  }

  return session
}

/**
 * Server-side sign out
 */
export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  })
}
