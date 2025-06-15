# Better Auth Migration Guide

This guide explains how to migrate from Lucia Auth to Better Auth while preserving existing user data.

## Overview

The migration process involves:

1. Creating new Better Auth database tables
2. Migrating existing user data, sessions, and tokens
3. Updating application code to use Better Auth
4. Cleaning up old Lucia Auth tables

## Database Schema Differences

### Lucia Auth → Better Auth Mapping

| Lucia Auth                  | Better Auth                 | Notes                                   |
| --------------------------- | --------------------------- | --------------------------------------- |
| `users` table               | `user` table                | Singular naming convention              |
| `sessions` table            | `session` table             | Similar structure                       |
| `email_verification_tokens` | `verification` table        | Combined tokens table                   |
| `password_reset_tokens`     | `verification` table        | Combined tokens table                   |
| Password in `users` table   | Password in `account` table | Better Auth stores passwords separately |

### Key Changes

1. **User Table**:

   - `username` field → `name` field
   - `hashedPassword` moved to `account` table
   - `emailVerifiedAt` removed (only boolean flag kept)

2. **Account Table** (New):

   - Stores authentication provider data
   - For credentials auth, stores password hashes
   - Supports OAuth providers for future expansion

3. **Session Table**:

   - Added `token` field for session lookups
   - Structure mostly compatible

4. **Verification Table**:
   - Unified table for all verification tokens
   - Uses `identifier` (email) and `value` (token) pattern

## Migration Steps

### 1. Backup Your Database

```bash
# Example for PostgreSQL
pg_dump your_database_url > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Create Better Auth Tables

Run the SQL migration:

```bash
# Apply the migration SQL
psql your_database_url < lib/db/schema/better-auth/migrations.sql
```

Or use Drizzle migrations:

```bash
# Generate migrations from schema
pnpm drizzle-kit generate:pg

# Apply migrations
pnpm db:migrate
```

### 3. Run Data Migration

```bash
# Run the migration script
pnpm tsx lib/db/migrate-to-better-auth.ts
```

This will:

- Copy all users (preserving IDs)
- Create account entries with existing password hashes
- Migrate active sessions
- Transfer verification tokens

### 4. Verify Migration

The script includes verification that compares record counts between old and new tables.

### 5. Update Application Code

Update your authentication logic to use Better Auth instead of Lucia Auth.

### 6. Cleanup (After Testing)

Once you've verified everything works:

```typescript
import { cleanupLuciaTables } from './migrate-to-better-auth'
await cleanupLuciaTables()
```

## Important Notes

### Password Hash Compatibility

- Lucia Auth and Better Auth both support bcrypt/argon2 hashes
- Existing password hashes are moved to the `account` table
- Users can log in with existing passwords

### Session Compatibility

- Session IDs are preserved
- Active sessions will need to be re-validated by Better Auth
- Consider having users re-authenticate after migration

### User IDs

- User IDs are preserved during migration
- All foreign key relationships remain intact
- No need to update references in other tables

### Rollback Plan

If issues occur:

1. Better Auth tables are created separately from Lucia tables
2. Original data remains untouched until cleanup
3. You can revert by dropping Better Auth tables and continuing with Lucia

## Testing Checklist

- [ ] Users can log in with existing passwords
- [ ] Email verification status is preserved
- [ ] Password reset flow works
- [ ] New user registration works
- [ ] Session management functions correctly
- [ ] All user data is present and correct
