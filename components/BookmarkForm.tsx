/**
 * Bookmark Form Component
 * 
 * Form for creating new bookmarks with validation.
 * Handles title, URL, description, and tags input.
 * Triggers refetch on successful submission.
 */

'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'

interface BookmarkFormProps {
  onSuccess: () => void
}

export default function BookmarkForm({ onSuccess }: BookmarkFormProps) {
  // Form state
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * Handles form submission and bookmark creation
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!title.trim() || !url.trim()) {
      toast.error('Please fill in title and URL')
      return
    }

    try {
      setLoading(true)
      
      // Parse comma-separated tags
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean)
      
      // Submit bookmark to API
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          url, 
          description: description || undefined,
          tags: tagsArray.length > 0 ? tagsArray : undefined
        }),
      })

      if (!response.ok) throw new Error('Failed to add bookmark')

      // Reset form and trigger success callback
      toast.success('Bookmark added')
      setTitle('')
      setUrl('')
      setDescription('')
      setTags('')
      onSuccess()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="card space-y-6"
    >
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Add New Bookmark
      </h2>
      
      <div className="space-y-4">
        {/* Title Input */}
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          disabled={loading}
          required
        />
        
        {/* URL Input */}
        <input
          type="url"
          placeholder="https://example.com *"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input"
          disabled={loading}
          required
        />
        
        {/* Description Textarea */}
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input min-h-[80px]"
          disabled={loading}
          rows={3}
        />
        
        {/* Tags Input */}
        <input
          type="text"
          placeholder="Tags (comma separated, e.g: work, design, inspiration)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="input"
          disabled={loading}
        />
      </div>
      
      {/* Submit Button */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit" 
        disabled={loading} 
        className="btn-primary w-full"
      >
        {loading ? 'Adding...' : '+ Add Bookmark'}
      </motion.button>
    </motion.form>
  )
}
