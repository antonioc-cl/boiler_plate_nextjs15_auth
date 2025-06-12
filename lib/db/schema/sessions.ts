import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  jsonb,
} from 'drizzle-orm/pg-core'
import { users } from './users'

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    // Additional fields for better session management
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    // Store additional session data as JSON
    data: jsonb('data'),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('sessions_user_id_idx').on(table.userId),
      expiresAtIdx: index('sessions_expires_at_idx').on(table.expiresAt),
    }
  }
)

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
