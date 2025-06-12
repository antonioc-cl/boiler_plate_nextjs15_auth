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

export interface LoginNotificationEmailProps {
  name?: string | undefined
  email: string
  device?: string | undefined
  location?: string | undefined
  ipAddress?: string | undefined
  loginTime?: Date | undefined
  securityUrl: string
  companyName?: string | undefined
  logoUrl?: string | undefined
  supportEmail?: string | undefined
  companyAddress?: string | undefined
  unsubscribeUrl?: string | undefined
  privacyUrl?: string | undefined
  termsUrl?: string | undefined
  language?: Language | undefined
}

export const LoginNotificationEmail = ({
  name = 'there',
  device = 'Unknown Device',
  location = 'Unknown Location',
  ipAddress = 'Unknown IP',
  loginTime = new Date(),
  securityUrl,
  companyName = 'Your Company',
  logoUrl,
  supportEmail = 'support@example.com',
  companyAddress,
  unsubscribeUrl,
  privacyUrl,
  termsUrl,
  language = 'en',
}: LoginNotificationEmailProps) => {
  const preview = t('loginNotification.preview', language, { companyName })

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Header logoUrl={logoUrl} companyName={companyName} />

          <Section style={content}>
            <Heading style={heading}>
              {t('loginNotification.title', language)}
            </Heading>

            <Text style={paragraph}>
              {t('common.hello', language)} {name},
            </Text>

            <Text style={paragraph}>
              {t('loginNotification.body', language, { companyName })}
            </Text>

            <Section style={detailsBox}>
              <Text style={detailsTitle}>
                {t('loginNotification.details', language)}
              </Text>
              <Text style={detailItem}>
                <strong>{t('loginNotification.device', language)}:</strong>{' '}
                {device}
              </Text>
              <Text style={detailItem}>
                <strong>{t('loginNotification.location', language)}:</strong>{' '}
                {location}
              </Text>
              <Text style={detailItem}>
                <strong>{t('loginNotification.ipAddress', language)}:</strong>{' '}
                {ipAddress}
              </Text>
              <Text style={detailItem}>
                <strong>{t('loginNotification.time', language)}:</strong>{' '}
                {loginTime.toLocaleString()}
              </Text>
            </Section>

            <Divider spacing="medium" />

            <Text style={warningText}>
              {t('loginNotification.warning', language)}
            </Text>

            <Section style={buttonContainer}>
              <Button href={securityUrl}>
                {t('loginNotification.cta', language)}
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
;(LoginNotificationEmail as any).PreviewProps = {
  name: 'John',
  email: 'john@example.com',
  device: 'Chrome on Windows',
  location: 'San Francisco, CA, USA',
  ipAddress: '192.168.1.1',
  loginTime: new Date(),
  securityUrl: 'https://example.com/account/security',
  companyName: 'Acme Corp',
  supportEmail: 'support@acme.com',
} as LoginNotificationEmailProps

export default LoginNotificationEmail

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

const detailsBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  border: '1px solid #e5e7eb',
}

const detailsTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#000000',
  margin: '0 0 16px 0',
}

const detailItem = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#666666',
  margin: '0 0 8px 0',
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
