/**
 * Email template types
 */

export interface BaseEmailData {
  to: string | string[]
  subject: string
}

export interface WelcomeEmailData extends BaseEmailData {
  userName: string
  verificationUrl?: string
}

export interface PasswordResetEmailData extends BaseEmailData {
  userName: string
  resetToken: string
  expiresIn?: string
}

export interface EmailVerificationData extends BaseEmailData {
  userName: string
  verificationUrl: string
  expiresIn?: string
}

/**
 * Email service response types
 */
export interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Email template names for type safety
 */
export enum EmailTemplate {
  Welcome = 'welcome',
  PasswordReset = 'password-reset',
  EmailVerification = 'email-verification',
}

/**
 * Email priority levels
 */
export enum EmailPriority {
  Low = 'low',
  Normal = 'normal',
  High = 'high',
}
