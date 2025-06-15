'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/types/routes'
import { signOut } from '@/lib/auth/client'

export function LogoutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await signOut()
        router.push(ROUTES.LOGIN)
        router.refresh()
      } catch (error) {
        console.error('Logout error:', error)
      }
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
    >
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  )
}
