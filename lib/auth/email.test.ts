import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendVerificationEmail, sendPasswordResetEmail } from './email'
import { sendEmail } from '@/lib/email/send-email'
import EmailVerificationEmail from '@/emails/email-verification'
import PasswordResetEmail from '@/emails/password-reset'

// Mock dependencies
vi.mock('@/lib/email/send-email', () => ({
  sendEmail: vi.fn(),
}))

vi.mock('@/emails/email-verification', () => ({
  default: vi.fn().mockReturnValue('email-verification-template'),
}))

vi.mock('@/emails/password-reset', () => ({
  default: vi.fn().mockReturnValue('password-reset-template'),
}))

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  vi.clearAllMocks()
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_APP_URL: 'https://example.com',
  }
})

afterEach(() => {
  process.env = originalEnv
})

describe('auth/email', () => {
  describe('sendVerificationEmail', () => {
    it('should send verification email with correct parameters', async () => {
      const email = 'test@example.com'
      const token = 'verification-token-123'

      await sendVerificationEmail(email, token)

      expect(EmailVerificationEmail).toHaveBeenCalledWith({
        name: 'test',
        email: 'test@example.com',
        verificationUrl:
          'https://example.com/api/auth/verify-email?token=verification-token-123',
        expirationHours: 24,
      })

      expect(sendEmail).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Verify your email address',
        react: 'email-verification-template',
      })
    })

    it('should handle email without @ properly', async () => {
      const email = 'invalid-email'
      const token = 'verification-token-123'

      await sendVerificationEmail(email, token)

      expect(EmailVerificationEmail).toHaveBeenCalledWith({
        name: 'invalid-email', // split('@')[0] returns the whole string if no @ found
        email: 'invalid-email',
        verificationUrl:
          'https://example.com/api/auth/verify-email?token=verification-token-123',
        expirationHours: 24,
      })
    })

    it('should handle empty email name part', async () => {
      const email = '@example.com'
      const token = 'verification-token-123'

      await sendVerificationEmail(email, token)

      expect(EmailVerificationEmail).toHaveBeenCalledWith({
        name: 'there',
        email: '@example.com',
        verificationUrl:
          'https://example.com/api/auth/verify-email?token=verification-token-123',
        expirationHours: 24,
      })
    })
  })

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email with correct parameters', async () => {
      const email = 'user@example.com'
      const token = 'reset-token-456'

      await sendPasswordResetEmail(email, token)

      expect(PasswordResetEmail).toHaveBeenCalledWith({
        name: 'user',
        email: 'user@example.com',
        resetUrl: 'https://example.com/reset-password?token=reset-token-456',
        expirationHours: 1,
      })

      expect(sendEmail).toHaveBeenCalledWith({
        to: 'user@example.com',
        subject: 'Reset your password',
        react: 'password-reset-template',
      })
    })

    it('should handle email with multiple @ symbols', async () => {
      const email = 'user@subdomain@example.com'
      const token = 'reset-token-456'

      await sendPasswordResetEmail(email, token)

      expect(PasswordResetEmail).toHaveBeenCalledWith({
        name: 'user',
        email: 'user@subdomain@example.com',
        resetUrl: 'https://example.com/reset-password?token=reset-token-456',
        expirationHours: 1,
      })
    })

    it('should fallback to "there" for empty name in password reset', async () => {
      const email = '@example.com'
      const token = 'reset-token-456'

      await sendPasswordResetEmail(email, token)

      expect(PasswordResetEmail).toHaveBeenCalledWith({
        name: 'there', // fallback when email.split('@')[0] is empty
        email: '@example.com',
        resetUrl: 'https://example.com/reset-password?token=reset-token-456',
        expirationHours: 1,
      })
    })
  })

  describe('environment variables', () => {
    it('should handle missing NEXT_PUBLIC_APP_URL', async () => {
      delete process.env.NEXT_PUBLIC_APP_URL

      const email = 'test@example.com'
      const token = 'token-123'

      await sendVerificationEmail(email, token)

      expect(EmailVerificationEmail).toHaveBeenCalledWith({
        name: 'test',
        email: 'test@example.com',
        verificationUrl: 'undefined/api/auth/verify-email?token=token-123',
        expirationHours: 24,
      })
    })
  })
})
