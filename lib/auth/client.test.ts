import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createAuthClient } from 'better-auth/react'

// Mock the better-auth/react module
vi.mock('better-auth/react', () => ({
  createAuthClient: vi.fn().mockReturnValue({
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    useSession: vi.fn(),
    forgetPassword: vi.fn(),
    resetPassword: vi.fn(),
    verifyEmail: vi.fn(),
  }),
}))

describe('auth/client', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset module cache to test different environment configurations
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should create auth client with custom app URL', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://myapp.com'
    
    // Dynamic import to get fresh module instance
    const { authClient } = await import('./client')

    expect(createAuthClient).toHaveBeenCalledWith({
      baseURL: 'https://myapp.com',
    })

    expect(authClient).toBeDefined()
    expect(authClient.signIn).toBeDefined()
    expect(authClient.signUp).toBeDefined()
    expect(authClient.signOut).toBeDefined()
    expect(authClient.useSession).toBeDefined()
    expect(authClient.forgetPassword).toBeDefined()
    expect(authClient.resetPassword).toBeDefined()
    expect(authClient.verifyEmail).toBeDefined()
  })

  it('should create auth client with default URL when env var is not set', async () => {
    delete process.env.NEXT_PUBLIC_APP_URL
    
    // Dynamic import to get fresh module instance
    const { authClient } = await import('./client')

    expect(createAuthClient).toHaveBeenCalledWith({
      baseURL: 'http://localhost:3000',
    })

    expect(authClient).toBeDefined()
  })

  it('should export all auth methods', async () => {
    const { 
      signIn,
      signUp,
      signOut,
      useSession,
      forgetPassword,
      resetPassword,
      verifyEmail
    } = await import('./client')

    expect(signIn).toBeDefined()
    expect(signUp).toBeDefined()
    expect(signOut).toBeDefined()
    expect(useSession).toBeDefined()
    expect(forgetPassword).toBeDefined()
    expect(resetPassword).toBeDefined()
    expect(verifyEmail).toBeDefined()
  })
})