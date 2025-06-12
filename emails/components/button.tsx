import { Button as EmailButton } from '@react-email/components'
import * as React from 'react'

interface ButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({
  href,
  children,
  variant = 'primary',
}) => {
  const styles = {
    primary: {
      backgroundColor: '#000000',
      color: '#ffffff',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      padding: '12px 24px',
      textDecoration: 'none',
      display: 'inline-block',
    },
    secondary: {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      padding: '12px 24px',
      textDecoration: 'none',
      display: 'inline-block',
      border: '1px solid #e5e5e5',
    },
  }

  return (
    <EmailButton href={href} style={styles[variant]}>
      {children}
    </EmailButton>
  )
}
