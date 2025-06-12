// Export all email templates
export { WelcomeEmail } from './welcome'
export { PasswordResetEmail } from './password-reset'
export { PasswordChangedEmail } from './password-changed'
export { EmailVerificationEmail } from './email-verification'
export { LoginNotificationEmail } from './login-notification'

// Export types
export type { WelcomeEmailProps } from './welcome'
export type { PasswordResetEmailProps } from './password-reset'
export type { PasswordChangedEmailProps } from './password-changed'
export type { EmailVerificationProps } from './email-verification'
export type { LoginNotificationEmailProps } from './login-notification'

// Export components
export { Button } from './components/button'
export { Header } from './components/header'
export { Footer } from './components/footer'
export { Divider } from './components/divider'

// Export translation utilities
export { t, interpolate, getTranslations, type Language } from './translations'
