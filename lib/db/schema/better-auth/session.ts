import { pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core'
import { user } from './user'

// Better Auth session table schema
export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(), // Better Auth uses string IDs for sessions
    userId: uuid('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expiresAt', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
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
      userIdIdx: index('session_userId_idx').on(table.userId),
      tokenIdx: index('session_token_idx').on(table.token),
      expiresAtIdx: index('session_expiresAt_idx').on(table.expiresAt),
    }
  }
)

export type Session = typeof session.$inferSelect
export type NewSession = typeof session.$inferInsert
