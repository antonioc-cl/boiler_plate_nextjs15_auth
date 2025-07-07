# Getting Started Guide

## Quick Setup
1. Clone and install dependencies: `pnpm install`
2. Copy environment: `cp .env.example .env`
3. Configure database and auth secrets
4. Run migrations: `pnpm db:migrate`
5. Start development: `pnpm dev`

## Development Workflow
1. **Project Start**: Use `/start` command in Claude Code
2. **Feature Development**: TDD approach with `/test` command
3. **Progress Tracking**: Use `/note` for session tracking
4. **Code Quality**: Run `/commit` for smart commits
5. **Session End**: Use `/end` for comprehensive documentation

## Key Commands
- `pnpm dev` - Development server
- `pnpm test` - Run all tests
- `pnpm lint` - Code quality check
- `pnpm db:studio` - Database management
- `pnpm build` - Production build

## Authentication Setup
1. Configure Better Auth in `/lib/auth/`
2. Set up OAuth providers (optional)
3. Configure email templates
4. Test authentication flows

## Database Setup

### Choose Your PostgreSQL Provider

This boilerplate works with any PostgreSQL provider. Here are setup instructions for popular options:

#### Local Development (Docker)
1. Use the included `docker-compose.yml` file:
   ```bash
   docker-compose up -d
   ```
2. Connection string: `postgresql://postgres:password@localhost:5432/myapp`

#### Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Get your connection string from Settings → Database
3. Format: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`

#### Railway
1. Create a PostgreSQL service on [railway.app](https://railway.app)
2. Get connection string from service settings
3. Format: `postgresql://postgres:[password]@[host].railway.app:5432/railway`

#### Neon
1. Create a project at [neon.tech](https://neon.tech)
2. Get your connection string from the dashboard
3. Format: `postgresql://[user]:[password]@[host].neon.tech/[database]?sslmode=require`

#### AWS RDS
1. Create a PostgreSQL instance in RDS
2. Configure security groups for access
3. Format: `postgresql://[user]:[password]@[host].rds.amazonaws.com:5432/[database]`

#### Google Cloud SQL
1. Create a PostgreSQL instance in Cloud SQL
2. Enable the Cloud SQL Auth proxy if needed
3. Format: `postgresql://[user]:[password]@[host]/[database]?host=/cloudsql/[instance]`

### Setup Steps
1. Add your connection string to `.env`:
   ```env
   DATABASE_URL="your-connection-string-here"
   ```
2. Run initial migrations:
   ```bash
   pnpm db:migrate
   ```
3. Verify connection with Drizzle Studio:
   ```bash
   pnpm db:studio
   ```