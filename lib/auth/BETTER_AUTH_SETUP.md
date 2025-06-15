# Better Auth Configuration

This directory contains the Better Auth setup for the application, configured to work with Drizzle ORM and PostgreSQL.

## Configuration Files

### Core Files

- **`better-auth.ts`** - Main Better Auth configuration with Drizzle adapter
- **`client.ts`** - Client-side auth hooks and functions
- **`server.ts`** - Server-side auth utilities (getSession, requireAuth, etc.)
- **`types.ts`** - TypeScript type definitions
- **`email.ts`** - Email sending configuration for auth flows
- **`migration-helpers.ts`** - Helpers for migrating from Lucia Auth

### API Route

- **`/app/api/auth/[...all]/route.ts`** - Better Auth API endpoint handler

## Features Configured

1. **Email/Password Authentication**

   - Minimum password length: 8 characters
   - Maximum password length: 128 characters
   - Email verification support (configurable via `EMAIL_VERIFICATION_REQUIRED`)

2. **Session Management**

   - 30-day session expiration
   - Automatic session refresh after 1 day
   - Secure httpOnly cookies
   - SameSite=lax for CSRF protection

3. **Security Features**

   - Rate limiting (10 requests per minute)
   - Secure cookies in production
   - CSRF protection
   - Trusted origins configuration

4. **Database Integration**
   - Uses existing Drizzle schema
   - PostgreSQL via Neon
   - UUID generation handled by database

## Environment Variables

Required environment variables (already in `.env.example`):

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
EMAIL_VERIFICATION_REQUIRED="true"
```

## Usage Examples

### Client-Side (React Components)

```tsx
import { useSession, signIn, signOut } from '@/lib/auth/client'

function MyComponent() {
  const { data: session, isPending } = useSession()

  if (isPending) return <div>Loading...</div>

  if (!session) {
    return (
      <button
        onClick={() =>
          signIn.email({
            email: 'user@example.com',
            password: 'password123',
          })
        }
      >
        Sign In
      </button>
    )
  }

  return (
    <div>
      <p>Welcome, {session.user.email}!</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}
```

### Server-Side (Server Components/Actions)

```tsx
import { getSession, requireAuth } from '@/lib/auth/server'

// In a Server Component
export default async function ProtectedPage() {
  const session = await requireAuth() // Redirects if not authenticated

  return <div>Welcome, {session.user.email}!</div>
}

// In a Server Action
export async function myServerAction() {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  // Perform authenticated action
}
```

## Migration from Lucia

The `migration-helpers.ts` file provides compatibility functions:

```tsx
import { validateRequest } from '@/lib/auth/migration-helpers'

// This works like the old Lucia validateRequest
const { user, session } = await validateRequest()
```

## Custom User Fields

The configuration includes custom fields:

- `username` (optional, unique)
- `emailVerified` (boolean)
- `emailVerifiedAt` (timestamp)

These fields are automatically included in the session user object.
