'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/types/routes'

export function LogoutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          router.push(ROUTES.LOGIN)
          router.refresh()
        } else {
          console.error('Logout failed')
        }
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
