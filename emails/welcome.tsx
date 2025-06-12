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

export interface WelcomeEmailProps {
  name?: string
  email: string
  loginUrl: string
  companyName?: string
  logoUrl?: string
  supportEmail?: string
  companyAddress?: string
  unsubscribeUrl?: string
  privacyUrl?: string
  termsUrl?: string
  language?: Language
}

export const WelcomeEmail = ({
  name = 'there',
  email: _email,
  loginUrl,
  companyName = 'Your Company',
  logoUrl,
  supportEmail = 'support@example.com',
  companyAddress,
  unsubscribeUrl,
  privacyUrl,
  termsUrl,
  language = 'en',
}: WelcomeEmailProps) => {
  const preview = t('welcome.preview', language, { companyName })

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Header logoUrl={logoUrl} companyName={companyName} />

          <Section style={content}>
            <Heading style={heading}>{t('welcome.title', language)}</Heading>

            <Text style={paragraph}>
              {t('common.hello', language)} {name},
            </Text>

            <Text style={paragraph}>
              {t('welcome.body', language, { companyName })}
            </Text>

            <Section style={buttonContainer}>
              <Button href={loginUrl}>{t('welcome.cta', language)}</Button>
            </Section>

            <Text style={paragraph}>{t('welcome.helpText', language)}</Text>

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
;(WelcomeEmail as any).PreviewProps = {
  name: 'John',
  email: 'john@example.com',
  loginUrl: 'https://example.com/login',
  companyName: 'Acme Corp',
  supportEmail: 'support@acme.com',
} as WelcomeEmailProps

export default WelcomeEmail

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

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}
