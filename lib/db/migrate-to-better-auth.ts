import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { betterAuthSchema } from './schema/better-auth'
import { schema as luciaSchema } from './schema'

/**
 * Migration script to transfer data from Lucia Auth to Better Auth
 *
 * This script will:
 * 1. Create new Better Auth tables
 * 2. Migrate user data (preserving IDs and password hashes)
 * 3. Migrate session data
 * 4. Migrate verification tokens
 * 5. Create account entries for existing users
 *
 * IMPORTANT: Run this in a transaction and backup your database first!
 */

export async function migrateToBetterAuth() {
  console.log('Starting migration from Lucia Auth to Better Auth...')

  try {
    await db.transaction(async (tx) => {
      // Step 1: Create Better Auth tables
      console.log('Creating Better Auth tables...')

      // Note: You'll need to generate and run the actual SQL migrations
      // using: pnpm drizzle-kit generate:pg
      // This is just the data migration logic

      // Step 2: Migrate users
      console.log('Migrating users...')
      const existingUsers = await tx.select().from(luciaSchema.users)

      for (const luciaUser of existingUsers) {
        // Insert into Better Auth user table
        await tx
          .insert(betterAuthSchema.user)
          .values({
            id: luciaUser.id, // Preserve user ID
            email: luciaUser.email,
            emailVerified: luciaUser.emailVerified,
            name: luciaUser.username || null,
            createdAt: luciaUser.createdAt,
            updatedAt: luciaUser.updatedAt,
          })
          .onConflictDoNothing()

        // Create account entry for credentials provider
        // Better Auth stores passwords in the account table
        await tx
          .insert(betterAuthSchema.account)
          .values({
            userId: luciaUser.id,
            accountId: luciaUser.email, // Use email as account ID for credentials
            providerId: 'credentials', // Credentials provider
            password: luciaUser.hashedPassword, // Password hashes should be compatible
            createdAt: luciaUser.createdAt,
            updatedAt: luciaUser.updatedAt,
          })
          .onConflictDoNothing()
      }

      // Step 3: Migrate sessions
      console.log('Migrating sessions...')
      const existingSessions = await tx.select().from(luciaSchema.sessions)

      for (const luciaSession of existingSessions) {
        await tx
          .insert(betterAuthSchema.session)
          .values({
            id: luciaSession.id,
            userId: luciaSession.userId,
            expiresAt: luciaSession.expiresAt,
            token: luciaSession.id, // Use session ID as token
            ipAddress: luciaSession.ipAddress,
            userAgent: luciaSession.userAgent,
            createdAt: luciaSession.createdAt,
            updatedAt: luciaSession.createdAt, // Sessions don't have updatedAt in Lucia
          })
          .onConflictDoNothing()
      }

      // Step 4: Migrate email verification tokens
      console.log('Migrating email verification tokens...')
      const emailTokens = await tx
        .select()
        .from(luciaSchema.emailVerificationTokens)

      for (const token of emailTokens) {
        await tx
          .insert(betterAuthSchema.verification)
          .values({
            identifier: token.email, // Use email as identifier
            value: token.token,
            expiresAt: token.expiresAt,
            createdAt: token.createdAt,
            updatedAt: token.createdAt,
          })
          .onConflictDoNothing()
      }

      // Step 5: Migrate password reset tokens
      console.log('Migrating password reset tokens...')
      const passwordTokens = await tx
        .select()
        .from(luciaSchema.passwordResetTokens)

      for (const token of passwordTokens) {
        // Get user email for identifier
        const user = await tx
          .select({ email: luciaSchema.users.email })
          .from(luciaSchema.users)
          .where(sql`${luciaSchema.users.id} = ${token.userId}`)
          .limit(1)

        if (user[0]) {
          await tx
            .insert(betterAuthSchema.verification)
            .values({
              identifier: user[0].email, // Use email as identifier
              value: token.token,
              expiresAt: token.expiresAt,
              createdAt: token.createdAt,
              updatedAt: token.createdAt,
            })
            .onConflictDoNothing()
        }
      }

      console.log('Migration completed successfully!')
    })
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

// Cleanup function to remove old Lucia tables after successful migration
export async function cleanupLuciaTables() {
  console.log('Cleaning up old Lucia Auth tables...')

  try {
    await db.transaction(async (tx) => {
      // Drop tables in correct order (respecting foreign keys)
      await tx.execute(
        sql`DROP TABLE IF EXISTS email_verification_tokens CASCADE`
      )
      await tx.execute(sql`DROP TABLE IF EXISTS password_reset_tokens CASCADE`)
      await tx.execute(sql`DROP TABLE IF EXISTS sessions CASCADE`)
      await tx.execute(sql`DROP TABLE IF EXISTS users CASCADE`)

      console.log('Lucia Auth tables removed successfully!')
    })
  } catch (error) {
    console.error('Cleanup failed:', error)
    throw error
  }
}

// Verification function to check data integrity after migration
export async function verifyMigration() {
  console.log('Verifying migration...')

  const results = {
    users: { lucia: 0, betterAuth: 0 },
    sessions: { lucia: 0, betterAuth: 0 },
    verificationTokens: { lucia: 0, betterAuth: 0 },
  }

  try {
    // Count records in Lucia tables
    const luciaUsers = await db
      .select({ count: sql`count(*)` })
      .from(luciaSchema.users)
    const luciaSessions = await db
      .select({ count: sql`count(*)` })
      .from(luciaSchema.sessions)
    const luciaEmailTokens = await db
      .select({ count: sql`count(*)` })
      .from(luciaSchema.emailVerificationTokens)
    const luciaPasswordTokens = await db
      .select({ count: sql`count(*)` })
      .from(luciaSchema.passwordResetTokens)

    results.users.lucia = Number(luciaUsers[0]?.count || 0)
    results.sessions.lucia = Number(luciaSessions[0]?.count || 0)
    results.verificationTokens.lucia =
      Number(luciaEmailTokens[0]?.count || 0) +
      Number(luciaPasswordTokens[0]?.count || 0)

    // Count records in Better Auth tables
    const betterAuthUsers = await db
      .select({ count: sql`count(*)` })
      .from(betterAuthSchema.user)
    const betterAuthSessions = await db
      .select({ count: sql`count(*)` })
      .from(betterAuthSchema.session)
    const betterAuthVerifications = await db
      .select({ count: sql`count(*)` })
      .from(betterAuthSchema.verification)

    results.users.betterAuth = Number(betterAuthUsers[0]?.count || 0)
    results.sessions.betterAuth = Number(betterAuthSessions[0]?.count || 0)
    results.verificationTokens.betterAuth = Number(
      betterAuthVerifications[0]?.count || 0
    )

    console.log('Migration verification results:')
    console.log('Users:', results.users)
    console.log('Sessions:', results.sessions)
    console.log('Verification tokens:', results.verificationTokens)

    return results
  } catch (error) {
    console.error('Verification failed:', error)
    throw error
  }
}

// Main migration runner
if (require.main === module) {
  migrateToBetterAuth()
    .then(() => verifyMigration())
    .then(() => {
      console.log(
        'Migration completed! Please verify the data before running cleanupLuciaTables()'
      )
      process.exit(0)
    })
    .catch((error) => {
      console.error('Migration failed:', error)
      process.exit(1)
    })
}
