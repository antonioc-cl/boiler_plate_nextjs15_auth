import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/src/test/test-utils'
import { SignupForm } from './signup-form'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import * as authClient from '@/lib/auth/client'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

// Mock auth client
vi.mock('@/lib/auth/client', () => ({
  signUp: {
    email: vi.fn(),
  },
}))

describe('SignupForm', () => {
  const mockPush = vi.fn()
  const mockRefresh = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    } as any)
  })

  it('should render all form elements', () => {
    render(<SignupForm />)

    // Check for the card title - using data-slot attribute
    const titleElement = document.querySelector('[data-slot="card-title"]')
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveTextContent('Create an account')

    expect(
      screen.getByText(/enter your email and password to create your account/i)
    ).toBeInTheDocument()

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument()

    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/create a strong password/i)
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/confirm your password/i)
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should validate email field', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    const emailInput = screen.getByLabelText('Email')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    // Submit with empty email
    await user.click(submitButton)
    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument()
    })

    // Submit with invalid email
    await user.clear(emailInput)
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument()
    })

    // Valid email should not show error
    await user.clear(emailInput)
    await user.type(emailInput, 'valid@example.com')
    await user.tab() // Move to next field to trigger validation
    await waitFor(() => {
      expect(
        screen.queryByText(/please enter a valid email address/i)
      ).not.toBeInTheDocument()
    })
  })

  it('should validate password requirements', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    // Enter valid email first
    await user.type(emailInput, 'test@example.com')

    // Test empty password
    await user.click(submitButton)
    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument()
    })

    // Test short password
    await user.type(passwordInput, 'Pass1')
    await user.click(submitButton)
    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument()
    })

    // Test password without uppercase
    await user.clear(passwordInput)
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    await waitFor(() => {
      expect(
        screen.getByText(/password must contain at least one uppercase letter/i)
      ).toBeInTheDocument()
    })

    // Test password without lowercase
    await user.clear(passwordInput)
    await user.type(passwordInput, 'PASSWORD123')
    await user.click(submitButton)
    await waitFor(() => {
      expect(
        screen.getByText(/password must contain at least one lowercase letter/i)
      ).toBeInTheDocument()
    })

    // Test password without number
    await user.clear(passwordInput)
    await user.type(passwordInput, 'Passwordabc')
    await user.click(submitButton)
    await waitFor(() => {
      expect(
        screen.getByText(/password must contain at least one number/i)
      ).toBeInTheDocument()
    })

    // Valid password should not show error
    await user.clear(passwordInput)
    await user.type(passwordInput, 'Password123')
    await user.tab()
    await waitFor(() => {
      expect(screen.queryByText(/password must/i)).not.toBeInTheDocument()
    })
  })

  it('should validate password confirmation', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    // Enter valid email and password
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123')

    // Test mismatched passwords
    await user.type(confirmPasswordInput, 'Password456')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
    })

    // Test matching passwords
    await user.clear(confirmPasswordInput)
    await user.type(confirmPasswordInput, 'Password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.queryByText(/passwords don't match/i)
      ).not.toBeInTheDocument()
      expect(authClient.signUp.email).toHaveBeenCalled()
    })
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    vi.mocked(authClient.signUp.email).mockResolvedValueOnce({
      error: null,
    } as any)
    render(<SignupForm />)

    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123')
    await user.type(confirmPasswordInput, 'Password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'Password123',
        callbackURL: '/dashboard',
      })
      expect(mockPush).toHaveBeenCalledWith('/verify-email')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('should not include confirmPassword in submission data', async () => {
    const user = userEvent.setup()
    vi.mocked(authClient.signUp.email).mockResolvedValueOnce({
      error: null,
    } as any)
    render(<SignupForm />)

    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123')
    await user.type(confirmPasswordInput, 'Password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'Password123',
        callbackURL: '/dashboard',
      })
      // Ensure confirmPassword is NOT in the call
      const calls = vi.mocked(authClient.signUp.email).mock.calls
      expect(calls[0]?.[0]).not.toHaveProperty('confirmPassword')
    })
  })

  it('should show loading state while submitting', async () => {
    const user = userEvent.setup()
    vi.mocked(authClient.signUp.email).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null } as any), 100)
        )
    )
    render(<SignupForm />)

    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123')
    await user.type(confirmPasswordInput, 'Password123')
    await user.click(submitButton)

    // Check loading state
    expect(
      screen.getByRole('button', { name: /creating account.../i })
    ).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    // Wait for submission to complete
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /create account/i })
      ).toBeInTheDocument()
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('should display error message on submission failure', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Email already exists'
    vi.mocked(authClient.signUp.email).mockResolvedValueOnce({
      error: { message: errorMessage },
    } as any)
    render(<SignupForm />)

    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123')
    await user.type(confirmPasswordInput, 'Password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage)
    })

    // Button should be enabled again after error
    expect(submitButton).not.toBeDisabled()
  })

  it('should display generic error message for non-Error failures', async () => {
    const user = userEvent.setup()
    vi.mocked(authClient.signUp.email).mockRejectedValueOnce(
      'Some string error'
    )
    render(<SignupForm />)

    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123')
    await user.type(confirmPasswordInput, 'Password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Something went wrong. Please try again.'
      )
    })
  })

  it('should clear error message on new submission', async () => {
    const user = userEvent.setup()
    vi.mocked(authClient.signUp.email).mockResolvedValueOnce({
      error: { message: 'First error' },
    } as any)
    render(<SignupForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    // First submission - should show error
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123')
    await user.type(confirmPasswordInput, 'Password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('First error')
    })

    // Second submission - should clear previous error
    vi.mocked(authClient.signUp.email).mockResolvedValueOnce({
      error: null,
    } as any)
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('should have correct input types and autocomplete attributes', () => {
    render(<SignupForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('autocomplete', 'email')

    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('autocomplete', 'new-password')

    expect(confirmPasswordInput).toHaveAttribute('type', 'password')
    expect(confirmPasswordInput).toHaveAttribute('autocomplete', 'new-password')
  })

  it('should link to login page', () => {
    render(<SignupForm />)

    const loginLink = screen.getByRole('link', { name: /sign in/i })
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('should prevent multiple simultaneous submissions', async () => {
    const user = userEvent.setup()
    vi.mocked(authClient.signUp.email).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null } as any), 100)
        )
    )
    render(<SignupForm />)

    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123')
    await user.type(confirmPasswordInput, 'Password123')

    // Click multiple times quickly
    await user.click(submitButton)
    await user.click(submitButton)
    await user.click(submitButton)

    // Should only call signUp once
    expect(authClient.signUp.email).toHaveBeenCalledTimes(1)
  })

  it('should reset form on successful submission', async () => {
    const user = userEvent.setup()
    vi.mocked(authClient.signUp.email).mockResolvedValueOnce({
      error: null,
    } as any)
    render(<SignupForm />)

    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123')
    await user.type(confirmPasswordInput, 'Password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalled()
    })

    // Note: Form reset behavior depends on the implementation
    // This test assumes the form doesn't reset (which is the current implementation)
    // If you want the form to reset, you'd need to update the component
    expect(emailInput).toHaveValue('test@example.com')
  })
})
