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
- **Drizzle ORM** with PostgreSQL (any provider)
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
- PostgreSQL database (see options below)

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

   For local development with Docker:
   ```bash
   cp .env.local.example .env.local
   ```

### Database Setup

#### Option 1: Local Development with Docker (Recommended)

1. Start PostgreSQL with Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. The database will be available at:
   ```
   postgresql://postgres:password@localhost:5432/myapp
   ```

#### Option 2: Cloud PostgreSQL Provider

Choose any PostgreSQL provider and update your `.env` with the connection string. See the [Database Configuration](#database-configuration) section for provider-specific instructions.

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

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret for Better Auth sessions
- `PLUNK_API_KEY` - Email service API key
- `NEXT_PUBLIC_APP_URL` - Your app's public URL
- OAuth provider credentials (optional)

## Production Checklist

- [ ] Update environment variables
- [ ] Configure database connection (PostgreSQL)
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

## 🤖 Claude Code Integration

This boilerplate includes full integration with Claude Code for AI-assisted development:

### Features
- **Pre-configured Commands**: Start, note-taking, status checks, and session documentation
- **Complete AI Context**: Comprehensive project documentation for Claude
- **Development Workflow**: TDD approach with automated tracking
- **Session Management**: Automatic documentation of development sessions

### Quick Start with Claude Code
1. Install Claude Code from [claude.ai/code](https://claude.ai/code)
2. Use the enhanced initialization script (see below)
3. Open Claude Code in your project
4. Run `/start` for complete project context

### Available Commands
- `/start` - Load complete project context and current state
- `/note [message]` - Add timestamped notes to current session
- `/status` - Quick project status and git state
- `/end [summary]` - Create comprehensive session documentation
- `/cleanup` - Clear current session

### Enhanced Project Initialization
Use the `claude-init-full` script for projects with this boilerplate:

```bash
# Setup once (copy this script to ~/.local/bin/claude-init-full)
#!/bin/bash
echo "🚀 Inicializando proyecto Next.js con boilerplate completo..."
PROJECT_NAME=$(basename $(pwd))
git clone https://github.com/antonioc-cl/boiler_plate_nextjs15_auth.git .
rm -rf .git && git init
sed -i '' "s/PROJECT_NAME/$PROJECT_NAME/g" CLAUDE.md package.json README.md
echo "✅ Proyecto listo con contexto completo para Claude Code"
```

### Documentation Structure
- `CLAUDE.md` - Complete AI development context
- `docs/architecture.md` - System architecture and patterns
- `docs/conventions.md` - Coding standards and conventions
- `docs/getting-started.md` - Development workflow guide

This integration ensures Claude has complete context about your Next.js 15 project from day one.

---

## Database Configuration

### Supported PostgreSQL Providers
This boilerplate works with any PostgreSQL provider:

- **Local Development**: Docker Compose (included)
- **Supabase**: Full-featured PostgreSQL with real-time
- **PostgreSQL**: Any provider (local, cloud, or managed)
- **Railway**: Simple deployment
- **AWS RDS**: Enterprise PostgreSQL
- **Google Cloud SQL**: Managed PostgreSQL

### Environment Setup
Update your `.env` file with your PostgreSQL connection string:

```env
# Generic PostgreSQL format
DATABASE_URL="postgresql://username:password@host:port/database"

# Supabase example
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Local development
DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp"
```

## 🔄 Complete Development Workflow

This boilerplate includes a comprehensive development workflow system that transforms Claude Code into a complete development partner with memory, research capabilities, and systematic workflow management.

![Development Workflow](docs/development-workflow-diagram.svg)

### 🎯 Two Powerful Workflows

#### 1. Session Management (Daily Development)
Perfect for regular development tasks with memory between sessions:

```bash
# Start session with automatic research
/start implement user dashboard with analytics

# Log progress as you work  
/note added chart components with real-time data
/note integrated with analytics API, added error handling

# Check status anytime
/status

# End with comprehensive documentation
/end
```

**Benefits:**
- 🧠 **Memory between sessions** - Never lose context
- 🔍 **Sub-agent research** - Automatic analysis and investigation  
- 📝 **Problem tracking** - Document solutions to avoid repeating mistakes
- 📊 **Progress documentation** - Complete timeline of development work

#### 2. PRD Pipeline (Feature Development)
Complete business-to-code pipeline for complex features:

```bash
# Step 1: Analyze business requirements
/analyze-prd docs/prd-user-authentication.md

# Step 2: Generate technical implementation plan  
/generate-prp analysis/prd_analysis_20250706_auth.md

# Step 3: Execute complete implementation
/execute-prp PRPS/prp_20250706_auth_system.md
```

**Benefits:**
- 🏢 **Business alignment** - Direct translation from PRD to code
- 🔬 **Deep research** - Sub-agents investigate best practices and compatibility
- 📋 **Systematic implementation** - Step-by-step execution with validation
- 🧪 **Built-in testing** - Comprehensive testing and documentation

### 🧠 Sub-agent Research System

Every `/start` and `/analyze-prd` automatically deploys specialized AI agents:

- **Current State Agent** - Analyzes project status, dependencies, git history
- **Research Agent** - Investigates requirements, best practices, documentation  
- **Compatibility Agent** - Assesses integration complexity and breaking changes

### 📁 Enhanced Project Structure

```
your-project/
├── .claude/
│   ├── commands/           # Development workflow commands
│   ├── sessions/          # Session tracking
│   └── README.md          # Complete system documentation
├── sessions/              # Session memory files
├── analysis/              # PRD technical analysis
├── PRPS/                 # Product Requirements Prompts
├── docs/                 # Architecture documentation
├── CLAUDE.md            # Complete AI context
└── [your application code]
```

### 🚀 Getting Started with the Workflow

1. **Use the enhanced initialization:**
   ```bash
   claude-init-full  # Sets up complete system
   ```

2. **Start your first session:**
   ```bash
   /help     # Learn all available commands
   /start build user registration system
   ```

3. **For complex features, use PRD pipeline:**
   ```bash
   # Create business requirements in docs/prd-feature.md
   /analyze-prd docs/prd-feature.md
   /generate-prp analysis/prd_analysis_feature.md  
   /execute-prp PRPS/prp_feature.md
   ```

### 📚 Learn More

- See [`.claude/README.md`](.claude/README.md) for complete system documentation
- Use `/help` within Claude Code for command reference
- Review `sessions/` directory for examples of comprehensive session documentation

---

## License

MIT
