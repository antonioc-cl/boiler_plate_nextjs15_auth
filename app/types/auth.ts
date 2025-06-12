export interface AuthResult {
  success: boolean
  error?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
}
