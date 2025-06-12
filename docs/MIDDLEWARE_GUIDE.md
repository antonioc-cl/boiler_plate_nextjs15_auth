# Middleware and Authentication Guide

This guide explains how the authentication middleware works in this Next.js 15 application with Lucia Auth.

## Overview

The middleware system provides route protection at two levels:

1. **Edge Middleware** (`middleware.ts`) - Fast, preliminary checks based on session cookies
2. **Server Components** - Full session validation using Lucia Auth

## Middleware Configuration

### Protected Routes

Routes under `/(protected)/*` are automatically protected. Additionally, you can add specific routes to the `routeConfig` in `middleware.ts`:

```typescript
const routeConfig: RouteConfig = {
  protectedRoutes: ['/dashboard', '/profile', '/settings'],
  // ...
}
```

### Auth Routes

Routes under `/(auth)/*` (login, signup, etc.) redirect authenticated users to the dashboard:

```typescript
const routeConfig: RouteConfig = {
  // ...
  authRoutes: [
    '/login',
    '/signup',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
  // ...
}
```

## How It Works

### 1. Edge Middleware (`middleware.ts`)

The middleware runs on every request and:

- Checks for the presence of a session cookie
- Redirects unauthenticated users trying to access protected routes to `/login`
- Redirects authenticated users trying to access auth routes to `/dashboard`
- Preserves the intended destination as a `callbackUrl` parameter
- Validates callback URLs to prevent open redirects

### 2. Server Component Validation

In your server components, use the helper functions from `lib/auth/middleware-helpers.ts`:

#### For Protected Routes

```typescript
import { requireAuth } from '@/lib/auth/middleware-helpers'

export default async function ProtectedPage() {
  const { user } = await requireAuth() // Redirects if not authenticated

  return <div>Welcome, {user.email}!</div>
}
```

#### For Auth Routes

```typescript
import { requireGuest } from '@/lib/auth/middleware-helpers'

export default async function LoginPage() {
  await requireGuest() // Redirects to dashboard if authenticated

  return <LoginForm />
}
```

#### Optional Authentication

```typescript
import { getCurrentUser } from '@/lib/auth/middleware-helpers'

export default async function PublicPage() {
  const user = await getCurrentUser() // Returns null if not authenticated

  return (
    <div>
      {user ? `Welcome, ${user.email}!` : 'Please log in'}
    </div>
  )
}
```

## API Routes

The middleware automatically skips API routes. For API authentication, use the `validateRequest` function directly:

```typescript
import { validateRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const { user, session } = await validateRequest()

  if (!user || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Your API logic here
}
```

## Logout Flow

The logout flow consists of:

1. Client-side `LogoutButton` component that calls the logout API
2. `/api/auth/logout` route that invalidates the session
3. Automatic redirect to the login page

## Performance Considerations

1. **Edge Middleware** runs on every request but only checks cookie presence
2. **Full validation** only happens in server components that need it
3. Static assets and API routes are excluded from middleware checks
4. The middleware uses efficient pattern matching for route detection

## Security Features

1. **CSRF Protection**: Session cookies use `sameSite: 'lax'`
2. **Secure Cookies**: HTTPS-only in production
3. **Open Redirect Prevention**: Callback URLs are validated
4. **Session Management**: Proper session invalidation on logout

## Best Practices

1. Always use `requireAuth()` in protected server components
2. Use `requireGuest()` in auth-related pages
3. Handle loading states appropriately
4. Implement proper error boundaries
5. Add rate limiting to auth endpoints
6. Log authentication events for security monitoring

## Customization

To customize the middleware behavior:

1. Update route patterns in `middleware.ts`
2. Modify redirect URLs as needed
3. Add custom headers or logging
4. Implement additional security checks

Remember to test your changes thoroughly, especially around edge cases like expired sessions and concurrent requests.
