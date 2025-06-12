import { render } from '@react-email/render'
import { plunkClient, emailConfig, type EmailOptions } from './client'
import { ReactElement } from 'react'

export interface SendEmailParams {
  to: string | string[]
  subject: string
  react: ReactElement
  from?: string
  replyTo?: string
  headers?: Record<string, string>
}

export interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send an email using Plunk with a React Email template
 * @param params Email parameters including recipient, subject, and React component
 * @returns Promise with success status and message ID or error
 */
export async function sendEmail({
  to,
  subject,
  react,
  from = emailConfig.from,
}: SendEmailParams): Promise<SendEmailResult> {
  try {
    // Render the React component to HTML
    const html = await render(react)

    // Send email via Plunk
    await plunkClient.emails.send({
      to: Array.isArray(to) ? to : [to],
      subject,
      body: html,
      type: 'html',
      from,
    })

    // Email sent successfully

    return {
      success: true,
      messageId: 'email_sent', // Plunk doesn't return an ID in the response
    }
  } catch (error) {
    // Error occurred during email send

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Send a plain text email using Plunk
 * @param options Email options including recipient, subject, and body
 * @returns Promise with success status and message ID or error
 */
export async function sendPlainTextEmail(
  options: EmailOptions
): Promise<SendEmailResult> {
  try {
    await plunkClient.emails.send({
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      body: options.body,
      type: 'html',
      from: options.from || emailConfig.from,
    })

    // Plain text email sent successfully

    return {
      success: true,
      messageId: 'email_sent', // Plunk doesn't return an ID in the response
    }
  } catch (error) {
    // Error occurred during plain text email send

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Send a batch of emails using Plunk
 * @param emails Array of email parameters
 * @returns Promise with array of results for each email
 */
export async function sendBatchEmails(
  emails: SendEmailParams[]
): Promise<SendEmailResult[]> {
  const results = await Promise.all(emails.map((email) => sendEmail(email)))

  // Batch email send completed

  return results
}
