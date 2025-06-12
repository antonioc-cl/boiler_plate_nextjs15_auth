import * as Sentry from '@sentry/nextjs'

// Only initialize Sentry if DSN is provided
const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
if (dsn) {
  Sentry.init({
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
