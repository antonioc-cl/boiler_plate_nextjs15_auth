# E2E Tests with Playwright

This directory contains end-to-end tests for the authentication flows using Playwright.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Install Playwright browsers (already done during setup):
   ```bash
   pnpm exec playwright install
   ```

## Running Tests

### Run all tests

```bash
pnpm e2e
```

### Run tests with UI (headed mode)

```bash
pnpm e2e:headed
```

### Debug tests

```bash
pnpm e2e:debug
```

### Run specific test file

```bash
pnpm e2e tests/auth/login.spec.ts
```

### Run tests in specific browser

```bash
pnpm e2e --project=chromium
pnpm e2e --project=firefox
pnpm e2e --project=webkit
```

## Test Structure

```
tests/
├── auth/
│   ├── login.spec.ts          # Login flow tests
│   ├── signup.spec.ts         # Signup flow tests
│   ├── logout.spec.ts         # Logout flow tests
│   └── protected-routes.spec.ts # Route protection tests
└── helpers/
    ├── auth.ts                # Authentication helper functions
    └── navigation.ts          # Navigation helper functions
```

## Test Coverage

Each test file covers:

### Login Tests (`login.spec.ts`)

- Form display and validation
- Successful login with valid credentials
- Error handling (invalid email, wrong password, non-existent user)
- Loading states
- Password visibility toggle
- Navigation to signup
- Protected route redirects

### Signup Tests (`signup.spec.ts`)

- Form display and validation
- Successful account creation
- Email validation
- Password strength requirements
- Password matching
- Duplicate email handling
- Loading states
- Real-time validation

### Logout Tests (`logout.spec.ts`)

- Successful logout from various pages
- Session clearing
- Cookie removal
- Error handling
- Mobile menu logout
- Concurrent logout handling

### Protected Routes Tests (`protected-routes.spec.ts`)

- Unauthenticated access redirects
- Authenticated access allowed
- Query parameter preservation
- Deep linking
- API route protection
- Role-based access control
- Session timeout handling

## Writing New Tests

When adding new tests:

1. Use the helper functions from `tests/helpers/` for common operations
2. Follow the existing test structure and naming conventions
3. Include both happy path and error scenarios
4. Test loading states and UI feedback
5. Verify redirects and navigation flows

## Configuration

Test configuration is in `playwright.config.ts`:

- Base URL: `http://localhost:3000`
- Browsers: Chromium, Firefox, WebKit
- Screenshots: Captured on failure
- Videos: Recorded on failure
- Traces: Collected on retry

## Tips

1. **Test Data**: Use unique emails for signup tests (e.g., `test-${Date.now()}@example.com`)
2. **Selectors**: Prefer data-testid attributes or semantic selectors
3. **Waits**: Use Playwright's built-in waiting mechanisms instead of hard timeouts
4. **Assertions**: Use Playwright's web-first assertions for better reliability

## Troubleshooting

- **Tests failing locally**: Ensure the dev server is running (`pnpm dev`)
- **Timeout errors**: Increase timeout in specific tests or globally in config
- **Flaky tests**: Use `waitForLoadState`, `waitForSelector`, or increase specific timeouts
- **Browser not installed**: Run `pnpm exec playwright install`
