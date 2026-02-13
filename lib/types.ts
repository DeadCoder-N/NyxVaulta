export interface Bookmark {
  id: string
  user_id: string
  title: string
  url: string
  description?: string
  folder_id?: string
  tags?: string[]
  favicon_url?: string
  visit_count: number
  last_visited?: string
  is_favorite: boolean
  created_at: string
}

export interface Folder {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: Bookmark
        Insert: Omit<Bookmark, 'id' | 'created_at' | 'visit_count'>
        Update: Partial<Omit<Bookmark, 'id' | 'user_id' | 'created_at'>>
      }
      folders: {
        Row: Folder
        Insert: Omit<Folder, 'id' | 'created_at'>
        Update: Partial<Omit<Folder, 'id' | 'user_id' | 'created_at'>>
      }
    }
  }
}
