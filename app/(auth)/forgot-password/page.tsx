'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import type { AuthRoute } from '@/types/routes'
import type { FormActionState } from '@/types/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { requestPasswordReset } from '@/lib/actions/auth-email'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Sending...' : 'Send Reset Link'}
    </Button>
  )
}

async function requestPasswordResetAction(
  _prevState: FormActionState,
  formData: FormData
) {
  const email = formData.get('email') as string
  return requestPasswordReset(email)
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(
    requestPasswordResetAction,
    null as FormActionState
  )
  const [email, setEmail] = useState('')

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {state?.error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                {state.error}
                {state.retryAfter && (
                  <p className="mt-1 text-xs">
                    Please try again in{' '}
                    {typeof state.retryAfter === 'number'
                      ? state.retryAfter
                      : Math.ceil(
                          (state.retryAfter.getTime() - Date.now()) / 1000
                        )}{' '}
                    seconds.
                  </p>
                )}
              </div>
            )}
            {state?.success && (
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                {state.message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={state?.success}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {!state?.success && <SubmitButton />}

            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link
                href={`/login` as AuthRoute}
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
