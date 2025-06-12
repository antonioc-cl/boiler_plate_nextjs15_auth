import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  hashPassword,
  verifyPassword,
  createUser,
  signIn,
  signOut,
} from './utils'
import { lucia } from './index'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Session } from '@/lib/auth'

// Mock dependencies
vi.mock('./index', () => ({
  lucia: {
    createSession: vi.fn(),
    createSessionCookie: vi.fn(),
    validateSession: vi.fn(),
    invalidateSession: vi.fn(),
    createBlankSessionCookie: vi.fn(),
    sessionCookieName: 'auth-session',
  },
}))

vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn(),
    select: vi.fn(),
  },
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('lucia', () => ({
  generateId: vi.fn(() => 'test-user-id-123'),
}))

describe('auth/utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123!'
      const hashed = await hashPassword(password)

      expect(hashed).toBeDefined()
      expect(hashed).not.toBe(password)
      expect(hashed.length).toBeGreaterThan(0)
    })

    it('should produce different hashes for the same password', async () => {
      const password = 'testPassword123!'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      expect(hash1).not.toBe(hash2)
    })

    it('should handle empty password', async () => {
      const hashed = await hashPassword('')
      expect(hashed).toBeDefined()
      expect(hashed.length).toBeGreaterThan(0)
    })
  })

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const password = 'testPassword123!'
      const hashed = await hashPassword(password)
      const isValid = await verifyPassword(hashed, password)

      expect(isValid).toBe(true)
    })

    it('should reject an incorrect password', async () => {
      const password = 'testPassword123!'
      const wrongPassword = 'wrongPassword123!'
      const hashed = await hashPassword(password)
      const isValid = await verifyPassword(hashed, wrongPassword)

      expect(isValid).toBe(false)
    })

    it('should handle empty password verification', async () => {
      const password = 'testPassword123!'
      const hashed = await hashPassword(password)
      const isValid = await verifyPassword(hashed, '')

      expect(isValid).toBe(false)
    })
  })

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUser = {
        id: 'test-user-id-123',
        email: 'test@example.com',
        username: 'testuser',
        hashedPassword: 'hashed-password',
      }

      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([mockUser]),
      }

      const mockedDbInsert = vi.mocked(db.insert)
      mockedDbInsert.mockReturnValue(
        mockInsert as unknown as ReturnType<typeof db.insert>
      )

      const result = await createUser(
        'test@example.com',
        'password123',
        'testuser'
      )

      expect(db.insert).toHaveBeenCalledWith(users)
      expect(mockInsert.values).toHaveBeenCalledWith({
        id: 'test-user-id-123',
        email: 'test@example.com',
        username: 'testuser',
        hashedPassword: expect.stringMatching(/^\$argon2id\$/),
      })
      expect(result).toEqual(mockUser)
    })

    it('should lowercase email addresses', async () => {
      const mockUser = {
        id: 'test-user-id-123',
        email: 'test@example.com',
        username: 'testuser',
        hashedPassword: 'hashed-password',
      }

      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([mockUser]),
      }

      const mockedDbInsert = vi.mocked(db.insert)
      mockedDbInsert.mockReturnValue(
        mockInsert as unknown as ReturnType<typeof db.insert>
      )

      await createUser('TEST@EXAMPLE.COM', 'password123', 'testuser')

      expect(mockInsert.values).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
        })
      )
    })

    it('should handle duplicate email error', async () => {
      const dbError = Object.assign(
        new Error('Duplicate key value violates unique constraint'),
        { code: '23505' }
      )
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockRejectedValue(dbError),
      }

      const mockedDbInsert = vi.mocked(db.insert)
      mockedDbInsert.mockReturnValue(
        mockInsert as unknown as ReturnType<typeof db.insert>
      )

      await expect(
        createUser('test@example.com', 'password123')
      ).rejects.toThrow('Email or username already exists')
    })

    it('should propagate other database errors', async () => {
      const dbError = new Error('Database connection failed')
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockRejectedValue(dbError),
      }

      const mockedDbInsert = vi.mocked(db.insert)
      mockedDbInsert.mockReturnValue(
        mockInsert as unknown as ReturnType<typeof db.insert>
      )

      await expect(
        createUser('test@example.com', 'password123')
      ).rejects.toThrow('Database connection failed')
    })

    it('should create user without username', async () => {
      const mockUser = {
        id: 'test-user-id-123',
        email: 'test@example.com',
        username: undefined,
        hashedPassword: 'hashed-password',
      }

      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([mockUser]),
      }

      const mockedDbInsert = vi.mocked(db.insert)
      mockedDbInsert.mockReturnValue(
        mockInsert as unknown as ReturnType<typeof db.insert>
      )

      const result = await createUser('test@example.com', 'password123')

      expect(mockInsert.values).toHaveBeenCalledWith(
        expect.objectContaining({
          username: undefined,
        })
      )
      expect(result).toEqual(mockUser)
    })
  })

  describe('signIn', () => {
    const mockCookies = {
      set: vi.fn(),
      get: vi.fn(),
    }

    beforeEach(() => {
      const mockedCookies = vi.mocked(cookies)
      mockedCookies.mockResolvedValue(
        mockCookies as unknown as Awaited<ReturnType<typeof cookies>>
      )
    })

    it('should sign in a user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        hashedPassword: await hashPassword('password123'),
      }

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockUser]),
      }

      const mockedDbSelect = vi.mocked(db.select)
      mockedDbSelect.mockReturnValue(
        mockSelect as unknown as ReturnType<typeof db.select>
      )

      const mockSession = { id: 'session-123', userId: 'user-123' }
      const mockSessionCookie = {
        name: 'auth-session',
        value: 'session-cookie-value',
        attributes: { httpOnly: true, secure: true },
      }

      vi.mocked(lucia.createSession).mockResolvedValue(
        mockSession as unknown as Session
      )
      vi.mocked(lucia.createSessionCookie).mockReturnValue(
        mockSessionCookie as unknown as ReturnType<
          typeof lucia.createSessionCookie
        >
      )

      const result = await signIn('test@example.com', 'password123')

      expect(db.select).toHaveBeenCalled()
      expect(lucia.createSession).toHaveBeenCalledWith('user-123', {})
      expect(mockCookies.set).toHaveBeenCalledWith(
        'auth-session',
        'session-cookie-value',
        { httpOnly: true, secure: true }
      )
      expect(result).toEqual({
        user: mockUser,
        session: mockSession,
      })
    })

    it('should lowercase email on sign in', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        hashedPassword: await hashPassword('password123'),
      }

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockUser]),
      }

      const mockedDbSelect = vi.mocked(db.select)
      mockedDbSelect.mockReturnValue(
        mockSelect as unknown as ReturnType<typeof db.select>
      )

      vi.mocked(lucia.createSession).mockResolvedValue({
        id: 'session-123',
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      } as unknown as Session)
      vi.mocked(lucia.createSessionCookie).mockReturnValue({
        name: 'auth-session',
        value: 'session-value',
        attributes: {},
      } as unknown as ReturnType<typeof lucia.createSessionCookie>)

      await signIn('TEST@EXAMPLE.COM', 'password123')

      // Check that where was called with lowercase email
      expect(mockSelect.where).toHaveBeenCalled()
    })

    it('should throw error for non-existent user', async () => {
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
      }

      const mockedDbSelect = vi.mocked(db.select)
      mockedDbSelect.mockReturnValue(
        mockSelect as unknown as ReturnType<typeof db.select>
      )

      await expect(
        signIn('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Invalid email or password')
    })

    it('should throw error for incorrect password', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        hashedPassword: await hashPassword('correctPassword'),
      }

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockUser]),
      }

      const mockedDbSelect = vi.mocked(db.select)
      mockedDbSelect.mockReturnValue(
        mockSelect as unknown as ReturnType<typeof db.select>
      )

      await expect(signIn('test@example.com', 'wrongPassword')).rejects.toThrow(
        'Invalid email or password'
      )
    })
  })

  describe('signOut', () => {
    const mockCookies = {
      set: vi.fn(),
      get: vi.fn(),
    }

    beforeEach(() => {
      const mockedCookies = vi.mocked(cookies)
      mockedCookies.mockResolvedValue(
        mockCookies as unknown as Awaited<ReturnType<typeof cookies>>
      )
    })

    it('should sign out a user successfully', async () => {
      const mockSession = { id: 'session-123', userId: 'user-123' }
      mockCookies.get.mockReturnValue({ value: 'session-cookie-value' })

      vi.mocked(lucia.validateSession).mockResolvedValue({
        session: mockSession,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          username: null,
          hashedPassword: '',
          emailVerified: false,
          emailVerifiedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      } as unknown as Awaited<ReturnType<typeof lucia.validateSession>>)

      const blankCookie = {
        name: 'auth-session',
        value: '',
        attributes: { maxAge: 0 },
      }
      vi.mocked(lucia.createBlankSessionCookie).mockReturnValue(
        blankCookie as unknown as ReturnType<
          typeof lucia.createBlankSessionCookie
        >
      )

      await signOut()

      expect(lucia.validateSession).toHaveBeenCalledWith('session-cookie-value')
      expect(lucia.invalidateSession).toHaveBeenCalledWith('session-123')
      expect(mockCookies.set).toHaveBeenCalledWith('auth-session', '', {
        maxAge: 0,
      })
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('should redirect to login if no session exists', async () => {
      mockCookies.get.mockReturnValue(undefined)
      vi.mocked(lucia.validateSession).mockResolvedValue({
        session: null,
        user: null,
      } as unknown as Awaited<ReturnType<typeof lucia.validateSession>>)

      await signOut()

      expect(redirect).toHaveBeenCalledWith('/login')
      expect(lucia.invalidateSession).not.toHaveBeenCalled()
    })

    it('should handle missing session cookie', async () => {
      mockCookies.get.mockReturnValue(undefined)
      vi.mocked(lucia.validateSession).mockResolvedValue({
        session: null,
        user: null,
      } as unknown as Awaited<ReturnType<typeof lucia.validateSession>>)

      await signOut()

      expect(lucia.validateSession).toHaveBeenCalledWith('')
      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })
})
