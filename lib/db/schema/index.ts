// Export all schema definitions
export * from './users'
export * from './sessions'
export * from './password-reset-tokens'
export * from './email-verification-tokens'

// Export all tables as a single object for easy access
import { users } from './users'
import { sessions } from './sessions'
import { passwordResetTokens } from './password-reset-tokens'
import { emailVerificationTokens } from './email-verification-tokens'

export const schema = {
  users,
  sessions,
  passwordResetTokens,
  emailVerificationTokens,
}
