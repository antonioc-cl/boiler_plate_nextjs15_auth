/**
 * Example usage of the email service with Plunk and React Email
 *
 * This file demonstrates how to use the email service in your application
 */

import { sendEmail, sendBatchEmails } from './send-email'
import WelcomeEmail from '@/emails/welcome'
import EmailVerificationEmail from '@/emails/email-verification'

/**
 * Example of sending a welcome email using the lower-level API
 */
export async function sendWelcomeEmailExample(
  userEmail: string,
  userName: string,
  loginUrl: string
) {
  const result = await sendEmail({
    to: userEmail,
    subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'Our App'}!`,
    react: WelcomeEmail({
      name: userName,
      email: userEmail,
      loginUrl,
      companyName: process.env.NEXT_PUBLIC_APP_NAME || 'Our App',
      logoUrl: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
      supportEmail: process.env.PLUNK_FROM_EMAIL || 'support@example.com',
    }),
  })

  if (!result.success) {
    console.error(`Failed to send welcome email to ${userEmail}:`, result.error)
  }

  return result
}

/**
 * Example of sending an email verification email
 */
export async function sendVerificationEmailExample(
  userEmail: string,
  userName: string,
  verificationUrl: string
) {
  const result = await sendEmail({
    to: userEmail,
    subject: 'Verify your email address',
    react: EmailVerificationEmail({
      name: userName,
      email: userEmail,
      verificationUrl,
      expirationHours: 24,
      companyName: process.env.NEXT_PUBLIC_APP_NAME || 'Our App',
    }),
  })

  if (!result.success) {
    console.error(
      `Failed to send verification email to ${userEmail}:`,
      result.error
    )
  }

  return result
}

/**
 * Example of sending multiple emails in batch
 */
export async function sendBatchWelcomeEmails(
  users: Array<{ email: string; name: string }>
) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`

  const emails = users.map((user) => ({
    to: user.email,
    subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'Our App'}!`,
    react: WelcomeEmail({
      name: user.name,
      email: user.email,
      loginUrl,
      companyName: process.env.NEXT_PUBLIC_APP_NAME || 'Our App',
    }),
  }))

  const results = await sendBatchEmails(emails)

  const failed = results.filter((r) => !r.success)
  if (failed.length > 0) {
    console.error(`${failed.length} emails failed to send in batch`)
  }

  return results
}

/**
 * Note: For authentication-related emails, it's recommended to use the
 * helper functions in /lib/email/auth-emails.ts instead of these examples.
 *
 * Example:
 * import { sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email/auth-emails';
 */
