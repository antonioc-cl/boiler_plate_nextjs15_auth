'use client'

import { useSession } from '@/lib/auth/client'

export function AuthStatus() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <div className="text-sm text-gray-500">Loading...</div>
  }

  if (!session?.user) {
    return <div className="text-sm text-gray-500">Not authenticated</div>
  }

  return (
    <div className="text-sm">
      <p className="font-medium">Signed in as:</p>
      <p className="text-gray-600 dark:text-gray-400">{session.user.email}</p>
      {!session.user.emailVerified && (
        <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">
          Email not verified
        </p>
      )}
    </div>
  )
}
