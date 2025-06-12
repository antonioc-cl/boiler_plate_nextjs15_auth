'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
        <p className="mb-6 text-muted-foreground">
          We apologize for the inconvenience. The error has been reported and
          we&apos;ll look into it.
        </p>
        <div className="flex flex-col gap-4">
          <Button onClick={reset}>Try again</Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
          >
            Go to homepage
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Error details (development only)
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-muted p-4 text-xs">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
