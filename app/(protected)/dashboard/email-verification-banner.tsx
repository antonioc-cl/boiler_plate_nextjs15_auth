'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { resendVerificationEmail } from '@/lib/actions/auth-email'

function ResendButton() {
  const { pending } = useFormStatus()

  return (
    <Button size="sm" variant="outline" disabled={pending}>
      {pending ? 'Sending...' : 'Resend Email'}
    </Button>
  )
}

export function EmailVerificationBanner() {
  const [state, formAction] = useFormState(resendVerificationEmail, null)
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) {
    return null
  }

  return (
    <div className="mb-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
            Email Verification Required
          </h3>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            Please verify your email address to access all features. Check your
            inbox for a verification link.
          </p>

          {state?.error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {state.error}
              {state.retryAfter && ` Try again in ${state.retryAfter} seconds.`}
            </p>
          )}

          {state?.success && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              {state.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <form action={formAction}>
            <ResendButton />
          </form>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDismissed(true)}
            className="text-yellow-700 hover:text-yellow-800 dark:text-yellow-300 dark:hover:text-yellow-200"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  )
}
