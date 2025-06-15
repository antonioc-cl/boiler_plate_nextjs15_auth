import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth/better-auth'

// Constants
const SESSION_COOKIE_NAME = 'better-auth-session' // Better Auth's session cookie name
const PROTECTED_ROUTE_GROUP = '/(protected)'
const AUTH_ROUTE_GROUP = '/(auth)'
const DEFAULT_LOGIN_REDIRECT = '/dashboard'
const LOGIN_ROUTE = '/login'

// Performance optimization: Skip session validation for certain paths
const SKIP_SESSION_VALIDATION_PATHS = [
  '/api/auth/', // Better Auth's own routes
  '/_next/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
]

// Type definitions
type MiddlewareResponse = NextResponse

interface RouteConfig {
  protectedRoutes: string[]
  authRoutes: string[]
  publicRoutes: string[]
}

// Route configuration - add specific routes here if needed
const routeConfig: RouteConfig = {
  protectedRoutes: ['/dashboard', '/profile', '/settings'],
  authRoutes: [
    '/login',
    '/signup',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ],
  publicRoutes: ['/', '/about', '/contact'],
}

/**
 * Check if pathname matches a route group pattern
 */
function isRouteGroup(pathname: string, group: string): boolean {
  // Remove the group syntax for checking
  const groupPath = group.replace(/[()]/g, '')
  return pathname.startsWith(`/${groupPath}/`) || pathname === `/${groupPath}`
}

/**
 * Check if pathname matches any specific route in the list
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route))
}

/**
 * Validate callback URL to prevent open redirects
 */
function isValidCallbackUrl(callbackUrl: string, requestUrl: string): boolean {
  try {
    const url = new URL(callbackUrl, requestUrl)
    const requestUrlObj = new URL(requestUrl)
    return url.origin === requestUrlObj.origin
  } catch {
    return false
  }
}

/**
 * Validate session using Better Auth
 * Returns true if session is valid, false otherwise
 */
async function validateSession(request: NextRequest): Promise<boolean> {
  try {
    // Quick check: if no session cookie exists, skip validation
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
    if (!sessionCookie?.value) {
      return false
    }

    // Convert NextRequest headers to standard Headers for Better Auth
    const headers = new Headers()
    request.headers.forEach((value, key) => {
      headers.append(key, value)
    })

    // Add cookies to headers for Better Auth
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
      headers.set('cookie', cookieHeader)
    }

    // Get session from Better Auth
    const session = await auth.api.getSession({ headers })
    return !!session
  } catch (error) {
    // Session validation failed, treat as no session
    console.error('Session validation error:', error)
    return false
  }
}

/**
 * Next.js middleware function
 * Runs before every request to check authentication status
 * Integrated with Better Auth for session management
 */
export async function middleware(
  request: NextRequest
): Promise<MiddlewareResponse> {
  const { pathname, searchParams } = request.nextUrl

  // Performance optimization: Skip middleware for certain paths
  if (
    SKIP_SESSION_VALIDATION_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next()
  }

  // Determine route type
  const isProtectedRoute =
    isRouteGroup(pathname, PROTECTED_ROUTE_GROUP) ||
    matchesRoute(pathname, routeConfig.protectedRoutes)

  const isAuthRoute =
    isRouteGroup(pathname, AUTH_ROUTE_GROUP) ||
    matchesRoute(pathname, routeConfig.authRoutes)

  // Only validate session if we're on a protected or auth route
  const needsSessionCheck = isProtectedRoute || isAuthRoute
  let hasValidSession = false

  if (needsSessionCheck) {
    hasValidSession = await validateSession(request)
  }

  // Handle protected routes - redirect to login if no valid session
  if (isProtectedRoute && !hasValidSession) {
    const loginUrl = new URL(LOGIN_ROUTE, request.url)

    // Preserve the intended destination
    if (pathname !== '/') {
      loginUrl.searchParams.set('callbackUrl', pathname)
    }

    const response = NextResponse.redirect(loginUrl)

    // Clear any invalid session cookie
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
    if (sessionCookie) {
      response.cookies.delete({
        name: SESSION_COOKIE_NAME,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    }

    return response
  }

  // Handle auth routes - redirect authenticated users
  if (isAuthRoute && hasValidSession) {
    // Check for callback URL in query params
    const callbackUrl = searchParams.get('callbackUrl')

    if (callbackUrl && isValidCallbackUrl(callbackUrl, request.url)) {
      return NextResponse.redirect(new URL(callbackUrl, request.url))
    }

    // Default redirect for authenticated users
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url))
  }

  // Allow the request to continue
  return NextResponse.next()
}

// Middleware configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _vercel (Vercel files)
     * - Static files (favicon.ico, robots.txt, sitemap.xml, manifest.json, etc.)
     * - Public folder files
     * - Files with extensions (e.g., .css, .js, .png)
     */
    {
      source:
        '/((?!api|_next/static|_next/image|_vercel|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\..*|public).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
