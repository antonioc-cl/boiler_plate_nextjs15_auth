import { pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core'
import { users } from './users'

export const emailVerificationTokens = pgTable(
  'email_verification_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    token: text('token').notNull().unique(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      tokenIdx: index('email_verification_tokens_token_idx').on(table.token),
      userIdIdx: index('email_verification_tokens_user_id_idx').on(
        table.userId
      ),
      expiresAtIdx: index('email_verification_tokens_expires_at_idx').on(
        table.expiresAt
      ),
    }
  }
)

export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect
export type NewEmailVerificationToken =
  typeof emailVerificationTokens.$inferInsert
