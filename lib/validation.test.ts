import { describe, it, expect } from 'vitest'
import * as z from 'zod'

// Example validation schemas that might be used in the app
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

// Validation helper functions
export function validateEmail(email: string): {
  success: boolean
  error?: string
} {
  try {
    emailSchema.parse(email)
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Invalid email',
      }
    }
    return { success: false, error: 'Invalid email' }
  }
}

export function validatePassword(password: string): {
  success: boolean
  errors?: string[]
} {
  try {
    passwordSchema.parse(password)
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors.map((e) => e.message) }
    }
    return { success: false, errors: ['Invalid password'] }
  }
}

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'test123@subdomain.example.com',
      ]

      validEmails.forEach((email) => {
        expect(() => emailSchema.parse(email)).not.toThrow()
      })
    })

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'test@',
        'test@.com',
        'test@@example.com',
        'test @example.com',
        '',
      ]

      invalidEmails.forEach((email) => {
        expect(() => emailSchema.parse(email)).toThrow(
          'Please enter a valid email address'
        )
      })
    })
  })

  describe('passwordSchema', () => {
    it('should validate strong passwords', () => {
      const validPasswords = [
        'Password1',
        'Test123ABC',
        'MyP@ssw0rd',
        'Complex1Password!',
      ]

      validPasswords.forEach((password) => {
        expect(() => passwordSchema.parse(password)).not.toThrow()
      })
    })

    it('should reject passwords shorter than 8 characters', () => {
      expect(() => passwordSchema.parse('Pass1')).toThrow(
        'Password must be at least 8 characters'
      )
    })

    it('should reject passwords without uppercase letters', () => {
      expect(() => passwordSchema.parse('password123')).toThrow(
        'Password must contain at least one uppercase letter'
      )
    })

    it('should reject passwords without lowercase letters', () => {
      expect(() => passwordSchema.parse('PASSWORD123')).toThrow(
        'Password must contain at least one lowercase letter'
      )
    })

    it('should reject passwords without numbers', () => {
      expect(() => passwordSchema.parse('PasswordABC')).toThrow(
        'Password must contain at least one number'
      )
    })

    it('should provide all validation errors for completely invalid password', () => {
      try {
        passwordSchema.parse('pass')
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.errors).toHaveLength(3) // too short, no uppercase, no number
          expect(error.errors.map((e) => e.message)).toContain(
            'Password must be at least 8 characters'
          )
          expect(error.errors.map((e) => e.message)).toContain(
            'Password must contain at least one uppercase letter'
          )
          expect(error.errors.map((e) => e.message)).toContain(
            'Password must contain at least one number'
          )
        }
      }
    })
  })

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }

      expect(() => loginSchema.parse(validData)).not.toThrow()
    })

    it('should reject invalid email in login data', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      }

      expect(() => loginSchema.parse(invalidData)).toThrow()
    })

    it('should reject short password in login data', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
      }

      expect(() => loginSchema.parse(invalidData)).toThrow(
        'Password must be at least 8 characters'
      )
    })
  })

  describe('signupSchema', () => {
    it('should validate correct signup data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      }

      expect(() => signupSchema.parse(validData)).not.toThrow()
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword123',
      }

      try {
        signupSchema.parse(invalidData)
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.errors[0]?.message).toBe("Passwords don't match")
          expect(error.errors[0]?.path).toContain('confirmPassword')
        }
      }
    })

    it('should validate all fields independently', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'weak',
        confirmPassword: 'weak',
      }

      try {
        signupSchema.parse(invalidData)
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.errors.length).toBeGreaterThan(1)
        }
      }
    })
  })

  describe('Validation Helper Functions', () => {
    describe('validateEmail', () => {
      it('should return success for valid emails', () => {
        const result = validateEmail('test@example.com')
        expect(result.success).toBe(true)
        expect(result.error).toBeUndefined()
      })

      it('should return error for invalid emails', () => {
        const result = validateEmail('invalid-email')
        expect(result.success).toBe(false)
        expect(result.error).toBe('Please enter a valid email address')
      })

      it('should handle empty strings', () => {
        const result = validateEmail('')
        expect(result.success).toBe(false)
        expect(result.error).toBe('Please enter a valid email address')
      })
    })

    describe('validatePassword', () => {
      it('should return success for strong passwords', () => {
        const result = validatePassword('Password123')
        expect(result.success).toBe(true)
        expect(result.errors).toBeUndefined()
      })

      it('should return all errors for weak passwords', () => {
        const result = validatePassword('weak')
        expect(result.success).toBe(false)
        expect(result.errors).toBeDefined()
        expect(result.errors?.length).toBeGreaterThan(0)
      })

      it('should return specific error messages', () => {
        const result = validatePassword('password')
        expect(result.success).toBe(false)
        expect(result.errors).toContain(
          'Password must contain at least one uppercase letter'
        )
        expect(result.errors).toContain(
          'Password must contain at least one number'
        )
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long passwords', () => {
      const longPassword = 'A'.repeat(100) + 'a1'
      expect(() => passwordSchema.parse(longPassword)).not.toThrow()
    })

    it('should handle unicode characters in email', () => {
      // Most email validators don't support unicode
      expect(() => emailSchema.parse('test@例え.jp')).toThrow()
    })

    it('should handle special characters in passwords', () => {
      const specialPassword = 'P@ssw0rd!#$%'
      expect(() => passwordSchema.parse(specialPassword)).not.toThrow()
    })

    it('should trim whitespace in validation', () => {
      // Note: This behavior depends on implementation
      // You might want to add .trim() to your schemas
      const dataWithSpaces = {
        email: ' test@example.com ',
        password: 'Password123',
        confirmPassword: 'Password123',
      }

      // This test assumes no automatic trimming
      expect(() => signupSchema.parse(dataWithSpaces)).toThrow()
    })
  })
})
