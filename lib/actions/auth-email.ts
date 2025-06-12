'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import {
  users,
  passwordResetTokens,
  emailVerificationTokens,
} from '@/lib/db/schema'
import { eq, and, gt } from 'drizzle-orm'
import { generateId } from 'lucia'
import { validateRequest } from '@/lib/auth'
import { hashPassword } from '@/lib/auth/utils'
import {
  sendPasswordResetEmail,
  sendEmailVerificationEmail,
  sendPasswordChangedEmail,
  generatePasswordResetUrl,
  generateVerificationUrl,
} from '@/lib/email/auth-emails'
import {
  checkRateLimit,
  passwordResetRateLimiter,
  verificationEmailRateLimiter,
  RateLimitError,
} from '@/lib/rate-limit'
import type { EmailActionResponse } from '@/types/auth'

// Validation schemas
const emailSchema = z.string().email('Invalid email address')

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
})

/**
 * Request a password reset email
 */
export async function requestPasswordReset(
  email: string
): Promise<EmailActionResponse> {
  try {
    // Validate email
    const validatedEmail = emailSchema.parse(email)

    // Check rate limit
    try {
      checkRateLimit(
        passwordResetRateLimiter,
        validatedEmail,
        'Too many password reset requests. Please try again later.'
      )
    } catch (error) {
      if (error instanceof RateLimitError) {
        return {
          success: false,
          error: error.message,
          retryAfter: error.retryAfter,
        }
      }
      throw error
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedEmail.toLowerCase()))
      .limit(1)

    // Always return success to prevent email enumeration
    if (!user) {
      return {
        success: true,
        message:
          'If an account exists with this email, you will receive a password reset link.',
      }
    }

    // Delete any existing reset tokens for this user
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id))

    // Generate new reset token
    const token = generateId(32)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await db.insert(passwordResetTokens).values({
      token,
      userId: user.id,
      expiresAt,
    })

    // Send password reset email
    const resetUrl = generatePasswordResetUrl(token)
    await sendPasswordResetEmail(user, resetUrl, 60)

    return {
      success: true,
      message:
        'If an account exists with this email, you will receive a password reset link.',
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Validation error',
      }
    }

    console.error('Password reset request error:', error)
    return {
      success: false,
      error:
        'An error occurred while processing your request. Please try again.',
    }
  }
}

/**
 * Reset password using a valid token
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<EmailActionResponse> {
  try {
    // Validate input
    const validated = resetPasswordSchema.parse({
      token,
      password: newPassword,
    })

    // Find valid token
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, validated.token),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      )
      .limit(1)

    if (!resetToken) {
      return {
        success: false,
        error:
          'Invalid or expired reset token. Please request a new password reset.',
      }
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, resetToken.userId))
      .limit(1)

    if (!user) {
      return {
        success: false,
        error: 'User not found.',
      }
    }

    // Hash new password
    const hashedPassword = await hashPassword(validated.password)

    // Update user password
    await db.update(users).set({ hashedPassword }).where(eq(users.id, user.id))

    // Delete used token
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, resetToken.id))

    // Send confirmation email
    await sendPasswordChangedEmail(user)

    return {
      success: true,
      message: 'Your password has been reset successfully.',
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Validation error',
      }
    }

    console.error('Password reset error:', error)
    return {
      success: false,
      error:
        'An error occurred while resetting your password. Please try again.',
    }
  }
}

/**
 * Verify email address using a token
 */
export async function verifyEmail(token: string): Promise<EmailActionResponse> {
  try {
    // Find valid token
    const [verificationToken] = await db
      .select()
      .from(emailVerificationTokens)
      .where(
        and(
          eq(emailVerificationTokens.token, token),
          gt(emailVerificationTokens.expiresAt, new Date())
        )
      )
      .limit(1)

    if (!verificationToken) {
      return {
        success: false,
        error: 'Invalid or expired verification token.',
      }
    }

    // Update user's email verification status
    await db
      .update(users)
      .set({
        emailVerified: true,
        emailVerifiedAt: new Date(),
      })
      .where(eq(users.id, verificationToken.userId))

    // Delete used token
    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.id, verificationToken.id))

    return {
      success: true,
      message: 'Your email has been verified successfully.',
    }
  } catch (error) {
    console.error('Email verification error:', error)
    return {
      success: false,
      error: 'An error occurred while verifying your email. Please try again.',
    }
  }
}

/**
 * Resend email verification for the current user
 */
export async function resendVerificationEmail(): Promise<EmailActionResponse> {
  try {
    // Get current user
    const { user } = await validateRequest()

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to resend verification email.',
      }
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: 'Your email is already verified.',
      }
    }

    // Check rate limit
    try {
      checkRateLimit(
        verificationEmailRateLimiter,
        user.email,
        'Too many verification email requests. Please try again later.'
      )
    } catch (error) {
      if (error instanceof RateLimitError) {
        return {
          success: false,
          error: error.message,
          retryAfter: error.retryAfter,
        }
      }
      throw error
    }

    // Delete any existing verification tokens for this user
    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.userId, user.id))

    // Generate new verification token
    const token = generateId(32)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await db.insert(emailVerificationTokens).values({
      token,
      userId: user.id,
      email: user.email,
      expiresAt,
    })

    // Send verification email
    const verificationUrl = generateVerificationUrl(token)
    await sendEmailVerificationEmail(user, verificationUrl, 24)

    return {
      success: true,
      message: 'Verification email sent. Please check your inbox.',
    }
  } catch (error) {
    console.error('Resend verification email error:', error)
    return {
      success: false,
      error:
        'An error occurred while sending verification email. Please try again.',
    }
  }
}

/**
 * Send a test email (for development/testing)
 */
export async function sendTestEmail(
  type: 'welcome' | 'reset' | 'verify' | 'changed'
): Promise<EmailActionResponse> {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return {
      success: false,
      error: 'Test emails are only available in development mode.',
    }
  }

  try {
    const { user } = await validateRequest()

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to send test emails.',
      }
    }

    const testUrl = 'http://localhost:3000/test-link'

    switch (type) {
      case 'welcome':
        await sendEmailVerificationEmail(user, testUrl)
        break
      case 'reset':
        await sendPasswordResetEmail(user, testUrl)
        break
      case 'verify':
        await sendEmailVerificationEmail(user, testUrl)
        break
      case 'changed':
        await sendPasswordChangedEmail(user, '127.0.0.1')
        break
      default:
        return {
          success: false,
          error: 'Invalid email type.',
        }
    }

    return {
      success: true,
      message: `Test ${type} email sent successfully.`,
    }
  } catch (error) {
    console.error('Send test email error:', error)
    return {
      success: false,
      error: 'An error occurred while sending test email.',
    }
  }
}
