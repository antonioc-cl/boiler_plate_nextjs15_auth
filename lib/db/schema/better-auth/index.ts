// Export all Better Auth schema definitions
export * from './user'
export * from './account'
export * from './session'
export * from './verification'

// Export all tables as a single object for easy access
import { user } from './user'
import { account } from './account'
import { session } from './session'
import { verification } from './verification'

export const betterAuthSchema = {
  user,
  account,
  session,
  verification,
}
