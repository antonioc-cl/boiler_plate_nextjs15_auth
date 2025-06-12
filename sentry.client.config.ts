import * as Sentry from '@sentry/nextjs'

// Only initialize Sentry if DSN is provided
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Release tracking
    environment: process.env.NODE_ENV,

    // Integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Before send hook to filter out sensitive data
    beforeSend(event, _hint) {
      // Filter out events in development unless explicitly enabled
      if (
        process.env.NODE_ENV === 'development' &&
        !process.env.NEXT_PUBLIC_SENTRY_ENABLE_IN_DEV
      ) {
        return null
      }

      // You can add custom logic here to filter or modify events
      return event
    },
  })
}
