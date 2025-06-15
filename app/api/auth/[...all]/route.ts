import { auth } from '@/lib/auth/better-auth'
import { toNextJsHandler } from 'better-auth/next-js'
import '@/lib/auth/email' // Ensure email configuration is loaded

export const { GET, POST } = toNextJsHandler(auth)
