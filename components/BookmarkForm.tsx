'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'

export default function BookmarkForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !url.trim()) {
      toast.error('Please fill in title and URL')
      return
    }

    try {
      setLoading(true)
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean)
      
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
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          disabled={loading}
          required
        />
        <input
          type="url"
          placeholder="https://example.com *"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input"
          disabled={loading}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input min-h-[80px]"
          disabled={loading}
          rows={3}
        />
        <input
          type="text"
          placeholder="Tags (comma separated, e.g: work, design, inspiration)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="input"
          disabled={loading}
        />
      </div>
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
