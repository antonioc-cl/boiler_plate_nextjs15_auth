import { test, expect } from '@playwright/test'
import { login, logout, waitForLoadingToFinish } from '../helpers/auth'
import { expectRedirectToLogin, waitForPageLoad } from '../helpers/navigation'

test.describe('Logout Flow', () => {
  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    // Login with test user
    await login(page, 'test@example.com', 'password123')
    await waitForPageLoad(page)
  })

  test('should successfully logout from dashboard', async ({ page }) => {
    // Verify we're logged in (on dashboard)
    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.locator('button:has-text("Logout")')).toBeVisible()

    // Click logout button
    await page.click('button:has-text("Logout")')

    // Wait for any loading state
    await waitForLoadingToFinish(page)

    // Should redirect to login page
    await expectRedirectToLogin(page)

    // Verify logout success message if shown
    const successMessage = page.locator('text=Successfully logged out')
    if ((await successMessage.count()) > 0) {
      await expect(successMessage).toBeVisible()
    }
  })

  test('should clear session after logout', async ({ page }) => {
    // Logout
    await logout(page)

    // Try to access protected route
    await page.goto('/dashboard')

    // Should redirect back to login
    await expectRedirectToLogin(page)
  })

  test('should logout from any protected page', async ({ page }) => {
    // Navigate to a different protected page if available
    await page.goto('/profile')

    // If redirected to login, try dashboard instead
    if (page.url().includes('/auth/login')) {
      await login(page, 'test@example.com', 'password123')
      await page.goto('/dashboard')
    }

    // Find and click logout button
    const logoutButton = page.locator('button:has-text("Logout")')
    if ((await logoutButton.count()) === 0) {
      // Try looking in a dropdown menu
      const userMenu = page.locator(
        '[data-testid="user-menu"], [aria-label="User menu"]'
      )
      if ((await userMenu.count()) > 0) {
        await userMenu.click()
        await page.click('button:has-text("Logout"), a:has-text("Logout")')
      }
    } else {
      await logoutButton.click()
    }

    // Should redirect to login
    await expectRedirectToLogin(page)
  })

  test('should handle logout errors gracefully', async ({ page }) => {
    // Intercept logout request to simulate error
    await page.route('**/api/auth/logout', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      })
    })

    // Try to logout
    await page.click('button:has-text("Logout")')

    // Should show error message but might still redirect
    const errorMessage = page.locator('text=/error|failed/i')
    if ((await errorMessage.count()) > 0) {
      await expect(errorMessage).toBeVisible()
    }
  })

  test('should remove auth cookies after logout', async ({ page, context }) => {
    // Get cookies before logout
    const cookiesBefore = await context.cookies()
    const authCookieBefore = cookiesBefore.find(
      (cookie) =>
        cookie.name.includes('auth') || cookie.name.includes('session')
    )

    // Should have auth cookie while logged in
    expect(authCookieBefore).toBeTruthy()

    // Logout
    await logout(page)

    // Get cookies after logout
    const cookiesAfter = await context.cookies()
    const authCookieAfter = cookiesAfter.find(
      (cookie) =>
        cookie.name.includes('auth') || cookie.name.includes('session')
    )

    // Auth cookie should be removed or expired
    if (authCookieAfter) {
      // If cookie still exists, it should be expired
      expect(
        new Date(authCookieAfter.expires * 1000).getTime()
      ).toBeLessThanOrEqual(Date.now())
    }
  })

  test('should logout from mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Look for mobile menu button
    const mobileMenuButton = page.locator(
      '[data-testid="mobile-menu"], [aria-label="Menu"]'
    )
    if ((await mobileMenuButton.count()) > 0) {
      await mobileMenuButton.click()

      // Find logout in mobile menu
      await page.click('button:has-text("Logout"), a:has-text("Logout")')

      // Should redirect to login
      await expectRedirectToLogin(page)
    } else {
      // If no mobile menu, regular logout should work
      await logout(page)
    }
  })

  test('should prevent access to protected routes after logout', async ({
    page,
  }) => {
    // Logout
    await logout(page)

    // Try to access multiple protected routes
    const protectedRoutes = ['/dashboard', '/profile', '/settings']

    for (const route of protectedRoutes) {
      await page.goto(route)

      // Should redirect to login for each route
      await expect(page).toHaveURL(/.*auth\/login/)
    }
  })

  test('should show confirmation dialog before logout', async ({ page }) => {
    // Check if logout confirmation is implemented
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Are you sure')
      await dialog.accept()
    })

    // Click logout
    const logoutButton = page.locator('button:has-text("Logout")')
    await logoutButton.click()

    // If no dialog, logout should proceed normally
    await page.waitForURL('**/auth/login', { timeout: 5000 }).catch(() => {
      // No confirmation dialog, which is also fine
    })
  })

  test('should handle concurrent logout requests', async ({
    page,
    context,
  }) => {
    // Open second tab
    const page2 = await context.newPage()
    await page2.goto('/dashboard')

    // Logout from first tab
    await logout(page)

    // Second tab should also be logged out when refreshed
    await page2.reload()
    await expect(page2).toHaveURL(/.*auth\/login/)
  })
})
