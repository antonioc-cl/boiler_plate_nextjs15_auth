import Plunk from '@plunk/node'

if (!process.env.PLUNK_API_KEY) {
  throw new Error('PLUNK_API_KEY is not defined in environment variables')
}

if (!process.env.PLUNK_FROM_EMAIL) {
  throw new Error('PLUNK_FROM_EMAIL is not defined in environment variables')
}

// Initialize Plunk client
export const plunkClient = new Plunk(process.env.PLUNK_API_KEY)

// Export configuration
export const emailConfig = {
  from: process.env.PLUNK_FROM_EMAIL,
  replyTo: process.env.PLUNK_REPLY_TO_EMAIL || process.env.PLUNK_FROM_EMAIL,
} as const

// Type definitions for email sending
export interface EmailOptions {
  to: string | string[]
  subject: string
  body: string
  from?: string
  replyTo?: string
  headers?: Record<string, string>
}

export interface EmailTemplate {
  subject: string
  body: string
}
