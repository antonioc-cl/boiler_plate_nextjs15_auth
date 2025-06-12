/**
 * Simple in-memory rate limiter for email sending
 * In production, consider using Redis for distributed rate limiting
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(windowMs: number = 60000, maxRequests: number = 5) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  /**
   * Check if a request is allowed and update the rate limit
   * @param identifier - Unique identifier (e.g., email, IP address)
   * @returns true if request is allowed, false if rate limited
   */
  check(identifier: string): boolean {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      this.cleanup()
    }

    if (!entry || now > entry.resetTime) {
      // No entry or expired, create new one
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      })
      return true
    }

    if (entry.count >= this.maxRequests) {
      // Rate limit exceeded
      return false
    }

    // Increment count
    entry.count++
    return true
  }

  /**
   * Get remaining requests for an identifier
   */
  getRemaining(identifier: string): number {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    if (!entry || now > entry.resetTime) {
      return this.maxRequests
    }

    return Math.max(0, this.maxRequests - entry.count)
  }

  /**
   * Get reset time for an identifier
   */
  getResetTime(identifier: string): number | null {
    const entry = this.limits.get(identifier)

    if (!entry || Date.now() > entry.resetTime) {
      return null
    }

    return entry.resetTime
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key)
      }
    }
  }

  /**
   * Reset rate limit for an identifier
   */
  reset(identifier: string): void {
    this.limits.delete(identifier)
  }
}

// Create rate limiters for different purposes
export const emailRateLimiter = new RateLimiter(
  60 * 60 * 1000, // 1 hour window
  5 // 5 emails per hour
)

export const passwordResetRateLimiter = new RateLimiter(
  60 * 60 * 1000, // 1 hour window
  3 // 3 reset attempts per hour
)

export const verificationEmailRateLimiter = new RateLimiter(
  5 * 60 * 1000, // 5 minute window
  2 // 2 verification emails per 5 minutes
)

/**
 * Rate limit error class
 */
export class RateLimitError extends Error {
  public readonly retryAfter: number

  constructor(message: string, retryAfter: number) {
    super(message)
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
  }
}

/**
 * Check rate limit and throw error if exceeded
 */
export function checkRateLimit(
  limiter: RateLimiter,
  identifier: string,
  errorMessage: string = 'Too many requests. Please try again later.'
): void {
  if (!limiter.check(identifier)) {
    const resetTime = limiter.getResetTime(identifier)
    const retryAfter = resetTime
      ? Math.ceil((resetTime - Date.now()) / 1000)
      : 60

    throw new RateLimitError(errorMessage, retryAfter)
  }
}

/**
 * Get rate limit info for response headers
 */
export function getRateLimitHeaders(
  limiter: RateLimiter,
  identifier: string
): Record<string, string> {
  const remaining = limiter.getRemaining(identifier)
  const resetTime = limiter.getResetTime(identifier)

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': limiter['maxRequests'].toString(),
    'X-RateLimit-Remaining': remaining.toString(),
  }

  if (resetTime) {
    headers['X-RateLimit-Reset'] = Math.ceil(resetTime / 1000).toString()
  }

  return headers
}
