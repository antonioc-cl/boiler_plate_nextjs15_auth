import { Page } from '@playwright/test'

export async function navigateToProtectedRoute(page: Page, route: string) {
  await page.goto(route)

  // Check if we were redirected to login
  const currentUrl = page.url()
  return !currentUrl.includes('/auth/login')
}

export async function expectRedirectToLogin(page: Page) {
  await page.waitForURL('**/auth/login', { timeout: 5000 })
}

export async function expectRedirectToDashboard(page: Page) {
  await page.waitForURL('**/dashboard', { timeout: 5000 })
}

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle')
}
