'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { lucia, validateRequest } from '@/lib/auth'
import { hashPassword, verifyPassword } from '@/lib/auth/utils'
import { generateId } from 'lucia'
import { emailVerificationTokens } from '@/lib/db/schema'
import {
  sendWelcomeEmail,
  generateVerificationUrl,
} from '@/lib/email/auth-emails'
import type { AuthFormState, GetCurrentUserResponse } from '@/types/auth'

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(255, 'Username must be less than 255 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    )
    .optional(),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function signup(
  _prevState: AuthFormState | null,
  formData: FormData
): Promise<AuthFormState> {
  try {
    // Extract form data
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      username: formData.get('username') as string | undefined,
    }

    // Validate input
    const validatedData = signupSchema.parse(rawData)

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email.toLowerCase()))
      .limit(1)

    if (existingUser.length > 0) {
      return {
        success: false,
        error: 'An account with this email already exists',
      }
    }

    // Check if username is taken (if provided)
    if (validatedData.username) {
      const existingUsername = await db
        .select()
        .from(users)
        .where(eq(users.username, validatedData.username))
        .limit(1)

      if (existingUsername.length > 0) {
        return {
          success: false,
          error: 'This username is already taken',
        }
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user
    const userId = generateId(15)
    const insertResult = await db
      .insert(users)
      .values({
        id: userId,
        email: validatedData.email.toLowerCase(),
        username: validatedData.username,
        hashedPassword,
      })
      .returning()

    const user = insertResult[0]
    if (!user) {
      throw new Error('Failed to create user')
    }

    // Create session
    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )

    // Send welcome email with verification link if email verification is enabled
    try {
      if (process.env.EMAIL_VERIFICATION_REQUIRED === 'true') {
        // Generate verification token
        const verificationToken = generateId(32)
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        await db.insert(emailVerificationTokens).values({
          token: verificationToken,
          userId: user.id,
          email: user.email,
          expiresAt,
        })

        // Send welcome email with verification link
        const verificationUrl = generateVerificationUrl(verificationToken)
        await sendWelcomeEmail(user, verificationUrl)
      } else {
        // Just send welcome email without verification
        await sendWelcomeEmail(user)
      }
    } catch (emailError) {
      // Log error but don't fail the signup
      console.error('Failed to send welcome email:', emailError)
    }

    return {
      success: true,
      message: 'Account created successfully',
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Validation error',
      }
    }

    console.error('Signup error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}

export async function login(
  _prevState: AuthFormState | null,
  formData: FormData
): Promise<AuthFormState> {
  try {
    // Extract form data
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    // Validate input
    const validatedData = loginSchema.parse(rawData)

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email.toLowerCase()))
      .limit(1)

    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }

    // Verify password
    const validPassword = await verifyPassword(
      user.hashedPassword,
      validatedData.password
    )

    if (!validPassword) {
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }

    // Create session
    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )

    return {
      success: true,
      message: 'Logged in successfully',
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Validation error',
      }
    }

    console.error('Login error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}

export async function logout(): Promise<AuthFormState> {
  try {
    // Get current session
    const { session } = await validateRequest()

    if (!session) {
      return {
        success: false,
        error: 'No active session found',
      }
    }

    // Invalidate session
    await lucia.invalidateSession(session.id)

    // Clear session cookie
    const sessionCookie = lucia.createBlankSessionCookie()
    const cookieStore = await cookies()
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )

    return {
      success: true,
      message: 'Logged out successfully',
    }
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while logging out',
    }
  }
}

// Additional helper actions

export async function getCurrentUser(): Promise<GetCurrentUserResponse> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return {
        success: false,
        user: null,
      }
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        emailVerified: user.emailVerified,
      },
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return {
      success: false,
      user: null,
    }
  }
}

// For forms that need to redirect after success
export async function signupAndRedirect(
  prevState: AuthFormState | null,
  formData: FormData
): Promise<AuthFormState> {
  const result = await signup(prevState, formData)

  if (result.success) {
    redirect('/dashboard')
  }

  return result
}

export async function loginAndRedirect(
  prevState: AuthFormState | null,
  formData: FormData
): Promise<AuthFormState> {
  const result = await login(prevState, formData)

  if (result.success) {
    redirect('/dashboard')
  }

  return result
}

export async function logoutAndRedirect(): Promise<AuthFormState> {
  const result = await logout()

  if (result.success) {
    redirect('/login')
  }

  return result
}
