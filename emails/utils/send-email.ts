import { render } from '@react-email/components'
import type { ReactElement } from 'react'

/**
 * Email sending utility
 * This is a placeholder for actual email sending logic.
 * In production, you would integrate with services like:
 * - SendGrid
 * - AWS SES
 * - Postmark
 * - Resend
 * - etc.
 */

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  template: ReactElement
  from?: string
  replyTo?: string
}

/**
 * Renders an email template to HTML
 */
export async function renderEmailTemplate(
  template: ReactElement
): Promise<string> {
  return render(template)
}

/**
 * Renders an email template to plain text
 */
export async function renderEmailTemplateText(
  template: ReactElement
): Promise<string> {
  return render(template, { plainText: true })
}

/**
 * Send an email
 * This is a placeholder function - implement with your preferred email service
 */
export async function sendEmail({
  to,
  subject,
  template,
  from = 'noreply@example.com',
  replyTo,
}: SendEmailOptions): Promise<void> {
  const html = await renderEmailTemplate(template)
  const text = await renderEmailTemplateText(template)

  // Example implementation with a hypothetical email service
  // Replace this with your actual email service integration

  // Email would be sent here with the provided configuration
  // Replace this comment with your actual email service integration

  // TODO: Use the prepared email data
  void { to, subject, html, text, from, replyTo }

  // Example with SendGrid:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send({
  //   to,
  //   from,
  //   replyTo,
  //   subject,
  //   html,
  //   text,
  // });

  // Example with AWS SES:
  // const ses = new AWS.SES({ region: 'us-east-1' });
  // await ses.sendEmail({
  //   Source: from,
  //   Destination: { ToAddresses: Array.isArray(to) ? to : [to] },
  //   ReplyToAddresses: replyTo ? [replyTo] : undefined,
  //   Message: {
  //     Subject: { Data: subject },
  //     Body: {
  //       Html: { Data: html },
  //       Text: { Data: text },
  //     },
  //   },
  // }).promise();

  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from,
  //   to,
  //   subject,
  //   html,
  //   text,
  //   reply_to: replyTo,
  // });
}
