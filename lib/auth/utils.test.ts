import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  hashPassword,
  verifyPassword,
  createUser,
  signIn,
  signOut,
  generateId,
} from './utils'
import { auth } from './better-auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

// Mock dependencies
vi.mock('./better-auth', () => ({
  auth: {
    api: {
      signInEmail: vi.fn(),
      signOut: vi.fn(),
    },
  },
}))

vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn(),
    select: vi.fn(),
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('nanoid', () => ({
  nanoid: vi.fn((length) => 'test-id-' + '0'.repeat(length - 8)),
}))

describe('auth/utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(headers).mockResolvedValue(new Headers())
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
        id: 'test-id-0000000',
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
        id: 'test-id-0000000',
        email: 'test@example.com',
        username: 'testuser',
        hashedPassword: expect.stringMatching(/^\$argon2id\$/),
      })
      expect(result).toEqual(mockUser)
    })

    it('should lowercase email addresses', async () => {
      const mockUser = {
        id: 'test-id-0000000',
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
        id: 'test-id-0000000',
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
    it('should sign in a user successfully', async () => {
      const mockResult = {
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

      vi.mocked(auth.api.signInEmail).mockResolvedValue({
        redirect: false,
        token: 'test-token',
        url: undefined,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: '',
          image: null,
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      } as any)

      const result = await signIn('test@example.com', 'password123')

      expect(auth.api.signInEmail).toHaveBeenCalledWith({
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
        headers: expect.any(Headers),
      })
      expect(result).toEqual(mockResult)
    })

    it('should lowercase email on sign in', async () => {
      // mockResult was unused, removing it

      vi.mocked(auth.api.signInEmail).mockResolvedValue({
        redirect: false,
        token: 'test-token',
        url: undefined,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: '',
          image: null,
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      } as any)

      await signIn('TEST@EXAMPLE.COM', 'password123')

      expect(auth.api.signInEmail).toHaveBeenCalledWith({
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
        headers: expect.any(Headers),
      })
    })

    it('should throw error for failed sign in', async () => {
      vi.mocked(auth.api.signInEmail).mockResolvedValue(null as any)

      await expect(signIn('test@example.com', 'wrongPassword')).rejects.toThrow(
        'Invalid email or password'
      )
    })
  })

  describe('signOut', () => {
    it('should sign out a user successfully', async () => {
      vi.mocked(auth.api.signOut).mockResolvedValue({ success: true } as any)

      await signOut()

      expect(auth.api.signOut).toHaveBeenCalledWith({
        headers: expect.any(Headers),
      })
      expect(redirect).toHaveBeenCalledWith('/sign-in')
    })
  })

  describe('generateId', () => {
    it('should generate ID with default length', () => {
      const id = generateId()
      expect(id).toBe('test-id-0000000')
    })

    it('should generate ID with custom length', () => {
      const id = generateId(20)
      expect(id).toBe('test-id-000000000000')
    })
  })
})
