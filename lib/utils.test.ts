import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('base-class', 'additional-class')
      expect(result).toBe('base-class additional-class')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', {
        active: true,
        inactive: false,
      })
      expect(result).toBe('base active')
    })

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should override tailwind classes correctly', () => {
      const result = cn('px-4 py-2', 'px-8')
      expect(result).toBe('py-2 px-8')
    })

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'final')
      expect(result).toBe('base final')
    })

    it('should handle empty strings', () => {
      const result = cn('', 'class1', '', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle complex tailwind overrides', () => {
      const result = cn(
        'bg-red-500 hover:bg-red-600',
        'bg-blue-500 hover:bg-blue-600'
      )
      expect(result).toBe('bg-blue-500 hover:bg-blue-600')
    })

    it('should handle responsive classes', () => {
      const result = cn('text-sm md:text-base', 'md:text-lg lg:text-xl')
      expect(result).toBe('text-sm md:text-lg lg:text-xl')
    })

    it('should return empty string when no arguments', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle boolean false values', () => {
      const result = cn('base', false && 'conditional', 'end')
      expect(result).toBe('base end')
    })
  })
})
