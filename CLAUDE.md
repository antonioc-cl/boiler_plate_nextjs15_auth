# PROJECT_NAME - AI Development Context

## Project Overview
Production-ready Next.js 15 boilerplate with authentication, testing, and modern tooling.

## Tech Stack & Architecture
- **Frontend**: Next.js 15 with App Router, TypeScript (strict mode)
- **Authentication**: Better Auth (email/password, OAuth, 2FA)
- **Styling**: TailwindCSS with custom theme and dark mode
- **Database**: Drizzle ORM with PostgreSQL
- **Email**: Plunk + React Email
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Code Quality**: OXC linter + Prettier
- **Deployment**: Vercel-optimized

## Directory Structure & Patterns
- `/app/` - Next.js App Router with route groups
- `/(auth)/` - Authentication pages (sign-in, sign-up, etc.)
- `/(protected)/` - Protected routes requiring auth
- `/components/ui/` - Reusable UI components
- `/lib/actions/` - Server actions
- `/lib/db/` - Database config and schemas
- `/lib/auth/` - Better Auth configuration

## Core Development Principles

### 🚀 Maximum Parallelization Strategy
**CRITICAL: Always deploy the maximum number of subagents in parallel when tackling complex tasks.**

- **For any analysis or research task**: Deploy 3-5+ specialized subagents simultaneously
- **For implementation tasks**: Use parallel subagents for different aspects (frontend, backend, testing, documentation)
- **For debugging**: Deploy multiple subagents to investigate different potential causes
- **For optimization**: Use subagents in parallel for different optimization vectors (performance, security, UX)

**Sub-agent Deployment Guidelines:**
- **Simple tasks**: Minimum 2-3 subagents for different perspectives
- **Complex tasks**: 5-8+ subagents for comprehensive coverage
- **Critical features**: Maximum available subagents for thorough analysis
- **Research phases**: Deploy subagents to investigate different approaches simultaneously

### Sub-agent Specialization Areas
When deploying multiple subagents, assign them specialized roles:
1. **Current State Analyzer** - Project status and architecture
2. **Research Specialist** - Best practices and documentation
3. **Compatibility Checker** - Integration and breaking changes
4. **Performance Analyst** - Optimization opportunities
5. **Security Auditor** - Security implications and requirements
6. **Testing Strategist** - Test coverage and quality assurance
7. **Documentation Specialist** - Documentation and knowledge gaps
8. **User Experience Researcher** - UX patterns and accessibility

## Coding Standards
- **Files**: kebab-case for pages, PascalCase for components
- **Components**: Function declarations with proper TypeScript
- **Imports**: Absolute imports using `@/` alias
- **Server Actions**: In `/lib/actions/` with proper error handling
- **Database**: Drizzle schema in `/lib/db/schema.ts`
- **Styling**: Tailwind classes, custom CSS variables for theming

## Key Implementation Details
- **Auth Flow**: Better Auth handles sessions, middleware protects routes
- **Database**: Drizzle with migrations, connection pooling configured
- **Email**: React Email templates, Plunk for sending
- **Security**: CSP headers, CSRF protection, input validation
- **Performance**: Image optimization, bundle analysis ready

## Development Workflow Optimization

### Multi-Agent Research Protocol
For every significant task:
1. **Deploy maximum subagents** for comprehensive analysis
2. **Assign specialized roles** to each subagent
3. **Let subagents work in parallel** on different aspects
4. **Synthesize findings** from all subagents before proceeding
5. **Use parallel implementation** when possible

### Parallel Development Strategy
- **Frontend + Backend**: Develop simultaneously with different subagents
- **Testing + Implementation**: Write tests in parallel with feature development
- **Documentation + Code**: Document while implementing
- **Research + Planning**: Investigate multiple approaches concurrently

## Environment Setup
Required variables in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Session secret
- `PLUNK_API_KEY` - Email service
- `NEXT_PUBLIC_APP_URL` - App URL

## Testing Strategy
- **Unit**: Vitest for components and utilities
- **Integration**: API route testing
- **E2E**: Playwright for user flows
- **Auth Testing**: Authentication flow coverage

## Deployment Considerations
- Vercel optimized with proper environment variables
- Database migrations run automatically
- Security headers configured
- Performance monitoring ready (Lighthouse)

## Multi-Agent Task Examples

### Example 1: Implementing Authentication
Deploy 6+ subagents:
- **Agent 1**: Research Better Auth best practices
- **Agent 2**: Analyze current auth integration points
- **Agent 3**: Design database schema for user management
- **Agent 4**: Plan frontend component architecture
- **Agent 5**: Investigate security requirements and compliance
- **Agent 6**: Design testing strategy for auth flows

### Example 2: Performance Optimization
Deploy 5+ subagents:
- **Agent 1**: Analyze bundle size and code splitting opportunities
- **Agent 2**: Investigate database query optimization
- **Agent 3**: Research image optimization and CDN strategies
- **Agent 4**: Audit Core Web Vitals and performance metrics
- **Agent 5**: Plan caching strategies (client and server)

### Example 3: Feature Development
Deploy 8+ subagents:
- **Agent 1**: Analyze business requirements and user stories
- **Agent 2**: Research technical implementation approaches
- **Agent 3**: Design database schema and migrations
- **Agent 4**: Plan API endpoints and server actions
- **Agent 5**: Design frontend component architecture
- **Agent 6**: Plan testing strategy (unit, integration, E2E)
- **Agent 7**: Research accessibility and UX patterns
- **Agent 8**: Plan documentation and knowledge transfer

## Common Patterns
- Server components by default, client components when needed
- Error boundaries for graceful error handling
- Loading states with Suspense
- Type-safe database queries with Drizzle
- Responsive design with Tailwind breakpoints

## Efficiency Maximization
**Remember: The goal is to achieve maximum development velocity and quality through intelligent parallelization. Never use a single approach when multiple subagents can provide richer, faster, and more comprehensive results.**

Always ask yourself:
- "Can I deploy more subagents to analyze this from different angles?"
- "What specialized perspectives am I missing?"
- "How can I parallelize this work for faster completion?"
- "What would a team of experts each focus on for this task?"