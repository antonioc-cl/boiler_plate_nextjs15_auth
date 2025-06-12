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
import { Divider } from './components/divider'
import { t, Language } from './translations'

export interface PasswordChangedEmailProps {
  name?: string
  email: string
  securityUrl: string
  changedAt?: Date
  companyName?: string
  logoUrl?: string
  supportEmail?: string
  companyAddress?: string
  unsubscribeUrl?: string
  privacyUrl?: string
  termsUrl?: string
  language?: Language
}

export const PasswordChangedEmail = ({
  name = 'there',
  email,
  securityUrl,
  changedAt = new Date(),
  companyName = 'Your Company',
  logoUrl,
  supportEmail = 'support@example.com',
  companyAddress,
  unsubscribeUrl,
  privacyUrl,
  termsUrl,
  language = 'en',
}: PasswordChangedEmailProps) => {
  const preview = t('passwordChanged.preview', language, { companyName })

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Header logoUrl={logoUrl} companyName={companyName} />

          <Section style={content}>
            <Heading style={heading}>
              {t('passwordChanged.title', language)}
            </Heading>

            <Text style={paragraph}>
              {t('common.hello', language)} {name},
            </Text>

            <Text style={paragraph}>
              {t('passwordChanged.body', language, { companyName, email })}
            </Text>

            <Section style={infoBox}>
              <Text style={infoText}>
                Changed on: {changedAt.toLocaleString()}
              </Text>
            </Section>

            <Divider spacing="medium" />

            <Text style={warningText}>
              {t('passwordChanged.warning', language)}
            </Text>

            <Section style={buttonContainer}>
              <Button href={securityUrl}>
                {t('passwordChanged.cta', language)}
              </Button>
            </Section>

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
;(PasswordChangedEmail as any).PreviewProps = {
  name: 'John',
  email: 'john@example.com',
  securityUrl: 'https://example.com/account/security',
  changedAt: new Date(),
  companyName: 'Acme Corp',
  supportEmail: 'support@acme.com',
} as PasswordChangedEmailProps

export default PasswordChangedEmail

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
  fontSize: '16px',
  lineHeight: '26px',
  color: '#d73502',
  margin: '16px 0',
  fontWeight: '600',
  textAlign: 'center' as const,
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const infoBox = {
  backgroundColor: '#f5f5f5',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 0',
}

const infoText = {
  fontSize: '14px',
  color: '#666666',
  margin: '0',
  textAlign: 'center' as const,
}
