import { redirect } from 'next/navigation'
import { SignupForm } from '@/components/auth/signup-form'
import { signupAction } from '@/app/actions/auth'

export default function SignupPage() {
  async function handleSignup(values: { email: string; password: string }) {
    'use server'

    try {
      await signupAction(values.email, values.password)
      redirect('/dashboard') // Redirect to dashboard or home page after successful signup
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Get started with our platform today
          </p>
        </div>
        <SignupForm onSubmit={handleSignup} />
      </div>
    </div>
  )
}
