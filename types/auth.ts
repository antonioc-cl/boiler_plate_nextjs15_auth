// Authentication related types

export interface AuthFormState {
  success: boolean
  error?: string
  message?: string
}

export interface UserData {
  id: string
  email: string
  username: string | null
  emailVerified: boolean
}

export interface GetCurrentUserResponse {
  success: boolean
  user: UserData | null
}

export interface EmailActionResponse {
  success: boolean
  error?: string
  message?: string
  retryAfter?: Date | number
}

// Form action state types
export type FormActionState = EmailActionResponse | null
