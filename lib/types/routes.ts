// Route types and constants
export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Public routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const

// Type for all route values
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

// Type guards
export function isValidRoute(route: string): route is AppRoute {
  return Object.values(ROUTES).includes(route as AppRoute)
}

// Route groups
export const ROUTE_GROUPS = {
  AUTH: [
    'login',
    'signup',
    'forgot-password',
    'reset-password',
    'verify-email',
  ],
  PROTECTED: ['dashboard', 'profile', 'settings'],
  PUBLIC: ['/', 'about', 'contact'],
} as const
