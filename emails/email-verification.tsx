import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import { Button } from './components/button'
import { Footer } from './components/footer'
import { Header } from './components/header'
import { t, Language } from './translations'

export interface EmailVerificationProps {
  name?: string
  email: string
  verificationUrl: string
  expirationHours?: number
  companyName?: string
  logoUrl?: string
  supportEmail?: string
  companyAddress?: string
  unsubscribeUrl?: string
  privacyUrl?: string
  termsUrl?: string
  language?: Language
}

export const EmailVerificationEmail = ({
  name = 'there',
  verificationUrl,
  expirationHours = 48,
  companyName = 'Your Company',
  logoUrl,
  supportEmail = 'support@example.com',
  companyAddress,
  unsubscribeUrl,
  privacyUrl,
  termsUrl,
  language = 'en',
}: EmailVerificationProps) => {
  const preview = t('emailVerification.preview', language, { companyName })

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Header logoUrl={logoUrl} companyName={companyName} />

          <Section style={content}>
            <Heading style={heading}>
              {t('emailVerification.title', language)}
            </Heading>

            <Text style={paragraph}>
              {t('common.hello', language)} {name},
            </Text>

            <Text style={paragraph}>
              {t('emailVerification.body', language, { companyName })}
            </Text>

            <Section style={buttonContainer}>
              <Button href={verificationUrl}>
                {t('emailVerification.cta', language)}
              </Button>
            </Section>

            <Text style={warningText}>
              {t('emailVerification.expire', language, {
                hours: String(expirationHours),
              })}
            </Text>

            <Text style={paragraph}>
              {t('common.regards', language)},
              <br />
              {t('common.team', language, { companyName })}
            </Text>
          </Section>

          <Footer
            companyName={companyName}
            companyAddress={companyAddress}
            supportEmail={supportEmail}
            unsubscribeUrl={unsubscribeUrl}
            privacyUrl={privacyUrl}
            termsUrl={termsUrl}
          />
        </Container>
      </Body>
    </Html>
  )
}
;(EmailVerificationEmail as any).PreviewProps = {
  name: 'John',
  email: 'john@example.com',
  verificationUrl: 'https://example.com/verify-email?token=abc123',
  expirationHours: 48,
  companyName: 'Acme Corp',
  supportEmail: 'support@acme.com',
} as EmailVerificationProps

export default EmailVerificationEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  maxWidth: '600px',
}

const content = {
  padding: '0 48px',
}

const heading = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#000000',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333333',
  margin: '0 0 16px 0',
}

const warningText = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#666666',
  margin: '16px 0',
  textAlign: 'center' as const,
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}
