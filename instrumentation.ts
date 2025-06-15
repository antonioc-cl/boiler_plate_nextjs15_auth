export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side initialization
    const { init } = await import('@sentry/nextjs')

    const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
    if (dsn) {
      init({
        dsn,

        // Performance Monitoring
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

        // Release tracking
        environment: process.env.NODE_ENV,

        // Before send hook to filter out sensitive data
        beforeSend(event, hint) {
          // Filter out events in development unless explicitly enabled
          if (
            process.env.NODE_ENV === 'development' &&
            !process.env.SENTRY_ENABLE_IN_DEV
          ) {
            return null
          }

          // Don't send events for certain errors
          const error = hint.originalException
          if (error && error instanceof Error) {
            // Skip authentication errors
            if (error.message?.includes('Invalid email or password')) {
              return null
            }
          }

          return event
        },
      })
    }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime initialization
    const { init } = await import('@sentry/nextjs')

    const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
    if (dsn) {
      init({
        dsn,

        // Performance Monitoring
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

        // Release tracking
        environment: process.env.NODE_ENV,

        // Before send hook to filter out sensitive data
        beforeSend(event, _hint) {
          // Filter out events in development unless explicitly enabled
          if (
            process.env.NODE_ENV === 'development' &&
            !process.env.SENTRY_ENABLE_IN_DEV
          ) {
            return null
          }

          return event
        },
      })
    }
  }
}

// Export the required error handler for nested React Server Components
export const onRequestError = async (
  error: unknown,
  request: Request,
  context?: { routerKind?: string; routePath?: string }
) => {
  const { captureException } = await import('@sentry/nextjs')
  captureException(error, {
    tags: {
      source: 'onRequestError',
      url: request.url,
    },
    extra: {
      request: {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
      },
      context,
    },
  })
}
