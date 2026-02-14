/**
 * Supabase Server Client
 * 
 * Creates a Supabase client for use in server-side components and API routes.
 * Handles cookie-based authentication for SSR and server actions.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './types'

/**
 * Creates and returns a typed Supabase server client
 * Integrates with Next.js cookies for authentication
 */
export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Get all cookies from the store
        getAll() {
          return cookieStore.getAll()
        },
        // Set multiple cookies at once
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
