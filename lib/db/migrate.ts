import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db } from './index'

async function runMigrations() {
  // Migration process started

  try {
    await migrate(db, { migrationsFolder: './drizzle' })
    // Migrations completed successfully
  } catch (error) {
    // Migration failed - exit with error code
    process.stderr.write(`Migration failed: ${error}\n`)
    process.exit(1)
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
}
