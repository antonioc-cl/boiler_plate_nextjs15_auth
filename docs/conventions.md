# Development Conventions

## File & Folder Naming
- **Pages**: kebab-case (`sign-in.tsx`, `user-settings.tsx`)
- **Components**: PascalCase (`UserProfile.tsx`, `AuthForm.tsx`)
- **Utilities**: camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Types**: PascalCase (`User.ts`, `AuthSession.ts`)

## Code Style
- **Imports**: Absolute imports with `@/` alias
- **Components**: Function declarations with TypeScript
- **Props**: Interfaces with descriptive names
- **Error Handling**: Try/catch for server actions

## Database Conventions
- **Tables**: snake_case (`user_profiles`, `auth_sessions`)
- **Columns**: snake_case (`created_at`, `user_id`)
- **Relations**: Proper foreign keys and indexes

## Testing Conventions
- **Files**: `.test.ts` or `.test.tsx` co-located
- **Describe blocks**: Component or function name
- **Test names**: Should describe behavior clearly
- **Mocks**: In `__mocks__` directory when needed

## Git Conventions
- **Commits**: Conventional commits (`feat:`, `fix:`, `docs:`)
- **Branches**: `feature/`, `fix/`, `docs/`
- **PRs**: Descriptive titles with context