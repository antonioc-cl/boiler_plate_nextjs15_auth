'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth/better-auth'
import type { AuthFormState, GetCurrentUserResponse } from '@/types/auth'

// Validation schemas removed as they're not used with client-side auth

export async function signup(
  _prevState: AuthFormState | null,
  _formData: FormData
): Promise<AuthFormState> {
  // Server-side signup is not supported by Better Auth
  // Signup should be done via client-side API using signUp.email()
  return {
    success: false,
    error: 'Please use the client-side signup form.',
  }
}

export async function login(
  _prevState: AuthFormState | null,
  _formData: FormData
): Promise<AuthFormState> {
  // Server-side login is not supported by Better Auth
  // Login should be done via client-side API using signIn.email()
  return {
    success: false,
    error: 'Please use the client-side login form.',
  }
}

export async function logout(): Promise<AuthFormState> {
  try {
    // Sign out using Better Auth API
    const result = await auth.api.signOut({
      headers: await headers(),
    })

    if (!result || 'error' in result) {
      return {
        success: false,
        error: 'Failed to sign out',
      }
    }

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
    // Get session using Better Auth API
    const session = (await auth.api.getSession({
      headers: await headers(),
    })) as any

    if (!session || !session.user) {
      return {
        success: false,
        user: null,
      }
    }

    return {
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        username: session.user.name || null,
        emailVerified: session.user.emailVerified || false,
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
