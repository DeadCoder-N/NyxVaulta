/**
 * TypeScript Type Definitions
 * 
 * Defines the data models and database schema for the application.
 * Provides type safety for Supabase operations.
 */

/**
 * Bookmark data model
 * Represents a saved bookmark with metadata
 */
export interface Bookmark {
  id: string
  user_id: string
  title: string
  url: string
  description?: string
  folder_id?: string
  tags?: string[]
  favicon_url?: string // Currently unused - for future favicon feature
  visit_count: number // Currently unused - for future analytics
  last_visited?: string // Currently unused - for future analytics
  is_favorite: boolean
  created_at: string
}

/**
 * Folder data model
 * For organizing bookmarks into categories
 * 
 * NOTE: Folder functionality is not yet implemented in the UI
 * Schema exists for future feature development
 */
export interface Folder {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

/**
 * Supabase Database Schema
 * Defines the structure of database tables and operations
 */
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

/* 
 * UNUSED FIELDS IN BOOKMARK:
 * - favicon_url: Planned for displaying website favicons
 * - visit_count: Planned for tracking bookmark usage
 * - last_visited: Planned for tracking last access time
 * 
 * UNUSED TABLE:
 * - folders: Planned for bookmark organization feature
 */
