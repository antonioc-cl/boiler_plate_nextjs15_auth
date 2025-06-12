import { render } from '@react-email/render'
import { plunkClient, emailConfig } from './client'
// User type is defined locally

// Import email templates
import WelcomeEmail from '@/emails/welcome'
import PasswordResetEmail from '@/emails/password-reset'
import EmailVerificationEmail from '@/emails/email-verification'
import PasswordChangedEmail from '@/emails/password-changed'
import LoginNotificationEmail from '@/emails/login-notification'

interface EmailUser {
  id: string
  email: string
  username?: string | null
}

interface DeviceInfo {
  ipAddress?: string
  userAgent?: string
  location?: string
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(
  user: EmailUser,
  verificationUrl?: string
): Promise<void> {
  const emailHtml = await render(
    WelcomeEmail({
      name: user.username || 'there',
      email: user.email,
      loginUrl:
        verificationUrl ||
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`,
    })
  )

  await plunkClient.emails.send({
    to: user.email,
    subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'Our Platform'}!`,
    body: emailHtml,
    type: 'html',
    from: emailConfig.from,
  })
}

/**
 * Send a password reset email
 */
export async function sendPasswordResetEmail(
  user: EmailUser,
  resetUrl: string,
  validMinutes: number = 60
): Promise<void> {
  const emailHtml = await render(
    PasswordResetEmail({
      name: user.username || 'there',
      email: user.email,
      resetUrl,
      expirationHours: Math.ceil(validMinutes / 60),
    })
  )

  await plunkClient.emails.send({
    to: user.email,
    subject: 'Reset Your Password',
    body: emailHtml,
    type: 'html',
    from: emailConfig.from,
  })
}

/**
 * Send an email verification email
 */
export async function sendEmailVerificationEmail(
  user: EmailUser,
  verificationUrl: string,
  validHours: number = 24
): Promise<void> {
  const emailHtml = await render(
    EmailVerificationEmail({
      name: user.username || 'there',
      email: user.email,
      verificationUrl,
      expirationHours: validHours,
    })
  )

  await plunkClient.emails.send({
    to: user.email,
    subject: 'Verify Your Email Address',
    body: emailHtml,
    type: 'html',
    from: emailConfig.from,
  })
}

/**
 * Send a password changed confirmation email
 */
export async function sendPasswordChangedEmail(
  user: EmailUser,
  _ipAddress?: string
): Promise<void> {
  const emailHtml = await render(
    PasswordChangedEmail({
      name: user.username || 'there',
      email: user.email,
      changedAt: new Date(),
      securityUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings/security`,
    })
  )

  await plunkClient.emails.send({
    to: user.email,
    subject: 'Your Password Has Been Changed',
    body: emailHtml,
    type: 'html',
    from: emailConfig.from,
  })
}

/**
 * Send a login notification email
 */
export async function sendLoginNotificationEmail(
  user: EmailUser,
  deviceInfo: DeviceInfo
): Promise<void> {
  const emailHtml = await render(
    LoginNotificationEmail({
      name: user.username || 'there',
      email: user.email,
      loginTime: new Date(),
      ipAddress: deviceInfo.ipAddress,
      device: deviceInfo.userAgent || undefined,
      location: deviceInfo.location || undefined,
      securityUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings/security`,
    })
  )

  await plunkClient.emails.send({
    to: user.email,
    subject: 'New Login to Your Account',
    body: emailHtml,
    type: 'html',
    from: emailConfig.from,
  })
}

/**
 * Helper function to generate verification URLs
 */
export function generateVerificationUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/verify-email?token=${token}`
}

/**
 * Helper function to generate password reset URLs
 */
export function generatePasswordResetUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/reset-password?token=${token}`
}
