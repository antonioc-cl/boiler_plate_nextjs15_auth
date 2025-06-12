import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'
import type { MockNextRouter } from '@/types/test'

// Add any providers your app needs here
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Utility function to create mock Next.js router
export const createMockRouter = (
  router: Partial<MockNextRouter> = {}
): MockNextRouter => ({
  basePath: '',
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  push: vi.fn(() => Promise.resolve(true)),
  replace: vi.fn(() => Promise.resolve(true)),
  reload: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(() => Promise.resolve()),
  beforePopState: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
  ...router,
})
