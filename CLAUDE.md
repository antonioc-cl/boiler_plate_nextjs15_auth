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
- Lucia Auth v3 for authentication
- Drizzle ORM + PostgreSQL (Neon)
- Plunk for transactional emails
- React Email for email templates
- Vitest + React Testing Library
- Playwright for E2E tests

## Key Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm test         # Run all tests
pnpm test:unit    # Run unit tests only
pnpm test:e2e     # Run E2E tests
pnpm lint         # Lint code
pnpm format       # Format with Prettier
pnpm type-check   # TypeScript check
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Run migrations
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

1. User signs up → Email verification sent
2. User verifies email → Can access protected routes
3. Password reset → Token sent via email
4. Session management → Lucia Auth handles cookies

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

- `/middleware.ts` - Route protection logic
- `/lib/auth/index.ts` - Auth configuration
- `/lib/db/index.ts` - Database connection
- `/lib/email/send-email.ts` - Email queue handler
