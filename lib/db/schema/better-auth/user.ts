import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  index,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// Better Auth user table schema
export const user = pgTable(
  'user',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('emailVerified').default(false).notNull(),
    name: text('name'),
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
      emailIdx: index('user_email_idx').on(table.email),
    }
  }
)

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(user)
export const selectUserSchema = createSelectSchema(user)

// Custom validation schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255).optional(),
})

// Type exports
export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert
