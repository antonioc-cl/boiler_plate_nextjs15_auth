import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSession, getCurrentUser, requireAuth, requireVerifiedEmail, signOut } from './server'
import { auth } from './better-auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

// Mock dependencies
vi.mock('./better-auth', () => ({
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

// Mock React cache
vi.mock('react', () => ({
  cache: (fn: any) => fn,
}))

describe('auth/server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(headers).mockResolvedValue(new Headers())
    // Reset redirect mock to throw (like real Next.js redirect)
    vi.mocked(redirect).mockImplementation((url: string) => {
      throw new Error(`NEXT_REDIRECT:${url}`)
    })
  })

  describe('getSession', () => {
    it('should return a session when authenticated', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          emailVerified: true,
        },
        session: {
          id: 'session-123',
          userId: 'user-123',
        },
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)

      const session = await getSession()

      expect(auth.api.getSession).toHaveBeenCalledWith({
        headers: expect.any(Headers),
      })
      expect(session).toEqual(mockSession)
    })

    it('should return null when not authenticated', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as any)

      const session = await getSession()

      expect(session).toBeNull()
    })
  })

  describe('getCurrentUser', () => {
    it('should return the user from session', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        emailVerified: true,
      }

      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: mockUser,
        session: { id: 'session-123' },
      } as any)

      const user = await getCurrentUser()

      expect(user).toEqual(mockUser)
    })

    it('should return null when no session exists', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as any)

      const user = await getCurrentUser()

      expect(user).toBeNull()
    })

    it('should return null when session exists but no user', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        session: { id: 'session-123' },
      } as any)

      const user = await getCurrentUser()

      expect(user).toBeNull()
    })
  })

  describe('requireAuth', () => {
    it('should return session when authenticated', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          emailVerified: true,
        },
        session: {
          id: 'session-123',
          userId: 'user-123',
        },
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)

      const session = await requireAuth()

      expect(session).toEqual(mockSession)
      expect(redirect).not.toHaveBeenCalled()
    })

    it('should redirect to sign-in when not authenticated', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as any)

      await expect(requireAuth()).rejects.toThrow('NEXT_REDIRECT:/sign-in')
      expect(redirect).toHaveBeenCalledWith('/sign-in')
    })
  })

  describe('requireVerifiedEmail', () => {
    it('should return session when email is verified', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          emailVerified: true,
        },
        session: {
          id: 'session-123',
          userId: 'user-123',
        },
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)

      const session = await requireVerifiedEmail()

      expect(session).toEqual(mockSession)
      expect(redirect).toHaveBeenCalledTimes(0)
    })

    it('should redirect to verify-email when email is not verified', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          emailVerified: false,
        },
        session: {
          id: 'session-123',
          userId: 'user-123',
        },
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)

      await expect(requireVerifiedEmail()).rejects.toThrow('NEXT_REDIRECT:/verify-email')

      expect(redirect).toHaveBeenCalledWith('/verify-email')
    })

    it('should redirect to sign-in when not authenticated', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as any)

      // requireAuth will throw due to redirect
      const mockRedirect = vi.mocked(redirect).mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      await expect(requireVerifiedEmail()).rejects.toThrow('NEXT_REDIRECT')
      expect(mockRedirect).toHaveBeenCalledWith('/sign-in')
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
})