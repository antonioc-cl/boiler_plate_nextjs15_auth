# Next.js 15 Production Boilerplate

[![CI](https://github.com/antonio/boiler_plate_nextjs15_auth/actions/workflows/ci.yml/badge.svg)](https://github.com/antonio/boiler_plate_nextjs15_auth/actions/workflows/ci.yml)
[![Deploy to Vercel](https://github.com/antonio/boiler_plate_nextjs15_auth/actions/workflows/deploy.yml/badge.svg)](https://github.com/antonio/boiler_plate_nextjs15_auth/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/antonio/boiler_plate_nextjs15_auth/branch/main/graph/badge.svg)](https://codecov.io/gh/antonio/boiler_plate_nextjs15_auth)
[![Dependency Status](https://img.shields.io/librariesio/github/antonio/boiler_plate_nextjs15_auth)](https://libraries.io/github/antonio/boiler_plate_nextjs15_auth)

A production-ready Next.js 15 boilerplate with TypeScript, authentication structure, and best practices.

## Features

- **Next.js 15** with App Router
- **TypeScript** with strict mode configuration
- **TailwindCSS** for styling
- **ESLint & Prettier** configured for code quality
- **Production-ready** directory structure
- **Security headers** configured
- **Authentication** structure ready (middleware, protected routes)
- **Server Actions** support
- **API Routes** with health check endpoint

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
  /db/                  # Database configuration
  /auth/                # Authentication configuration
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
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking

## Configuration

### TypeScript

Strict mode is enabled with additional safety checks. Configuration in `tsconfig.json`.

### ESLint & Prettier

Pre-configured for Next.js with TypeScript. Automatically formats code on save in VS Code.

### TailwindCSS

Custom theme configuration with CSS variables for easy theming. Dark mode ready.

### Environment Variables

See `.env.example` for required environment variables:

- Database configuration
- Authentication secrets
- Email configuration
- External service keys

## Production Checklist

- [ ] Update environment variables
- [ ] Configure database connection
- [ ] Set up authentication provider
- [ ] Configure email service
- [ ] Update security headers in `next.config.ts`
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure analytics
- [ ] Update metadata in `app/layout.tsx`

## VS Code Integration

Recommended extensions are configured in `.vscode/extensions.json`. Settings for auto-formatting and linting are pre-configured.

## License

MIT
