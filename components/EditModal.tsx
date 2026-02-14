/**
 * Edit Modal Component
 * Modal for editing existing bookmarks
 */

'use client'

import { bookmarkApi } from '@/lib/api'
import { Bookmark } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  bookmark: Bookmark
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EditModal({ bookmark, isOpen, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState(bookmark.title)
  const [url, setUrl] = useState(bookmark.url)
  const [description, setDescription] = useState(bookmark.description || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await bookmarkApi.update(bookmark.id, { title, url, description })
      toast.success('Bookmark updated')
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card max-w-lg w-full"
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                Edit Bookmark
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                  required
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="input"
                  required
                />
                <textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input min-h-[100px]"
                  rows={3}
                />
                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="btn-primary flex-1">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={onClose} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
