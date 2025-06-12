import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Constants
const SESSION_COOKIE_NAME = 'session' // This should match lucia.sessionCookieName
const PROTECTED_ROUTE_GROUP = '/(protected)'
const AUTH_ROUTE_GROUP = '/(auth)'
const DEFAULT_LOGIN_REDIRECT = '/dashboard'
const LOGIN_ROUTE = '/login'

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
 * Next.js middleware function
 * Runs before every request to check authentication status
 */
export async function middleware(
  request: NextRequest
): Promise<MiddlewareResponse> {
  const { pathname, searchParams } = request.nextUrl

  // Early return for static assets and API routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('/favicon.ico') ||
    pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next()
  }

  // Get session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
  const hasSession = !!sessionCookie?.value

  // Determine route type
  const isProtectedRoute =
    isRouteGroup(pathname, PROTECTED_ROUTE_GROUP) ||
    matchesRoute(pathname, routeConfig.protectedRoutes)

  const isAuthRoute =
    isRouteGroup(pathname, AUTH_ROUTE_GROUP) ||
    matchesRoute(pathname, routeConfig.authRoutes)

  // Handle protected routes - redirect to login if no session
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL(LOGIN_ROUTE, request.url)

    // Preserve the intended destination
    if (pathname !== '/') {
      loginUrl.searchParams.set('callbackUrl', pathname)
    }

    const response = NextResponse.redirect(loginUrl)

    // Clear any invalid session cookie
    if (sessionCookie) {
      response.cookies.delete({
        name: SESSION_COOKIE_NAME,
        path: '/',
      })
    }

    return response
  }

  // Handle auth routes - redirect authenticated users
  if (isAuthRoute && hasSession) {
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
