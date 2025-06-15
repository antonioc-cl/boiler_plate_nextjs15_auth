'use server'

import { z } from 'zod'
import { auth } from '@/lib/auth/better-auth'
import { headers } from 'next/headers'
import {
  sendPasswordResetEmail,
  sendEmailVerificationEmail,
  sendPasswordChangedEmail,
} from '@/lib/email/auth-emails'
import {
  checkRateLimit,
  passwordResetRateLimiter,
  verificationEmailRateLimiter,
  RateLimitError,
} from '@/lib/rate-limit'
import type { EmailActionResponse } from '@/types/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

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

    // Use Better Auth's forgetPassword API
    try {
      const response = await auth.api.forgetPassword({
        body: {
          email: validatedEmail.toLowerCase(),
        },
        headers: await headers(),
      })

      if (!response.status) {
        // Better Auth returns success even if user doesn't exist to prevent enumeration
        // So we should handle this gracefully
        console.error('Better Auth forget password failed')
      }

      return {
        success: true,
        message:
          'If an account exists with this email, you will receive a password reset link.',
      }
    } catch (betterAuthError) {
      console.error('Better Auth API error:', betterAuthError)
      return {
        success: true,
        message:
          'If an account exists with this email, you will receive a password reset link.',
      }
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

    // Use Better Auth's resetPassword API
    try {
      const response = await auth.api.resetPassword({
        body: {
          token: validated.token,
          newPassword: validated.password,
        },
        headers: await headers(),
      })

      if (!response.status) {
        return {
          success: false,
          error:
            'Invalid or expired reset token. Please request a new password reset.',
        }
      }

      // Note: Better Auth doesn't return user info in reset password response
      // We would need to look up the user separately if needed

      return {
        success: true,
        message: 'Your password has been reset successfully.',
      }
    } catch (betterAuthError) {
      console.error('Better Auth reset password error:', betterAuthError)
      return {
        success: false,
        error:
          'An error occurred while resetting your password. Please try again.',
      }
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
    // Use Better Auth's verifyEmail API
    const response = await auth.api.verifyEmail({
      query: {
        token,
      },
      headers: await headers(),
    })

    if (!response || 'error' in response) {
      return {
        success: false,
        error: 'Invalid or expired verification token.',
      }
    }

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
    // Get current session
    const session = (await auth.api.getSession({
      headers: await headers(),
    })) as any

    if (!session?.user || !session.user.id) {
      return {
        success: false,
        error: 'You must be logged in to resend verification email.',
      }
    }

    // Check if email is already verified
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    if (!user) {
      return {
        success: false,
        error: 'User not found.',
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

    // Use Better Auth's sendVerificationEmail API
    try {
      const response = await auth.api.sendVerificationEmail({
        body: {
          email: user.email,
        },
        headers: await headers(),
      })

      if (!response || 'error' in response) {
        console.error('Better Auth send verification error')
        return {
          success: false,
          error:
            'An error occurred while sending verification email. Please try again.',
        }
      }

      return {
        success: true,
        message: 'Verification email sent. Please check your inbox.',
      }
    } catch (betterAuthError) {
      console.error('Better Auth API error:', betterAuthError)
      return {
        success: false,
        error:
          'An error occurred while sending verification email. Please try again.',
      }
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
    // Get current session
    const session = (await auth.api.getSession({
      headers: await headers(),
    })) as any

    if (!session?.user || !session.user.id || !session.user.email) {
      return {
        success: false,
        error: 'You must be logged in to send test emails.',
      }
    }

    const testUrl = 'http://localhost:3000/test-link'
    const emailUser = {
      id: session.user.id,
      email: session.user.email,
      username: session.user.name || null,
    }

    switch (type) {
      case 'welcome':
        await sendEmailVerificationEmail(emailUser, testUrl)
        break
      case 'reset':
        await sendPasswordResetEmail(emailUser, testUrl)
        break
      case 'verify':
        await sendEmailVerificationEmail(emailUser, testUrl)
        break
      case 'changed':
        await sendPasswordChangedEmail(emailUser, '127.0.0.1')
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
