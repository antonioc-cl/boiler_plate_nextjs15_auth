import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/src/test/test-utils'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/auth/login-form'
import { SignupForm } from '@/components/auth/signup-form'
import { signIn, signUp } from '@/lib/auth/client'

// Mock the auth client methods
vi.mock('@/lib/auth/client', () => ({
  signIn: {
    email: vi.fn(),
  },
  signUp: {
    email: vi.fn(),
  },
}))

// Mock next/navigation
const mockPush = vi.fn()
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  redirect: vi.fn(),
}))

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Login Flow Integration', () => {
    it('should successfully login and redirect', async () => {
      const user = userEvent.setup()

      // Mock successful login
      vi.mocked(signIn.email).mockResolvedValueOnce({ error: null })

      render(<LoginForm />)

      // Fill in the form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')

      // Submit the form
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      // Verify the action was called with correct data
      await waitFor(() => {
        expect(signIn.email).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          callbackURL: '/dashboard',
        })
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('should handle login errors gracefully', async () => {
      const user = userEvent.setup()

      // Mock failed login
      vi.mocked(signIn.email).mockResolvedValueOnce({
        error: { message: 'Invalid credentials' },
      })

      render(<LoginForm />)

      // Fill in the form with invalid credentials
      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')

      // Submit the form
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      // Verify error is displayed
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Invalid credentials'
        )
        expect(mockPush).not.toHaveBeenCalled()
      })
    })

    it('should handle network errors during login', async () => {
      const user = userEvent.setup()

      // Mock network error
      vi.mocked(signIn.email).mockRejectedValueOnce(new Error('Network error'))

      render(<LoginForm />)

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Network error')
        expect(mockPush).not.toHaveBeenCalled()
      })
    })
  })

  describe('Signup Flow Integration', () => {
    it('should successfully signup and redirect', async () => {
      const user = userEvent.setup()

      // Mock successful signup
      vi.mocked(signUp.email).mockResolvedValueOnce({ error: null })

      render(<SignupForm />)

      // Fill in the form
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      await user.type(screen.getByLabelText('Email'), 'newuser@example.com')
      await user.type(screen.getByLabelText('Password'), 'Password123!')
      await user.type(
        screen.getByLabelText(/confirm password/i),
        'Password123!'
      )

      // Submit the form
      await user.click(screen.getByRole('button', { name: /create account/i }))

      // Verify the action was called with correct data
      await waitFor(() => {
        expect(signUp.email).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          name: 'John Doe',
          password: 'Password123!',
          callbackURL: '/dashboard',
        })
        expect(mockPush).toHaveBeenCalledWith('/verify-email')
      })
    })

    it('should handle duplicate email errors', async () => {
      const user = userEvent.setup()

      // Mock duplicate email error
      vi.mocked(signUp.email).mockResolvedValueOnce({
        error: { message: 'Email already exists' },
      })

      render(<SignupForm />)

      // Fill in the form with existing email
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      await user.type(screen.getByLabelText('Email'), 'existing@example.com')
      await user.type(screen.getByLabelText('Password'), 'Password123!')
      await user.type(
        screen.getByLabelText(/confirm password/i),
        'Password123!'
      )

      // Submit the form
      await user.click(screen.getByRole('button', { name: /create account/i }))

      // Verify error is displayed
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Email already exists'
        )
        expect(mockPush).not.toHaveBeenCalled()
      })
    })

    it('should validate passwords match before calling server action', async () => {
      const user = userEvent.setup()

      render(<SignupForm />)

      // Fill in the form with mismatched passwords
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      await user.type(screen.getByLabelText('Email'), 'test@example.com')
      await user.type(screen.getByLabelText('Password'), 'Password123!')
      await user.type(
        screen.getByLabelText(/confirm password/i),
        'DifferentPassword123!'
      )

      // Submit the form
      await user.click(screen.getByRole('button', { name: /create account/i }))

      // Verify server action was NOT called due to validation error
      await waitFor(() => {
        expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
        expect(signUp.email).not.toHaveBeenCalled()
        expect(mockPush).not.toHaveBeenCalled()
      })
    })
  })

  describe('Form and Server Action Error Handling', () => {
    it('should retry after fixing validation errors', async () => {
      const user = userEvent.setup()

      vi.mocked(signIn.email).mockResolvedValueOnce({ error: null })

      render(<LoginForm />)

      // First attempt with short password (less than 8 characters)
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'short')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      // Should show validation error
      await waitFor(() => {
        // Check for the password validation error
        const errorElement = screen.getByText(
          /password must be at least 8 characters/i
        )
        expect(errorElement).toBeInTheDocument()
        expect(signIn.email).not.toHaveBeenCalled()
      })

      // Fix the password and retry
      await user.clear(screen.getByLabelText(/password/i))
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      // Should now succeed
      await waitFor(() => {
        expect(signIn.email).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          callbackURL: '/dashboard',
        })
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('should handle server action timeout', async () => {
      const user = userEvent.setup()

      // Mock timeout
      vi.mocked(signIn.email).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ error: { message: 'Request timeout' } }),
              100
            )
          )
      )

      render(<LoginForm />)

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      // Should show loading state initially
      expect(screen.getByText('Signing in...')).toBeInTheDocument()

      // Should show error after timeout
      await waitFor(
        () => {
          expect(screen.getByRole('alert')).toHaveTextContent('Request timeout')
          expect(mockPush).not.toHaveBeenCalled()
        },
        { timeout: 200 }
      )
    })
  })

  describe('Session Management Integration', () => {
    it('should refresh the page after successful login', async () => {
      const user = userEvent.setup()

      vi.mocked(signIn.email).mockResolvedValueOnce({ error: null })

      render(<LoginForm />)

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('should handle concurrent form submissions', async () => {
      const user = userEvent.setup()

      // Mock a slow server action
      let callCount = 0
      vi.mocked(signIn.email).mockImplementation(() => {
        callCount++
        return new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100)
        )
      })

      render(<LoginForm />)

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')

      // Try to submit multiple times quickly
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      // The button should be disabled after first click
      expect(submitButton).toBeDisabled()

      // Wait for the operation to complete
      await waitFor(
        () => {
          expect(callCount).toBe(1)
          expect(mockPush).toHaveBeenCalledTimes(1)
        },
        { timeout: 200 }
      )
    })
  })
})
