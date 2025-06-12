'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
import { resetPassword } from '@/lib/actions/auth-email'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Resetting...' : 'Reset Password'}
    </Button>
  )
}

async function resetPasswordAction(
  _prevState: FormActionState,
  formData: FormData
) {
  const token = formData.get('token') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return {
      success: false,
      error: 'Passwords do not match',
    }
  }

  return resetPassword(token, password)
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [state, formAction] = useFormState(
    resetPasswordAction,
    null as FormActionState
  )
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (!token) {
      router.push(`/forgot-password` as AuthRoute)
    }
  }, [token, router])

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        router.push(`/login` as AuthRoute)
      }, 3000)
    }
  }, [state?.success, router])

  if (!token) {
    return null
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <input type="hidden" name="token" value={token} />
          <CardContent className="space-y-4">
            {state?.error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                {state.error}
              </div>
            )}
            {state?.success && (
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                {state.message}
                <p className="mt-1 text-xs">Redirecting to login...</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter new password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={state?.success}
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with uppercase, lowercase, and
                numbers
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
