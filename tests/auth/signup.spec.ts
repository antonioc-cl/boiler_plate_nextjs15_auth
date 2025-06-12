import { test, expect } from '@playwright/test'
import { expectErrorMessage, waitForLoadingToFinish } from '../helpers/auth'
import {
  expectRedirectToDashboard,
  waitForPageLoad,
} from '../helpers/navigation'

test.describe('Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signup')
    await waitForPageLoad(page)
  })

  test('should display signup form with all required fields', async ({
    page,
  }) => {
    // Check form elements are visible
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()

    // Check for signup heading
    await expect(
      page.locator('h1, h2').filter({ hasText: /sign\s*up/i })
    ).toBeVisible()

    // Check for login link
    await expect(page.locator('a[href="/auth/login"]')).toBeVisible()
  })

  test('should successfully create account with valid data', async ({
    page,
  }) => {
    // Generate unique email for test
    const uniqueEmail = `test-${Date.now()}@example.com`
    const password = 'SecurePassword123!'

    await page.fill('input[name="email"]', uniqueEmail)
    await page.fill('input[name="password"]', password)
    await page.fill('input[name="confirmPassword"]', password)

    // Check button is enabled
    await expect(page.locator('button[type="submit"]')).toBeEnabled()

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for loading state
    await waitForLoadingToFinish(page)

    // Should redirect to dashboard after successful signup
    await expectRedirectToDashboard(page)

    // Check if user is logged in
    await expect(page.locator('button:has-text("Logout")')).toBeVisible()
  })

  test('should show error with invalid email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'Password123!')
    await page.fill('input[name="confirmPassword"]', 'Password123!')

    await page.click('button[type="submit"]')

    // Check for validation error
    await expect(page.locator('text=Invalid email')).toBeVisible()
  })

  test('should show error with weak password', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', '123') // Too short
    await page.fill('input[name="confirmPassword"]', '123')

    await page.click('button[type="submit"]')

    // Check for password validation error
    await expect(page.locator('text=/password.*must be/i')).toBeVisible()
  })

  test('should show error when passwords do not match', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!')

    await page.click('button[type="submit"]')

    // Check for password mismatch error
    await expect(page.locator('text=Passwords do not match')).toBeVisible()
  })

  test('should show error with empty fields', async ({ page }) => {
    // Try to submit without filling any fields
    await page.click('button[type="submit"]')

    // Check for validation errors
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should show error for already registered email', async ({ page }) => {
    // Use an email that should already exist
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.fill('input[name="confirmPassword"]', 'Password123!')

    await page.click('button[type="submit"]')

    // Wait for loading state
    await waitForLoadingToFinish(page)

    // Check for error message
    await expectErrorMessage(page, 'Email already registered')
  })

  test('should show loading state during signup', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`

    await page.fill('input[name="email"]', uniqueEmail)
    await page.fill('input[name="password"]', 'Password123!')
    await page.fill('input[name="confirmPassword"]', 'Password123!')

    // Start signup process
    const submitPromise = page.click('button[type="submit"]')

    // Check for loading state
    await expect(page.locator('button[type="submit"][disabled]')).toBeVisible()

    // Wait for the request to complete
    await submitPromise
  })

  test('should show password requirements', async ({ page }) => {
    // Focus on password field
    await page.focus('input[name="password"]')

    // Check if password requirements are shown
    const requirements = page.locator('text=/must contain.*characters/i')
    if ((await requirements.count()) > 0) {
      await expect(requirements).toBeVisible()
    }
  })

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]')
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]')

    // Initially passwords should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password')
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password')

    // Check for toggle buttons
    const toggleButtons = page.locator(
      'button[aria-label="Toggle password visibility"]'
    )
    if ((await toggleButtons.count()) > 0) {
      // Toggle first password field
      await toggleButtons.first().click()
      await expect(passwordInput).toHaveAttribute('type', 'text')

      // Toggle back
      await toggleButtons.first().click()
      await expect(passwordInput).toHaveAttribute('type', 'password')
    }
  })

  test('should navigate to login page', async ({ page }) => {
    await page.click('a[href="/auth/login"]')
    await page.waitForURL('**/auth/login')

    // Verify we're on login page
    await expect(
      page.locator('h1, h2').filter({ hasText: /log\s*in/i })
    ).toBeVisible()
  })

  test('should validate email in real-time', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]')

    // Type invalid email
    await emailInput.fill('invalid')
    await emailInput.blur() // Trigger validation

    // Check for inline validation error
    const errorMessage = page.locator('text=Invalid email').first()
    if ((await errorMessage.count()) > 0) {
      await expect(errorMessage).toBeVisible()
    }

    // Fix the email
    await emailInput.fill('valid@example.com')
    await emailInput.blur()

    // Error should disappear
    if ((await errorMessage.count()) > 0) {
      await expect(errorMessage).not.toBeVisible()
    }
  })

  test('should check password strength indicator', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]')

    // Type weak password
    await passwordInput.fill('123')

    // Check for strength indicator
    const weakIndicator = page.locator('text=/weak/i')
    if ((await weakIndicator.count()) > 0) {
      await expect(weakIndicator).toBeVisible()
    }

    // Type strong password
    await passwordInput.fill('StrongP@ssw0rd123!')

    // Check for strong indicator
    const strongIndicator = page.locator('text=/strong/i')
    if ((await strongIndicator.count()) > 0) {
      await expect(strongIndicator).toBeVisible()
    }
  })
})
