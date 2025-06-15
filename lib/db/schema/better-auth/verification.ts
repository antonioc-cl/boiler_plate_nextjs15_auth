import { pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core'

// Better Auth verification table schema (for email verification and password reset)
export const verification = pgTable(
  'verification',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    identifier: text('identifier').notNull(), // email or user id
    value: text('value').notNull(), // the actual token/code
    expiresAt: timestamp('expiresAt', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
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
      identifierIdx: index('verification_identifier_idx').on(table.identifier),
      valueIdx: index('verification_value_idx').on(table.value),
      expiresAtIdx: index('verification_expiresAt_idx').on(table.expiresAt),
    }
  }
)

export type Verification = typeof verification.$inferSelect
export type NewVerification = typeof verification.$inferInsert
