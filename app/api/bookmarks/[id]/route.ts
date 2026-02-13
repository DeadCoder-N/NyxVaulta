import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Build update object - only include allowed fields
    const updateData: any = {}
    
    if ('title' in body) updateData.title = body.title
    if ('url' in body) updateData.url = body.url
    if ('description' in body) updateData.description = body.description
    if ('is_favorite' in body) updateData.is_favorite = body.is_favorite
    if ('tags' in body) updateData.tags = body.tags
    if ('folder_id' in body && body.folder_id) updateData.folder_id = body.folder_id

    const { data, error } = await supabase
      .from('bookmarks')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
