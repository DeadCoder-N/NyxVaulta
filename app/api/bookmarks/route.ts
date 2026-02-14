/**
 * Bookmarks API Route - POST
 * 
 * Creates a new bookmark for the authenticated user.
 * Validates required fields and initializes default values.
 */

import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Initialize Supabase client and verify authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const { title, url, description, tags, folder_id } = await request.json()

    // Validate required fields
    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 })
    }

    // Insert new bookmark with default values
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({ 
        title, 
        url, 
        description,
        tags,
        folder_id,
        user_id: user.id,
        visit_count: 0,
        is_favorite: false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
