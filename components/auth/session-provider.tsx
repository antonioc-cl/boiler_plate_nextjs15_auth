'use client'

import { useSession } from '@/lib/auth/client'
import { createContext, useContext, ReactNode } from 'react'

interface SessionContextType {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
    emailVerified: boolean
  } | null
  session: {
    id: string
    userId: string
    expiresAt: Date
  } | null
  isPending: boolean
  error: Error | null
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const { data, isPending, error } = useSession()

  const value: SessionContextType = {
    user: data?.user
      ? {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name || null,
          image: data.user.image || null,
          emailVerified: data.user.emailVerified,
        }
      : null,
    session: data?.session || null,
    isPending,
    error: error || null,
  }

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export function useSessionContext() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider')
  }
  return context
}
