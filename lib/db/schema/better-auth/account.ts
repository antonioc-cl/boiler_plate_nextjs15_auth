import { pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core'
import { user } from './user'

// Better Auth account table schema (for OAuth providers and credentials)
export const account = pgTable(
  'account',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    // For credentials provider, this will store the hashed password
    password: text('password'),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt', {
      withTimezone: true,
      mode: 'date',
    }),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', {
      withTimezone: true,
      mode: 'date',
    }),
    scope: text('scope'),
    createdAt: timestamp('createdAt', {
      withTimezone: true,
      mode: 'date',
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      withTimezone: true,
      mode: 'date',
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdIdx: index('account_userId_idx').on(table.userId),
      providerIdx: index('account_providerId_idx').on(table.providerId),
      accountProviderIdx: index('account_accountId_providerId_idx').on(
        table.accountId,
        table.providerId
      ),
    }
  }
)

export type Account = typeof account.$inferSelect
export type NewAccount = typeof account.$inferInsert
