import { Hr, Link, Section, Text } from '@react-email/components'
import * as React from 'react'

interface FooterProps {
  companyName?: string | undefined
  companyAddress?: string | undefined
  unsubscribeUrl?: string | undefined
  supportEmail?: string | undefined
  privacyUrl?: string | undefined
  termsUrl?: string | undefined
}

export const Footer: React.FC<FooterProps> = ({
  companyName = 'Your Company',
  companyAddress = '123 Main St, City, State 12345',
  unsubscribeUrl,
  supportEmail = 'support@example.com',
  privacyUrl,
  termsUrl,
}) => {
  return (
    <>
      <Hr style={hrStyle} />
      <Section style={footerStyle}>
        <Text style={companyStyle}>{companyName}</Text>
        <Text style={addressStyle}>{companyAddress}</Text>

        <Text style={linksStyle}>
          {supportEmail && (
            <>
              Need help? Contact us at{' '}
              <Link href={`mailto:${supportEmail}`} style={linkStyle}>
                {supportEmail}
              </Link>
            </>
          )}
        </Text>

        <Text style={linksStyle}>
          {privacyUrl && (
            <>
              <Link href={privacyUrl} style={linkStyle}>
                Privacy Policy
              </Link>
              {termsUrl && ' • '}
            </>
          )}
          {termsUrl && (
            <Link href={termsUrl} style={linkStyle}>
              Terms of Service
            </Link>
          )}
        </Text>

        {unsubscribeUrl && (
          <Text style={unsubscribeStyle}>
            <Link href={unsubscribeUrl} style={unsubscribeLinkStyle}>
              Unsubscribe from these emails
            </Link>
          </Text>
        )}

        <Text style={copyrightStyle}>
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </Text>
      </Section>
    </>
  )
}

const hrStyle = {
  borderColor: '#e5e5e5',
  margin: '40px 0 20px 0',
}

const footerStyle = {
  textAlign: 'center' as const,
  padding: '20px 0 40px 0',
}

const companyStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#000000',
  margin: '0 0 4px 0',
}

const addressStyle = {
  fontSize: '14px',
  color: '#666666',
  margin: '0 0 20px 0',
}

const linksStyle = {
  fontSize: '14px',
  color: '#666666',
  margin: '0 0 8px 0',
}

const linkStyle = {
  color: '#000000',
  textDecoration: 'underline',
}

const unsubscribeStyle = {
  fontSize: '12px',
  color: '#999999',
  margin: '20px 0 8px 0',
}

const unsubscribeLinkStyle = {
  color: '#999999',
  textDecoration: 'underline',
}

const copyrightStyle = {
  fontSize: '12px',
  color: '#999999',
  margin: '8px 0 0 0',
}
