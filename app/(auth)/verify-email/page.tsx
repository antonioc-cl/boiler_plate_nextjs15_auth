'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import type { AuthRoute } from '@/types/routes'
import type { FormActionState } from '@/types/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { verifyEmail, resendVerificationEmail } from '@/lib/actions/auth-email'

function ResendButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant="outline"
      className="w-full"
      disabled={pending}
    >
      {pending ? 'Sending...' : 'Resend Verification Email'}
    </Button>
  )
}

async function verifyEmailAction(
  _prevState: FormActionState,
  formData: FormData
) {
  const token = formData.get('token') as string
  return verifyEmail(token)
}

async function resendEmailAction(
  _prevState: FormActionState,
  _formData: FormData
) {
  return resendVerificationEmail()
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [verifyState, verifyFormAction] = useFormState(
    verifyEmailAction,
    null as FormActionState
  )
  const [resendState, resendFormAction] = useFormState(
    resendEmailAction,
    null as FormActionState
  )
  const [isVerifying, setIsVerifying] = useState(false)

  // Auto-verify if token is present
  useEffect(() => {
    if (token && !isVerifying && !verifyState) {
      setIsVerifying(true)
      const form = document.getElementById('verify-form') as HTMLFormElement
      if (form) {
        form.requestSubmit()
      }
    }
  }, [token, isVerifying, verifyState])

  // Redirect after successful verification
  useEffect(() => {
    if (verifyState?.success) {
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    }
  }, [verifyState?.success, router])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Email Verification
          </CardTitle>
          <CardDescription>
            {token
              ? 'Verifying your email address...'
              : 'Check your email for verification link'}
          </CardDescription>
        </CardHeader>

        {token ? (
          <form id="verify-form" action={verifyFormAction}>
            <input type="hidden" name="token" value={token} />
            <CardContent className="space-y-4">
              {verifyState?.error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                  {verifyState.error}
                </div>
              )}
              {verifyState?.success && (
                <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                  {verifyState.message}
                  <p className="mt-1 text-xs">Redirecting to dashboard...</p>
                </div>
              )}

              {!verifyState && (
                <div className="flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              )}
            </CardContent>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              We&apos;ve sent a verification link to your email address. Please
              check your inbox and click the link to verify your account.
            </div>

            {resendState?.error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                {resendState.error}
                {resendState.retryAfter && (
                  <p className="mt-1 text-xs">
                    Please try again in{' '}
                    {typeof resendState.retryAfter === 'number'
                      ? resendState.retryAfter
                      : Math.ceil(
                          (resendState.retryAfter.getTime() - Date.now()) / 1000
                        )}{' '}
                    seconds.
                  </p>
                )}
              </div>
            )}
            {resendState?.success && (
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                {resendState.message}
              </div>
            )}
          </CardContent>
        )}

        <CardFooter className="flex flex-col space-y-4">
          {!token && !resendState?.success && (
            <form action={resendFormAction} className="w-full">
              <ResendButton />
            </form>
          )}

          <div className="text-center text-sm text-muted-foreground">
            {verifyState?.error && token ? (
              <>
                Need a new verification link?{' '}
                <Link
                  href={`/verify-email` as AuthRoute}
                  className="text-primary hover:underline"
                >
                  Request new link
                </Link>
              </>
            ) : (
              <>
                Already verified?{' '}
                <Link
                  href="/dashboard"
                  className="text-primary hover:underline"
                >
                  Go to dashboard
                </Link>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
