'use client'

import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthButton() {
  const router = useRouter()
  const supabase = createClient()

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
