import {
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  uuid,
  index,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 255 }).unique(),
    hashedPassword: text('hashed_password').notNull(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    emailVerifiedAt: timestamp('email_verified_at', {
      withTimezone: true,
      mode: 'date',
    }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'date',
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      emailIdx: index('users_email_idx').on(table.email),
      usernameIdx: index('users_username_idx').on(table.username),
    }
  }
)

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

// Custom validation schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(255).optional(),
  password: z.string().min(8),
})

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
