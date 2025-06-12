import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/src/test/test-utils'
import { LoginForm } from './login-form'
import userEvent from '@testing-library/user-event'

describe('LoginForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all form elements', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />)

    // Check for the card title - using data-slot attribute
    const titleElement = document.querySelector('[data-slot="card-title"]')
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveTextContent('Sign in')

    expect(
      screen.getByText(/enter your email and password/i)
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument()

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/enter your password/i)
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })

  it('should validate email field', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

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
    await user.click(submitButton)
    await waitFor(() => {
      expect(
        screen.queryByText(/please enter a valid email address/i)
      ).not.toBeInTheDocument()
    })
  })

  it('should validate password field', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    // Enter valid email
    await user.type(emailInput, 'test@example.com')

    // Submit with empty password
    await user.click(submitButton)
    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument()
    })

    // Submit with short password
    await user.type(passwordInput, 'short')
    await user.click(submitButton)
    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument()
    })

    // Valid password should not show error
    await user.clear(passwordInput)
    await user.type(passwordInput, 'validpassword123')
    await user.click(submitButton)
    await waitFor(() => {
      expect(
        screen.queryByText(/password must be at least 8 characters/i)
      ).not.toBeInTheDocument()
    })
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValueOnce(undefined)
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should show loading state while submitting', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Check loading state
    expect(screen.getByText('Signing in...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    // Wait for submission to complete
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).toBeInTheDocument()
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('should display error message on submission failure', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Invalid credentials'
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage))
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage)
    })

    // Button should be enabled again after error
    expect(submitButton).not.toBeDisabled()
  })

  it('should display generic error message for non-Error failures', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockRejectedValueOnce('Some string error')
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Something went wrong. Please try again.'
      )
    })
  })

  it('should clear error message on new submission', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockRejectedValueOnce(new Error('First error'))
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    // First submission - should show error
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('First error')
    })

    // Second submission - should clear previous error
    mockOnSubmit.mockResolvedValueOnce(undefined)
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('should have correct input types and autocomplete attributes', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('autocomplete', 'email')

    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password')
  })

  it('should link to signup page', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const signupLink = screen.getByRole('link', { name: /sign up/i })
    expect(signupLink).toHaveAttribute('href', '/signup')
  })

  it('should prevent multiple simultaneous submissions', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    // Click multiple times quickly
    await user.click(submitButton)
    await user.click(submitButton)
    await user.click(submitButton)

    // Should only call onSubmit once
    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
  })

  it('should not submit form with invalid data', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    // Type invalid email and valid password
    await user.type(emailInput, 'invalid-email')
    await user.type(passwordInput, 'validpassword123')

    // Try to submit the form
    await user.click(submitButton)

    // Wait a bit to ensure no submission happens
    await waitFor(() => {
      // Ensure the form wasn't submitted due to validation error
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })
})
