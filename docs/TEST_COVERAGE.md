# Test Coverage Configuration

This document outlines the test coverage setup for the Next.js 15 Better Auth boilerplate.

## Coverage Overview

The project uses Vitest with v8 coverage provider to ensure comprehensive test coverage across critical authentication components.

## Coverage Thresholds

### Global Thresholds

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Component-Specific Thresholds

Critical authentication components have higher coverage requirements:

- **`lib/auth/utils.ts`**: 90% (all metrics)
- **`lib/auth/server.ts`**: 90% (all metrics)
- **`lib/auth/middleware-helpers.ts`**: 85% (all metrics)
- **`lib/auth/email.ts`**: 75% branches, 85% functions/lines/statements

## Coverage Reports

The following report formats are generated:

- **Text**: Console output during test runs
- **HTML**: Interactive report at `./coverage/index.html`
- **JSON**: Machine-readable format at `./coverage/coverage-final.json`
- **LCOV**: For CI integration at `./coverage/lcov.info`

## Files Excluded from Coverage

The following files are excluded from coverage calculations:

### Infrastructure & Configuration

- `node_modules/`, `dist/`, `.next/`, `coverage/`
- `**/*.d.ts`, `**/*.config.*`
- `sentry.*.config.ts`
- `lib/auth/better-auth.ts` (configuration file)
- `lib/auth/config.ts` (configuration file)

### Testing & Documentation

- `src/test/`, `**/test-utils.tsx`, `**/setup.ts`
- `tests/` (E2E tests), `docs/`, `specs/`
- `**/*.spec.ts`, `**/*.spec.tsx`

### Generated & Migration Files

- `lib/db/migrations/**`
- `lib/db/migrate*.ts`
- `app/api/auth/[...all]/route.ts` (Better Auth route handler)

### Email Templates & Examples

- `emails/components/**`
- `emails/examples/**`
- `emails/translations/**`

## Test Commands

```bash
# Run tests with coverage
pnpm test:coverage

# Run tests with coverage in watch mode
pnpm test:coverage:watch

# Run unit tests only
pnpm test:unit

# Run tests in interactive UI mode
pnpm test:ui

# Run E2E tests
pnpm e2e
```

## CI Integration

The GitHub Actions workflow automatically:

1. Runs unit tests with coverage
2. Uploads coverage reports to Codecov
3. Fails the build if coverage thresholds are not met
4. Runs E2E tests to ensure end-to-end functionality

## Better Auth Test Coverage

The following Better Auth components have comprehensive test coverage:

### Core Authentication (`lib/auth/`)

- ✅ **utils.ts**: Password hashing, user creation, sign in/out
- ✅ **server.ts**: Session management, authentication checks
- ✅ **middleware-helpers.ts**: Route protection, user retrieval
- ✅ **email.ts**: Email verification and password reset emails
- ✅ **client.ts**: Client-side authentication hooks

### Form Components (`components/auth/`)

- ✅ **login-form.tsx**: Login form validation and submission
- ✅ **signup-form.tsx**: Registration form validation and submission

### Server Actions (`app/actions/`)

- ✅ **auth.ts**: Authentication actions and validations

## Monitoring Coverage

Coverage reports are generated on every test run. To monitor coverage trends:

1. Check the console output for immediate feedback
2. Open `./coverage/index.html` for detailed file-by-file analysis
3. Review the CI coverage reports for historical trends
4. Use Codecov integration for pull request coverage analysis

## Best Practices

1. **Write tests before implementation** for new authentication features
2. **Maintain high coverage** for critical authentication paths
3. **Use integration tests** for complex authentication flows
4. **Mock external dependencies** appropriately in unit tests
5. **Test error scenarios** as thoroughly as success paths

## Coverage Goals

The current coverage configuration balances thoroughness with practicality:

- Critical authentication code requires 85-90% coverage
- Supporting infrastructure requires 70% coverage
- Configuration and generated files are excluded to focus on business logic

This ensures robust testing of authentication security while maintaining development velocity.
