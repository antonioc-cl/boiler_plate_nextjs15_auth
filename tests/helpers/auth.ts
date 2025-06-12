import { Page } from '@playwright/test'

export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth/login')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')

  // Wait for navigation after successful login
  await page.waitForURL('/dashboard', { timeout: 5000 })
}

export async function signup(
  page: Page,
  email: string,
  password: string,
  confirmPassword?: string
) {
  await page.goto('/auth/signup')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.fill('input[name="confirmPassword"]', confirmPassword || password)
  await page.click('button[type="submit"]')

  // Wait for navigation after successful signup
  await page.waitForURL('/dashboard', { timeout: 5000 })
}

export async function logout(page: Page) {
  // Click on logout button - adjust selector based on your UI
  await page.click('button:has-text("Logout")')

  // Wait for redirect to login page
  await page.waitForURL('/auth/login', { timeout: 5000 })
}

export async function waitForLoadingToFinish(page: Page) {
  // Wait for any loading indicators to disappear
  await page
    .waitForSelector('[data-testid="loading-spinner"]', {
      state: 'hidden',
      timeout: 5000,
    })
    .catch(() => {})
  await page
    .waitForSelector('.loading', { state: 'hidden', timeout: 5000 })
    .catch(() => {})
}

export async function expectErrorMessage(page: Page, message: string) {
  // Wait for error message to appear
  await page.waitForSelector(`text=${message}`, { timeout: 5000 })
}
