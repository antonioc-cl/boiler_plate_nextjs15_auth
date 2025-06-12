import { pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core'
import { users } from './users'

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    token: text('token').notNull().unique(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
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
      tokenIdx: index('password_reset_tokens_token_idx').on(table.token),
      userIdIdx: index('password_reset_tokens_user_id_idx').on(table.userId),
      expiresAtIdx: index('password_reset_tokens_expires_at_idx').on(
        table.expiresAt
      ),
    }
  }
)

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert
