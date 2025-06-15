import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  requireAuth,
  requireGuest,
  getCurrentUser,
  signOut,
  createSession,
} from './middleware-helpers'
import { auth } from '@/lib/auth/better-auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

// Mock dependencies
vi.mock('@/lib/auth/better-auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
      signOut: vi.fn(),
    },
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('auth/middleware-helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(headers).mockResolvedValue(new Headers())
    // Reset console.warn mock
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    // Reset redirect mock to throw (like real Next.js redirect)
    vi.mocked(redirect).mockImplementation((url: string) => {
      throw new Error(`NEXT_REDIRECT:${url}`)
    })
  })

  describe('requireAuth', () => {
    it('should return user and sessionId when authenticated', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          emailVerified: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
        session: {
          id: 'session-123',
          userId: 'user-123',
        },
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)

      const result = await requireAuth()

      expect(result).toEqual({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          username: 'Test User',
          hashedPassword: '',
          emailVerified: true,
          emailVerifiedAt: null,
          createdAt: mockSession.user.createdAt,
          updatedAt: mockSession.user.updatedAt,
        },
        sessionId: 'session-123',
      })
      expect(redirect).not.toHaveBeenCalled()
    })

    it('should handle user without name', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: null,
          emailVerified: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
        session: {
          id: 'session-123',
          userId: 'user-123',
        },
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)

      const result = await requireAuth()

      expect(result.user.username).toBeNull()
    })

    it('should redirect to login when not authenticated', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as any)

      // requireAuth will throw due to redirect
      const mockRedirect = vi.mocked(redirect).mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      await expect(requireAuth()).rejects.toThrow('NEXT_REDIRECT')
      expect(mockRedirect).toHaveBeenCalledWith('/login')
    })
  })

  describe('requireGuest', () => {
    it('should redirect to dashboard when authenticated', async () => {
      const mockSession = {
        user: { id: 'user-123' },
        session: { id: 'session-123' },
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)

      // requireGuest will throw due to redirect
      const mockRedirect = vi.mocked(redirect).mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      await expect(requireGuest()).rejects.toThrow('NEXT_REDIRECT')
      expect(mockRedirect).toHaveBeenCalledWith('/dashboard')
    })

    it('should not redirect when not authenticated', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as any)

      await requireGuest()

      expect(redirect).not.toHaveBeenCalled()
    })
  })

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          emailVerified: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
        session: {
          id: 'session-123',
          userId: 'user-123',
        },
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)

      const user = await getCurrentUser()

      expect(user).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        username: 'Test User',
        hashedPassword: '',
        emailVerified: true,
        emailVerifiedAt: null,
        createdAt: mockSession.user.createdAt,
        updatedAt: mockSession.user.updatedAt,
      })
    })

    it('should return null when not authenticated', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as any)

      const user = await getCurrentUser()

      expect(user).toBeNull()
    })
  })

  describe('signOut', () => {
    it('should call auth API signOut', async () => {
      await signOut()

      expect(auth.api.signOut).toHaveBeenCalledWith({
        headers: expect.any(Headers),
      })
    })
  })

  describe('createSession', () => {
    it('should log deprecation warning', async () => {
      await createSession()

      expect(console.warn).toHaveBeenCalledWith(
        'createSession is deprecated with Better Auth. Sessions are created automatically during sign-in.'
      )
    })
  })
})
