# Email Service Integration

This directory contains the Plunk email service integration for sending transactional emails.

## Structure

- `client.ts` - Plunk client configuration and initialization
- `send-email.ts` - Core functions for sending emails with React Email templates
- `auth-emails.ts` - Authentication-specific email functions (welcome, password reset, etc.)
- `examples.ts` - Usage examples for custom email implementations
- `types.ts` - TypeScript type definitions for email data
- `index.ts` - Main exports for the email service

## Quick Start

### Send an authentication email:

```typescript
import { sendWelcomeEmail } from '@/lib/email/auth-emails'

await sendWelcomeEmail(
  { id: 'user123', email: 'user@example.com', username: 'johndoe' },
  'https://example.com/verify?token=abc123'
)
```

### Send a custom email:

```typescript
import { sendEmail } from '@/lib/email'
import MyCustomEmail from '@/emails/my-custom-email'

await sendEmail({
  to: 'user@example.com',
  subject: 'Custom Email Subject',
  react: MyCustomEmail({
    /* props */
  }),
})
```

## Environment Variables

Required environment variables:

```env
PLUNK_API_KEY=your-plunk-api-key
PLUNK_FROM_EMAIL=noreply@yourdomain.com
PLUNK_REPLY_TO_EMAIL=support@yourdomain.com  # Optional
```

## Features

- React Email template support
- Batch email sending
- Error handling and logging
- TypeScript support
- Authentication email helpers
- Responsive email templates

## Email Templates

Email templates are located in `/emails/` directory. See the [Email Templates README](/emails/README.md) for more information on creating and customizing templates.

## Error Handling

All email functions return a result object:

```typescript
{
  success: boolean;
  messageId?: string;
  error?: string;
}
```

Always check the `success` property before proceeding:

```typescript
const result = await sendEmail({ ... });

if (!result.success) {
  console.error('Email failed:', result.error);
  // Handle error appropriately
}
```

## Testing

Use the email preview server to test templates during development:

```bash
pnpm email:dev
```

This will start a local server where you can preview all email templates with hot reload.
