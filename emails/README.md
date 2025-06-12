# Email Templates

This directory contains React Email templates for transactional emails sent by the application using Plunk.

## Setup

1. **Environment Variables**: Add these to your `.env.local`:

   ```
   PLUNK_API_KEY=your-plunk-api-key
   PLUNK_FROM_EMAIL=noreply@yourdomain.com
   PLUNK_REPLY_TO_EMAIL=support@yourdomain.com
   NEXT_PUBLIC_APP_NAME=Your App Name
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

2. **Email Preview**: Run `pnpm email:dev` to preview email templates in development

## Available Templates

- **Welcome Email** (`welcome.tsx`): Sent when a new user signs up
- **Password Reset** (`password-reset.tsx`): Sent when user requests password reset
- **Email Verification** (`email-verification.tsx`): Sent to verify user email address
- **Password Changed** (`password-changed.tsx`): Confirmation when password is changed
- **Login Notification** (`login-notification.tsx`): Security notification for new logins

## Components

- `components/header.tsx` - Reusable email header with logo
- `components/footer.tsx` - Email footer with company info and links
- `components/button.tsx` - Styled call-to-action button
- `components/divider.tsx` - Horizontal divider

## Usage Example

```typescript
import { sendWelcomeEmail } from '@/lib/email/auth-emails'

// Send a welcome email
await sendWelcomeEmail(
  {
    id: user.id,
    email: user.email,
    username: user.username,
  },
  verificationUrl
)
```

Or using the lower-level API:

```typescript
import { sendEmail } from '@/lib/email'
import WelcomeEmail from '@/emails/welcome'

// Send a custom email
const result = await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  react: WelcomeEmail({
    email: 'user@example.com',
    name: 'John Doe',
    loginUrl: 'https://example.com/login',
    companyName: 'My Company',
  }),
})
```

## Translations

The email templates support multiple languages through the `translations/` directory. Pass the `language` prop to any template to use a different language.

## Creating New Templates

1. Create a new `.tsx` file in this directory
2. Import and use the reusable components from `components/`
3. Support translations by using the `t()` function
4. Export the component as default
5. Add helper functions to `/lib/email/auth-emails.ts` if needed

Example structure:

```tsx
import { Header, Footer, Button } from './components'
import { t, Language } from './translations'

interface YourEmailProps {
  language?: Language
  // Your other props
}

export const YourEmail: React.FC<YourEmailProps> = ({
  language = 'en',
  // other props
}) => {
  return (
    <Html>
      <Header />
      {/* Your content */}
      <Footer />
    </Html>
  )
}

export default YourEmail
```

## Testing

- Use `pnpm email:dev` to preview templates during development
- The preview server will hot-reload changes
- Test with different screen sizes to ensure responsive design
- Test with different languages if using translations

## Production Considerations

- Always test emails in production environment
- Monitor email delivery rates through Plunk dashboard
- Keep templates simple and compatible with various email clients
- Use inline styles for better compatibility
- Test across different email clients (Gmail, Outlook, Apple Mail, etc.)
