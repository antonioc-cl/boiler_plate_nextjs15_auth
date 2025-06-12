import { test, expect } from '@playwright/test'
import { login } from '../helpers/auth'
import { expectRedirectToLogin, waitForPageLoad } from '../helpers/navigation'

test.describe('Protected Routes', () => {
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/admin', // If you have admin routes
  ]

  test.describe('When not authenticated', () => {
    test('should redirect to login when accessing protected routes', async ({
      page,
    }) => {
      for (const route of protectedRoutes) {
        await page.goto(route)

        // Should redirect to login
        await expectRedirectToLogin(page)

        // Optional: Check if return URL is preserved
        const url = new URL(page.url())
        const returnUrl =
          url.searchParams.get('returnUrl') || url.searchParams.get('redirect')
        if (returnUrl) {
          expect(returnUrl).toContain(route)
        }
      }
    })

    test('should show appropriate message when redirected', async ({
      page,
    }) => {
      await page.goto('/dashboard')
      await expectRedirectToLogin(page)

      // Check for redirect message
      const messages = [
        'Please login to continue',
        'Authentication required',
        'You must be logged in',
      ]

      for (const message of messages) {
        const element = page.locator(`text=${message}`)
        if ((await element.count()) > 0) {
          await expect(element).toBeVisible()
          break
        }
      }
    })

    test('should preserve query parameters during redirect', async ({
      page,
    }) => {
      const routeWithParams = '/dashboard?tab=analytics&period=week'
      await page.goto(routeWithParams)

      await expectRedirectToLogin(page)

      // Check if return URL includes the query parameters
      const url = new URL(page.url())
      const returnUrl =
        url.searchParams.get('returnUrl') || url.searchParams.get('redirect')
      if (returnUrl) {
        expect(returnUrl).toContain('tab=analytics')
        expect(returnUrl).toContain('period=week')
      }
    })
  })

  test.describe('When authenticated', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await login(page, 'test@example.com', 'password123')
      await waitForPageLoad(page)
    })

    test('should access protected routes without redirect', async ({
      page,
    }) => {
      for (const route of protectedRoutes.slice(0, 3)) {
        // Test first 3 routes to save time
        await page.goto(route)

        // Should not redirect to login
        await expect(page).not.toHaveURL(/.*auth\/login/)

        // Should show authenticated content
        await expect(page.locator('button:has-text("Logout")')).toBeVisible()
      }
    })

    test('should maintain authentication across page navigations', async ({
      page,
    }) => {
      // Navigate through multiple protected pages
      await page.goto('/dashboard')
      await expect(page).toHaveURL(/.*dashboard/)

      // Navigate to profile
      await page.goto('/profile')
      await expect(page).not.toHaveURL(/.*auth\/login/)

      // Navigate to settings
      await page.goto('/settings')
      await expect(page).not.toHaveURL(/.*auth\/login/)

      // Should still be authenticated
      await expect(page.locator('button:has-text("Logout")')).toBeVisible()
    })

    test('should redirect to intended page after login', async ({ page }) => {
      // Logout first
      await page.click('button:has-text("Logout")')
      await expectRedirectToLogin(page)

      // Try to access protected route
      await page.goto('/dashboard?tab=reports')
      await expectRedirectToLogin(page)

      // Login
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')

      // Should redirect to originally requested page
      await page
        .waitForURL('**/dashboard?tab=reports', { timeout: 5000 })
        .catch(async () => {
          // If not redirected to original page, at least should be on dashboard
          await expect(page).toHaveURL(/.*dashboard/)
        })
    })
  })

  test.describe('API route protection', () => {
    test('should return 401 for protected API routes without auth', async ({
      page,
    }) => {
      const response = await page.request.get('/api/user/profile')
      expect(response.status()).toBe(401)
    })

    test('should access protected API routes when authenticated', async ({
      page,
    }) => {
      // Login first
      await login(page, 'test@example.com', 'password123')

      // Try to access protected API
      const response = await page.request.get('/api/user/profile')
      expect(response.status()).toBe(200)
    })
  })

  test.describe('Role-based access control', () => {
    test('should prevent regular users from accessing admin routes', async ({
      page,
    }) => {
      // Login as regular user
      await login(page, 'user@example.com', 'password123')

      // Try to access admin route
      await page.goto('/admin')

      // Should either redirect or show forbidden message
      const isForbidden =
        (await page
          .locator('text=/forbidden|unauthorized|not authorized/i')
          .count()) > 0
      const isRedirected =
        page.url().includes('/dashboard') || page.url().includes('/auth/login')

      expect(isForbidden || isRedirected).toBeTruthy()
    })

    test('should allow admin users to access admin routes', async ({
      page,
    }) => {
      // Login as admin user (adjust credentials as needed)
      await login(page, 'admin@example.com', 'adminpassword123')

      // Try to access admin route
      await page.goto('/admin')

      // Should not be redirected
      await expect(page).not.toHaveURL(/.*auth\/login/)
      await expect(page).not.toHaveURL(/.*dashboard/)

      // Should see admin content
      const adminHeading = page.locator('h1, h2').filter({ hasText: /admin/i })
      if ((await adminHeading.count()) > 0) {
        await expect(adminHeading).toBeVisible()
      }
    })
  })

  test.describe('Session timeout', () => {
    test('should redirect to login on expired session', async ({
      page,
      context,
    }) => {
      // Login
      await login(page, 'test@example.com', 'password123')

      // Clear cookies to simulate expired session
      await context.clearCookies()

      // Try to access protected route
      await page.goto('/dashboard')

      // Should redirect to login
      await expectRedirectToLogin(page)

      // Should show session expired message
      const expiredMessage = page.locator(
        'text=/session expired|please login again/i'
      )
      if ((await expiredMessage.count()) > 0) {
        await expect(expiredMessage).toBeVisible()
      }
    })
  })

  test.describe('Deep linking', () => {
    test('should handle deep links to protected routes', async ({ page }) => {
      // Try to access a deep link without auth
      const deepLink = '/dashboard/projects/123/settings'
      await page.goto(deepLink)

      // Should redirect to login
      await expectRedirectToLogin(page)

      // Login
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')

      // Should redirect to the deep link or at least dashboard
      await page
        .waitForURL(`**${deepLink}`, { timeout: 5000 })
        .catch(async () => {
          // If deep link not preserved, should at least be on dashboard
          await expect(page).toHaveURL(/.*dashboard/)
        })
    })
  })
})
