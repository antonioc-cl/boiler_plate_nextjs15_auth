# Next.js 15 Production Boilerplate

[![CI](https://github.com/antonioc-cl/boiler_plate_nextjs15_auth/actions/workflows/ci.yml/badge.svg)](https://github.com/antonioc-cl/boiler_plate_nextjs15_auth/actions/workflows/ci.yml)
[![Deploy to Vercel](https://github.com/antonioc-cl/boiler_plate_nextjs15_auth/actions/workflows/deploy.yml/badge.svg)](https://github.com/antonioc-cl/boiler_plate_nextjs15_auth/actions/workflows/deploy.yml)
[![Security Audit](https://github.com/antonioc-cl/boiler_plate_nextjs15_auth/actions/workflows/security-audit.yml/badge.svg)](https://github.com/antonioc-cl/boiler_plate_nextjs15_auth/actions/workflows/security-audit.yml)
[![Dependency Update](https://github.com/antonioc-cl/boiler_plate_nextjs15_auth/actions/workflows/dependency-update.yml/badge.svg)](https://github.com/antonioc-cl/boiler_plate_nextjs15_auth/actions/workflows/dependency-update.yml)

A production-ready Next.js 15 boilerplate with TypeScript, authentication structure, and best practices.

## Features

- **Next.js 15** with App Router
- **TypeScript** with strict mode configuration
- **Better Auth** for authentication (email/password, OAuth, 2FA)
- **TailwindCSS** for styling
- **OXC & Prettier** for lightning-fast code quality checks
- **Drizzle ORM** with PostgreSQL (Neon)
- **Email integration** with Plunk and React Email
- **Production-ready** directory structure
- **Security headers** configured
- **Authentication** fully implemented (sign up, sign in, email verification, password reset)
- **Server Actions** support
- **API Routes** with health check endpoint
- **Testing** with Vitest and Playwright

## Directory Structure

```
/app/                   # Next.js App Router
  /api/                 # API routes
    /health/            # Health check endpoint
  /(auth)/              # Auth layout group
  /(protected)/         # Protected routes group
    /dashboard/         # Dashboard page
  layout.tsx            # Root layout
  page.tsx              # Home page

/components/            # React components
  /ui/                  # UI components (Button example)

/hooks/                 # Custom React hooks

/lib/                   # Core application logic
  /actions/             # Server actions
  /db/                  # Database configuration (Drizzle)
  /auth/                # Better Auth configuration
  /types/               # TypeScript type definitions
  utils.ts              # Utility functions

/specs/                 # Project specifications
/ai_docs/               # AI documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run OXC linter (super fast!)
- `pnpm lint:fix` - Fix linting errors
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run unit tests with Vitest
- `pnpm e2e` - Run E2E tests with Playwright
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio

## Configuration

### TypeScript

Strict mode is enabled with additional safety checks. Configuration in `tsconfig.json`.

### OXC & Prettier

- **OXC**: Lightning-fast linter (50-100x faster than ESLint) with similar rules
- **Prettier**: Code formatter configured for consistency
- Automatically formats code on save in VS Code

### TailwindCSS

Custom theme configuration with CSS variables for easy theming. Dark mode ready.

### Environment Variables

See `.env.example` for required environment variables:

- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `BETTER_AUTH_SECRET` - Secret for Better Auth sessions
- `PLUNK_API_KEY` - Email service API key
- `NEXT_PUBLIC_APP_URL` - Your app's public URL
- OAuth provider credentials (optional)

## Production Checklist

- [ ] Update environment variables
- [ ] Configure database connection (Neon PostgreSQL)
- [ ] Set up Better Auth secret and OAuth providers
- [ ] Configure Plunk email service
- [ ] Update security headers in `next.config.ts`
- [ ] Set up error monitoring (Sentry is pre-configured)
- [ ] Configure analytics (Vercel Analytics ready)
- [ ] Update metadata in `app/layout.tsx`
- [ ] Run database migrations: `pnpm db:migrate`
- [ ] Test authentication flows thoroughly

## VS Code Integration

Recommended extensions are configured in `.vscode/extensions.json`. Settings for auto-formatting and linting are pre-configured.

## Automated Maintenance

This boilerplate includes several GitHub Actions workflows to keep it up-to-date:

### Dependency Management

- **Dependabot**: Automatically creates PRs for dependency updates (weekly)
- **Renovate**: Alternative dependency management with more granular control
- **Auto-merge**: Automatically merges minor and patch updates that pass all tests
- **Security Audit**: Daily security scans with npm audit, Snyk, and CodeQL

### Maintenance Workflows

- **Dependency Update** (`dependency-update.yml`): Weekly automated dependency updates with PR creation
- **Security Audit** (`security-audit.yml`): Daily security vulnerability scanning
- **Boilerplate Sync** (`boilerplate-sync.yml`): Monitors for framework updates and creates issues
- **Lighthouse Monitor** (`lighthouse-monitor.yml`): Performance monitoring for web vitals

### Setting Up Automated Updates

1. **Enable Dependabot**: Already configured in `.github/dependabot.yml`

2. **Enable Renovate** (optional, more powerful than Dependabot):

   - Install the [Renovate GitHub App](https://github.com/apps/renovate)
   - Configuration is in `.github/renovate.json`

3. **Configure Auto-merge** (optional):

   - Install a GitHub App like [Mergify](https://mergify.io/) or [Kodiak](https://kodiakhq.com/)
   - Or use GitHub's built-in auto-merge feature

4. **Set up Snyk** (optional):
   - Sign up at [snyk.io](https://snyk.io)
   - Add `SNYK_TOKEN` to your repository secrets

### Maintenance Schedule

- **Daily**: Security audits
- **Weekly**: Dependency updates (Monday 9 AM UTC)
- **Weekly**: Framework update checks (Sunday 6 AM UTC)
- **Weekly**: Performance monitoring (Wednesday 10 AM UTC)

## License

MIT
