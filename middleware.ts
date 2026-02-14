/**
 * Authentication Middleware
 * 
 * Handles route protection and authentication state management.
 * Protects dashboard routes and redirects authenticated users away from login.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware function to handle authentication and route protection
 * 
 * @param request - The incoming Next.js request object
 * @returns NextResponse with appropriate redirects or continuation
 */
export async function middleware(request: NextRequest) {
  // Initialize response with current request headers
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client with cookie handling for SSR
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Get cookie value by name
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        // Set cookie in both request and response
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        // Remove cookie by setting empty value
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Fetch current authenticated user
  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes - redirect unauthenticated users to login
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from login page to dashboard
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

// Configure which routes this middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
