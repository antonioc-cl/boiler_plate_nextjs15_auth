// Example usage of auth server actions in components
// This file is for reference only - not meant to be imported

'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { signup, logout, loginAndRedirect } from './auth'

// Example 1: Signup Form Component
export function SignupForm() {
  const [state, formAction] = useFormState(signup, null)

  return (
    <form action={formAction}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <input type="text" name="username" placeholder="Username (optional)" />
      <SubmitButton />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      {state?.success && <p className="text-green-500">{state.message}</p>}
    </form>
  )
}

// Example 2: Login Form Component with redirect
export function LoginForm() {
  const [state, formAction] = useFormState(loginAndRedirect, null)

  return (
    <form action={formAction}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <SubmitButton />
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  )
}

// Example 3: Logout Button
export function LogoutButton() {
  async function handleLogout() {
    await logout()
  }

  return (
    <form action={handleLogout}>
      <button type="submit">Logout</button>
    </form>
  )
}

// Example 4: Submit Button with loading state
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Loading...' : 'Submit'}
    </button>
  )
}
