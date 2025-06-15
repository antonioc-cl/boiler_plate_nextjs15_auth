import { sendEmail } from '@/lib/email/send-email'
import EmailVerificationEmail from '@/emails/email-verification'
import PasswordResetEmail from '@/emails/password-reset'

// Helper functions for sending auth-related emails
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`

  await sendEmail({
    to: email,
    subject: 'Verify your email address',
    react: EmailVerificationEmail({
      name: email.split('@')[0] || 'there',
      email: email,
      verificationUrl,
      expirationHours: 24,
    }),
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  await sendEmail({
    to: email,
    subject: 'Reset your password',
    react: PasswordResetEmail({
      name: email.split('@')[0] || 'there',
      email: email,
      resetUrl,
      expirationHours: 1,
    }),
  })
}
