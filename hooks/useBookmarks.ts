/**
 * useBookmarks Custom Hook
 * 
 * Manages bookmark data fetching, real-time subscriptions, and CRUD operations.
 * Provides centralized bookmark state management for the application.
 */

'use client'

import { createClient } from '@/lib/supabaseClient'
import { Bookmark } from '@/lib/types'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  /**
   * Fetches all bookmarks for the current user
   * Ordered by creation date (newest first)
   */
  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Set up real-time subscription and initial data fetch
   * Listens for INSERT, UPDATE, DELETE events on bookmarks table
   */
  useEffect(() => {
    fetchBookmarks()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('bookmarks')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'bookmarks',
        },
        () => fetchBookmarks() // Refetch on any change
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  /**
   * Deletes a bookmark by ID
   * 
   * @param id - The bookmark ID to delete
   */
  const deleteBookmark = async (id: string) => {
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)
      if (error) throw error
      toast.success('Bookmark deleted')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return { bookmarks, loading, deleteBookmark, refetch: fetchBookmarks }
}
