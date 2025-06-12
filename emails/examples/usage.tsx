/**
 * Example usage of email templates
 * This file demonstrates how to use the email templates in your application
 */

import {
  WelcomeEmail,
  PasswordResetEmail,
  PasswordChangedEmail,
  EmailVerificationEmail,
  LoginNotificationEmail,
} from '../index'
import { sendEmail } from '../utils/send-email'

// Example 1: Send a welcome email
export async function sendWelcomeEmail(user: { name: string; email: string }) {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Our Platform!',
    template: (
      <WelcomeEmail
        name={user.name}
        email={user.email}
        loginUrl="https://app.example.com/login"
        companyName="Acme Corp"
        logoUrl="https://app.example.com/logo.png"
        supportEmail="support@acme.com"
        companyAddress="123 Main St, San Francisco, CA 94105"
        privacyUrl="https://app.example.com/privacy"
        termsUrl="https://app.example.com/terms"
        unsubscribeUrl="https://app.example.com/unsubscribe"
      />
    ),
  })
}

// Example 2: Send a password reset email
export async function sendPasswordResetEmail(
  user: { name: string; email: string },
  resetToken: string
) {
  const resetUrl = `https://app.example.com/reset-password?token=${resetToken}`

  await sendEmail({
    to: user.email,
    subject: 'Reset Your Password',
    template: (
      <PasswordResetEmail
        name={user.name}
        email={user.email}
        resetUrl={resetUrl}
        expirationHours={24}
        companyName="Acme Corp"
        supportEmail="support@acme.com"
      />
    ),
  })
}

// Example 3: Send password changed notification
export async function sendPasswordChangedEmail(user: {
  name: string
  email: string
}) {
  await sendEmail({
    to: user.email,
    subject: 'Your Password Has Been Changed',
    template: (
      <PasswordChangedEmail
        name={user.name}
        email={user.email}
        securityUrl="https://app.example.com/account/security"
        changedAt={new Date()}
        companyName="Acme Corp"
        supportEmail="support@acme.com"
      />
    ),
  })
}

// Example 4: Send email verification
export async function sendEmailVerificationEmail(
  user: { name: string; email: string },
  verificationToken: string
) {
  const verificationUrl = `https://app.example.com/verify-email?token=${verificationToken}`

  await sendEmail({
    to: user.email,
    subject: 'Verify Your Email Address',
    template: (
      <EmailVerificationEmail
        name={user.name}
        email={user.email}
        verificationUrl={verificationUrl}
        expirationHours={48}
        companyName="Acme Corp"
        supportEmail="support@acme.com"
      />
    ),
  })
}

// Example 5: Send login notification
export async function sendLoginNotificationEmail(
  user: { name: string; email: string },
  loginInfo: {
    device: string
    location: string
    ipAddress: string
  }
) {
  await sendEmail({
    to: user.email,
    subject: 'New Login to Your Account',
    template: (
      <LoginNotificationEmail
        name={user.name}
        email={user.email}
        device={loginInfo.device}
        location={loginInfo.location}
        ipAddress={loginInfo.ipAddress}
        loginTime={new Date()}
        securityUrl="https://app.example.com/account/security"
        companyName="Acme Corp"
        supportEmail="support@acme.com"
      />
    ),
  })
}

// Example 6: Send email with different language
export async function sendWelcomeEmailInSpanish(user: {
  name: string
  email: string
}) {
  await sendEmail({
    to: user.email,
    subject: '¡Bienvenido a nuestra plataforma!',
    template: (
      <WelcomeEmail
        name={user.name}
        email={user.email}
        loginUrl="https://app.example.com/login"
        language="es" // Spanish language
        companyName="Acme Corp"
        supportEmail="support@acme.com"
      />
    ),
  })
}
