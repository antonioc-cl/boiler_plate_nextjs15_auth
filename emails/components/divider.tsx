import { Hr } from '@react-email/components'
import * as React from 'react'

interface DividerProps {
  spacing?: 'small' | 'medium' | 'large'
}

export const Divider: React.FC<DividerProps> = ({ spacing = 'medium' }) => {
  const spacingMap = {
    small: '16px',
    medium: '32px',
    large: '48px',
  }

  return (
    <Hr
      style={{
        borderColor: '#e5e5e5',
        margin: `${spacingMap[spacing]} 0`,
      }}
    />
  )
}
