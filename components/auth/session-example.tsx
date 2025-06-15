'use client'

import { useSession } from '@/lib/auth/client'

/**
 * Example component showing how to use Better Auth session hooks
 * This demonstrates the basic usage pattern for authentication state
 */
export function SessionExample() {
  const { data: session, isPending, error } = useSession()

  if (isPending) {
    return <div>Loading session...</div>
  }

  if (error) {
    return <div>Error loading session: {error.message}</div>
  }

  if (!session?.user) {
    return (
      <div>
        <p>You are not logged in</p>
        <a href="/login">Login</a>
      </div>
    )
  }

  return (
    <div>
      <h2>Welcome, {session.user.name || session.user.email}!</h2>
      <p>Email: {session.user.email}</p>
      <p>Email verified: {session.user.emailVerified ? 'Yes' : 'No'}</p>
      <p>
        Session expires: {new Date(session.session.expiresAt).toLocaleString()}
      </p>
    </div>
  )
}
