/**
 * Authentication Button Component
 * 
 * Provides sign-out functionality for authenticated users.
 * Redirects to login page after successful sign-out.
 * 
 * NOTE: This component is currently unused in the codebase.
 * The Navbar component handles authentication directly.
 * Keeping for potential future use or alternative layouts.
 */

'use client'

import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthButton() {
  const router = useRouter()
  const supabase = createClient()

  /**
   * Handles user sign-out and redirects to login
   */
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button onClick={handleSignOut} className="btn-secondary">
      Sign Out
    </button>
  )
}

/* UNUSED COMPONENT - Consider removing if not needed in future */
