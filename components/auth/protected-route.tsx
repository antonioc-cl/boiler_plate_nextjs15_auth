'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth/client'
import { ROUTES } from '@/lib/types/routes'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireEmailVerification?: boolean
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requireEmailVerification = true,
  redirectTo = ROUTES.LOGIN,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push(redirectTo as any)
      } else if (requireEmailVerification && !session.user.emailVerified) {
        router.push('/verify-email' as any)
      }
    }
  }, [session, isPending, router, redirectTo, requireEmailVerification])

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  if (requireEmailVerification && !session.user.emailVerified) {
    return null
  }

  return <>{children}</>
}
