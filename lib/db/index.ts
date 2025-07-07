import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create a postgres connection
const sql = postgres(process.env.DATABASE_URL, {
  max: 1, // Max number of connections
  ssl: process.env.NODE_ENV === 'production' ? 'require' : undefined,
})

export const db = drizzle(sql, { schema })

// Export all schema types for convenience
export * from './schema'
