import { Img, Section, Text } from '@react-email/components'
import * as React from 'react'

interface HeaderProps {
  logoUrl?: string | undefined
  logoAlt?: string | undefined
  companyName?: string | undefined
}

export const Header: React.FC<HeaderProps> = ({
  logoUrl,
  logoAlt = 'Company Logo',
  companyName = 'Your Company',
}) => {
  return (
    <Section style={sectionStyle}>
      {logoUrl ? (
        <Img
          src={logoUrl}
          alt={logoAlt}
          width={150}
          height={50}
          style={logoStyle}
        />
      ) : (
        <Text style={companyNameStyle}>{companyName}</Text>
      )}
    </Section>
  )
}

const sectionStyle = {
  textAlign: 'center' as const,
  padding: '40px 0 20px 0',
}

const logoStyle = {
  margin: '0 auto',
}

const companyNameStyle = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#000000',
  margin: '0',
  padding: '0',
}
