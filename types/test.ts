// Test-specific types and mocks
import type { Session } from '@/lib/auth'
import type { User } from '@/lib/db/schema'
import type { vi } from 'vitest'

export interface MockDbInsert<T = any> {
  values: ReturnType<typeof vi.fn> & ((data: any) => MockDbInsert<T>)
  returning: ReturnType<typeof vi.fn> & (() => Promise<T[]>)
}

export interface MockDbSelect<T = any> {
  from: ReturnType<typeof vi.fn> & ((table: any) => MockDbSelect<T>)
  where: ReturnType<typeof vi.fn> & ((condition: any) => MockDbSelect<T>)
  limit: ReturnType<typeof vi.fn> & ((limit: number) => Promise<T[]>)
}

export interface MockCookies {
  set: ReturnType<typeof vi.fn>
  get: ReturnType<typeof vi.fn>
  delete?: ReturnType<typeof vi.fn>
}

export interface MockSessionCookie {
  name: string
  value: string
  attributes: {
    httpOnly?: boolean
    secure?: boolean
    sameSite?: string
    path?: string
    maxAge?: number
  }
}

export interface MockValidateSessionResult {
  user: User | null
  session: Session | null
}

export interface MockNextRouter {
  basePath: string
  pathname: string
  route: string
  query: Record<string, string | string[] | undefined>
  asPath: string
  push: (url: string, as?: string, options?: any) => Promise<boolean>
  replace: (url: string, as?: string, options?: any) => Promise<boolean>
  reload: () => void
  back: () => void
  prefetch: (url: string, as?: string, options?: any) => Promise<void>
  beforePopState: (cb: () => boolean) => void
  events: {
    on: (event: string, handler: (...args: any[]) => void) => void
    off: (event: string, handler: (...args: any[]) => void) => void
    emit: (event: string, ...args: any[]) => void
  }
  isFallback: boolean
  isLocaleDomain: boolean
  isReady: boolean
  isPreview: boolean
}
