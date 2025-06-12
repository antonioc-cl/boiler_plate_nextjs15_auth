// Simple translation system for email templates
// This can be expanded to support more languages and integrate with i18n libraries

export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ja' | 'zh'

export interface TranslationKeys {
  // Common
  'common.hello': string
  'common.regards': string
  'common.team': string
  'common.support': string
  'common.privacyPolicy': string
  'common.termsOfService': string
  'common.unsubscribe': string
  'common.allRightsReserved': string

  // Welcome email
  'welcome.subject': string
  'welcome.preview': string
  'welcome.title': string
  'welcome.body': string
  'welcome.cta': string
  'welcome.helpText': string

  // Password reset
  'passwordReset.subject': string
  'passwordReset.preview': string
  'passwordReset.title': string
  'passwordReset.body': string
  'passwordReset.cta': string
  'passwordReset.expire': string
  'passwordReset.ignore': string

  // Password changed
  'passwordChanged.subject': string
  'passwordChanged.preview': string
  'passwordChanged.title': string
  'passwordChanged.body': string
  'passwordChanged.warning': string
  'passwordChanged.cta': string

  // Email verification
  'emailVerification.subject': string
  'emailVerification.preview': string
  'emailVerification.title': string
  'emailVerification.body': string
  'emailVerification.cta': string
  'emailVerification.expire': string

  // Login notification
  'loginNotification.subject': string
  'loginNotification.preview': string
  'loginNotification.title': string
  'loginNotification.body': string
  'loginNotification.details': string
  'loginNotification.device': string
  'loginNotification.location': string
  'loginNotification.ipAddress': string
  'loginNotification.time': string
  'loginNotification.warning': string
  'loginNotification.cta': string
}

const enTranslations: TranslationKeys = {
  // Common
  'common.hello': 'Hello',
  'common.regards': 'Best regards',
  'common.team': 'The {{companyName}} Team',
  'common.support': 'Need help? Contact us at',
  'common.privacyPolicy': 'Privacy Policy',
  'common.termsOfService': 'Terms of Service',
  'common.unsubscribe': 'Unsubscribe from these emails',
  'common.allRightsReserved': 'All rights reserved',

  // Welcome email
  'welcome.subject': 'Welcome to {{companyName}}!',
  'welcome.preview':
    'Thank you for joining us. Get started with your new account.',
  'welcome.title': 'Welcome aboard!',
  'welcome.body':
    "We're excited to have you join {{companyName}}. Your account has been successfully created and you're ready to get started.",
  'welcome.cta': 'Get Started',
  'welcome.helpText':
    'If you have any questions, feel free to reply to this email or visit our help center.',

  // Password reset
  'passwordReset.subject': 'Reset your password',
  'passwordReset.preview':
    'You requested a password reset for your {{companyName}} account.',
  'passwordReset.title': 'Password Reset Request',
  'passwordReset.body':
    'You recently requested to reset your password for your {{companyName}} account. Click the button below to reset it.',
  'passwordReset.cta': 'Reset Password',
  'passwordReset.expire':
    'This password reset link will expire in {{hours}} hours.',
  'passwordReset.ignore':
    'If you did not request a password reset, please ignore this email or contact support if you have concerns.',

  // Password changed
  'passwordChanged.subject': 'Your password has been changed',
  'passwordChanged.preview':
    'Your {{companyName}} account password was successfully changed.',
  'passwordChanged.title': 'Password Changed Successfully',
  'passwordChanged.body':
    'This is a confirmation that the password for your {{companyName}} account {{email}} has been successfully changed.',
  'passwordChanged.warning':
    'If you did not make this change, please secure your account immediately.',
  'passwordChanged.cta': 'Secure My Account',

  // Email verification
  'emailVerification.subject': 'Verify your email address',
  'emailVerification.preview':
    'Please verify your email address to complete your {{companyName}} account setup.',
  'emailVerification.title': 'Verify Your Email',
  'emailVerification.body':
    'Thanks for signing up for {{companyName}}! Please verify your email address by clicking the button below.',
  'emailVerification.cta': 'Verify Email Address',
  'emailVerification.expire':
    'This verification link will expire in {{hours}} hours.',

  // Login notification
  'loginNotification.subject': 'New login to your account',
  'loginNotification.preview':
    'We detected a new login to your {{companyName}} account.',
  'loginNotification.title': 'New Login Detected',
  'loginNotification.body':
    'We noticed a new login to your {{companyName}} account. If this was you, you can safely ignore this email.',
  'loginNotification.details': 'Login Details:',
  'loginNotification.device': 'Device',
  'loginNotification.location': 'Location',
  'loginNotification.ipAddress': 'IP Address',
  'loginNotification.time': 'Time',
  'loginNotification.warning':
    "If this wasn't you, please secure your account immediately.",
  'loginNotification.cta': 'Review Account Activity',
}

const translations: Record<Language, TranslationKeys> = {
  en: enTranslations,
  // Placeholder for other languages - you can expand these later
  es: enTranslations, // Fallback to English
  fr: enTranslations, // Fallback to English
  de: enTranslations, // Fallback to English
  pt: enTranslations, // Fallback to English
  ja: enTranslations, // Fallback to English
  zh: enTranslations, // Fallback to English
}

// Simple template replacement function
export function interpolate(
  template: string,
  values: Record<string, string>
): string {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (match, key) => values[key] || match
  )
}

// Translation function
export function t(
  key: keyof TranslationKeys,
  language: Language = 'en',
  values?: Record<string, string>
): string {
  const translation =
    translations[language]?.[key] || translations.en[key] || key
  return values ? interpolate(translation, values) : translation
}

// Get all translations for a language
export function getTranslations(language: Language = 'en'): TranslationKeys {
  return translations[language] || translations.en
}
