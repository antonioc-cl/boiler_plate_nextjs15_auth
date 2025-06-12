// Route type definitions for the application

export type AuthRoute =
  | '/login'
  | '/signup'
  | '/forgot-password'
  | '/reset-password'
  | '/verify-email'

export type ProtectedRoute = '/dashboard' | '/profile' | '/settings'

export type PublicRoute = '/' | '/about' | '/contact'

export type AppRoute = AuthRoute | ProtectedRoute | PublicRoute

// Type guard functions
export function isAuthRoute(route: string): route is AuthRoute {
  return [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ].includes(route)
}

export function isProtectedRoute(route: string): route is ProtectedRoute {
  return ['/dashboard', '/profile', '/settings'].includes(route)
}

export function isPublicRoute(route: string): route is PublicRoute {
  return ['/', '/about', '/contact'].includes(route)
}
