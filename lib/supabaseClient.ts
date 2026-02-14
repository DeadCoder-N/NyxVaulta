/**
 * Supabase Browser Client
 * 
 * Creates a Supabase client for use in client-side components.
 * Handles authentication and database operations in the browser.
 */

import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

/**
 * Creates and returns a typed Supabase browser client
 * Uses environment variables for configuration
 */
export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
