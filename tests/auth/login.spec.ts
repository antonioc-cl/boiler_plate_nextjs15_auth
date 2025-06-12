import { test, expect } from '@playwright/test'
import { expectErrorMessage, waitForLoadingToFinish } from '../helpers/auth'
import {
  expectRedirectToDashboard,
  waitForPageLoad,
} from '../helpers/navigation'

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
    await waitForPageLoad(page)
  })

  test('should display login form with all required fields', async ({
    page,
  }) => {
    // Check form elements are visible
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()

    // Check for login heading
    await expect(
      page.locator('h1, h2').filter({ hasText: /log\s*in/i })
    ).toBeVisible()

    // Check for signup link
    await expect(page.locator('a[href="/auth/signup"]')).toBeVisible()
  })

  test('should successfully login with valid credentials', async ({ page }) => {
    // Use a test user that should exist in your database
    const testEmail = 'test@example.com'
    const testPassword = 'password123'

    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)

    // Check button is enabled
    await expect(page.locator('button[type="submit"]')).toBeEnabled()

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for loading state
    await waitForLoadingToFinish(page)

    // Should redirect to dashboard
    await expectRedirectToDashboard(page)

    // Check if user is logged in (look for logout button or user menu)
    await expect(page.locator('button:has-text("Logout")')).toBeVisible()
  })

  test('should show error with invalid email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'password123')

    await page.click('button[type="submit"]')

    // Check for validation error
    await expect(page.locator('text=Invalid email')).toBeVisible()
  })

  test('should show error with empty fields', async ({ page }) => {
    // Try to submit without filling any fields
    await page.click('button[type="submit"]')

    // Check for validation errors
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should show error with wrong password', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')

    await page.click('button[type="submit"]')

    // Wait for loading state
    await waitForLoadingToFinish(page)

    // Check for error message
    await expectErrorMessage(page, 'Invalid email or password')
  })

  test('should show error for non-existent user', async ({ page }) => {
    await page.fill('input[name="email"]', 'nonexistent@example.com')
    await page.fill('input[name="password"]', 'password123')

    await page.click('button[type="submit"]')

    // Wait for loading state
    await waitForLoadingToFinish(page)

    // Check for error message
    await expectErrorMessage(page, 'Invalid email or password')
  })

  test('should show loading state during login', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')

    // Start login process
    const submitPromise = page.click('button[type="submit"]')

    // Check for loading state (button disabled or loading spinner)
    await expect(page.locator('button[type="submit"][disabled]')).toBeVisible()

    // Wait for the request to complete
    await submitPromise
  })

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]')

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password')

    // Click toggle button if it exists
    const toggleButton = page.locator(
      'button[aria-label="Toggle password visibility"]'
    )
    if ((await toggleButton.count()) > 0) {
      await toggleButton.click()
      await expect(passwordInput).toHaveAttribute('type', 'text')

      // Toggle back
      await toggleButton.click()
      await expect(passwordInput).toHaveAttribute('type', 'password')
    }
  })

  test('should navigate to signup page', async ({ page }) => {
    await page.click('a[href="/auth/signup"]')
    await page.waitForURL('**/auth/signup')

    // Verify we're on signup page
    await expect(
      page.locator('h1, h2').filter({ hasText: /sign\s*up/i })
    ).toBeVisible()
  })

  test('should redirect to login if already on protected route', async ({
    page,
  }) => {
    // Try to access a protected route directly
    await page.goto('/dashboard')

    // Should redirect to login
    await page.waitForURL('**/auth/login')

    // Check for redirect message if implemented
    const redirectMessage = page.locator('text=Please login to continue')
    if ((await redirectMessage.count()) > 0) {
      await expect(redirectMessage).toBeVisible()
    }
  })
})
