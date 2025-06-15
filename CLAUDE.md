# CLAUDE.md - Next.js 15 Auth Boilerplate

## General Rules

- Always use `pnpm` as package manager
- For complex tasks, break them down and use multiple subagents in parallel
- All code must be TypeScript strict mode - avoid `any`
- Use Server Actions for mutations, never direct API calls from client
- Follow Conventional Commits standard (feat:, fix:, refactor:, etc.)
- When searching for files/code, use multiple parallel searches to maximize efficiency

## Core Stack

- Next.js 15 (App Router)
- TypeScript (strict mode)
- Better Auth for authentication
- Drizzle ORM + PostgreSQL (Neon)
- Plunk for transactional emails
- React Email for email templates
- Vitest + React Testing Library
- Playwright for E2E tests
- OXC for fast linting (replaced ESLint)

## Key Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm test         # Run all tests (Vitest)
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Run tests with coverage
pnpm e2e          # Run E2E tests (Playwright)
pnpm lint         # Lint code with OXC (fast!)
pnpm lint:fix     # Auto-fix linting issues
pnpm format       # Format with Prettier
pnpm type-check   # TypeScript check
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
pnpm email:dev    # Preview email templates
```

## Architecture Rules

1. **Server Actions** for all mutations (in `/lib/actions/`)
2. **Route protection** via middleware.ts
3. **Email rate limiting** implemented in `/lib/rate-limit.ts`
4. **Type-safe routes** via TypeScript typed routes
5. **Secure sessions** with httpOnly cookies

## Testing Strategy

- Unit tests for utilities and server actions
- Component tests for UI components
- E2E tests for critical user flows (auth, protected routes)
- Always write tests BEFORE implementation

## Authentication Flow

1. User signs up → Email verification sent via Better Auth
2. User verifies email → Account activated, can access protected routes
3. Password reset → Magic link sent via email
4. Session management → Better Auth handles secure sessions with JWT
5. OAuth support → Social login providers ready (Google, GitHub, etc.)
6. Two-factor authentication → Optional 2FA via TOTP

## Directory Structure

```
/app/
  /(auth)/          # Public auth pages
  /(protected)/     # Protected pages (require auth)
  /api/             # API routes
/components/
  /ui/              # shadcn/ui components
  /auth/            # Auth-specific components
/lib/
  /actions/         # Server actions
  /db/              # Database schema & config
  /auth/            # Auth utilities
  /email/           # Email templates & sending
/emails/            # React Email templates
```

## Common Tasks

### Add a new protected page

1. Create page in `/app/(protected)/new-page/page.tsx`
2. Middleware automatically protects it

### Add a new email template

1. Create template in `/emails/new-email.tsx`
2. Add sending function in `/lib/email/auth-emails.ts`
3. Use rate limiter if needed

### Add a new database table

1. Define schema in `/lib/db/schema/`
2. Run `pnpm db:generate` then `pnpm db:migrate`
3. Export from `/lib/db/schema/index.ts`

## Environment Variables

See `.env.example` for required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `PLUNK_API_KEY` - Email service key
- `NEXT_PUBLIC_APP_URL` - Application URL

## Important Files

- `/middleware.ts` - Route protection logic using Better Auth
- `/lib/auth/index.ts` - Better Auth server configuration
- `/lib/auth/client.ts` - Better Auth client setup
- `/lib/db/index.ts` - Database connection
- `/lib/email/send-email.ts` - Email queue handler
- `/app/api/auth/[...all]/route.ts` - Better Auth API handler

## Migration Notes (from Lucia Auth)

### Key Changes

1. **Authentication Library**: Migrated from Lucia Auth v3 to Better Auth

   - Better Auth provides more features out of the box (OAuth, 2FA, magic links)
   - Simpler API with better TypeScript support
   - Built-in session management with JWT

2. **Linting**: Replaced ESLint with OXC

   - Much faster linting (50-100x faster)
   - Drop-in replacement with similar rules
   - Same commands (pnpm lint, pnpm lint:fix)

3. **Database Schema**: Updated auth tables
   - New schema follows Better Auth conventions
   - Run `pnpm db:migrate` to apply migrations
   - Old Lucia tables can be dropped after migration

### Breaking Changes

- Auth hooks changed: `useAuth()` instead of `useSession()`
- Server-side auth: `auth()` helper from Better Auth
- Protected routes now use Better Auth middleware
- Email verification flow updated to use Better Auth's built-in system

### Migration Steps

1. Update environment variables (see `.env.example`)
2. Run database migration: `pnpm db:migrate`
3. Update auth imports in your code
4. Test auth flows thoroughly
