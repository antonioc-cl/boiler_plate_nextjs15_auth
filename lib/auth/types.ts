import type {
  Session as BetterAuthSessionBase,
  User as BetterAuthUserBase,
} from 'better-auth'

// Re-export as simpler names for compatibility
export type User = {
  id: string
  email: string
  username: string | null
  hashedPassword: string
  emailVerified: boolean
  emailVerifiedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type Session = {
  id: string
  userId: string
  expiresAt: Date
  fresh?: boolean
}

// Extend the Better Auth types with our custom fields
export interface BetterAuthUser extends BetterAuthUserBase {
  username?: string | null
  emailVerified: boolean
  emailVerifiedAt?: Date | null
}

export interface BetterAuthSession extends BetterAuthSessionBase {
  user: BetterAuthUser
}

// Auth response types
export interface AuthResponse {
  user: BetterAuthUser
  session: BetterAuthSession
}

// Form input types
export interface SignUpInput {
  email: string
  password: string
  username?: string
}

export interface SignInInput {
  email: string
  password: string
}

export interface ResetPasswordInput {
  token: string
  newPassword: string
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

// Email verification types
export interface EmailVerificationToken {
  id: string
  token: string
  identifier: string
  expiresAt: Date
}

// Password reset types
export interface PasswordResetToken {
  id: string
  token: string
  userId: string
  expiresAt: Date
}
