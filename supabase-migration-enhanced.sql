-- NyxVaulta Enhanced Features Migration
-- Run this in Supabase SQL Editor

-- Add new columns to bookmarks table
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS folder_id UUID;
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS favicon_url TEXT;
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS visit_count INTEGER DEFAULT 0;
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS last_visited TIMESTAMP WITH TIME ZONE;
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;

-- Create folders table
CREATE TABLE IF NOT EXISTS folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on folders
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Folders policies
CREATE POLICY "Users can view own folders"
ON folders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own folders"
ON folders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders"
ON folders FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders"
ON folders FOR DELETE
USING (auth.uid() = user_id);

-- Add UPDATE policy for bookmarks (for edit feature)
DROP POLICY IF EXISTS "Users can update own bookmarks" ON bookmarks;
CREATE POLICY "Users can update own bookmarks"
ON bookmarks FOR UPDATE
USING (auth.uid() = user_id);

-- Enable Realtime for folders
ALTER PUBLICATION supabase_realtime ADD TABLE folders;

-- Create indexes
CREATE INDEX IF NOT EXISTS bookmarks_folder_id_idx ON bookmarks(folder_id);
CREATE INDEX IF NOT EXISTS bookmarks_tags_idx ON bookmarks USING GIN(tags);
CREATE INDEX IF NOT EXISTS bookmarks_is_favorite_idx ON bookmarks(is_favorite);
CREATE INDEX IF NOT EXISTS folders_user_id_idx ON folders(user_id);
