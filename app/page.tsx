'use client'

import { createClient } from '@/lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    if (code) {
      // Handle OAuth callback
      const handleCallback = async () => {
        const supabase = createClient()
        await supabase.auth.exchangeCodeForSession(code)
        router.push('/dashboard')
      }
      handleCallback()
    } else {
      // No code, redirect to login
      router.push('/login')
    }
  }, [code, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  )
}