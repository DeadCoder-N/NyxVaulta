'use client'

import { Bookmark } from '@/lib/types'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'
import EditModal from './EditModal'

interface Props {
  bookmark: Bookmark
  onDelete: (id: string) => void
  onUpdate: () => void
}

export default function BookmarkItem({ bookmark, onDelete, onUpdate }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showCopied, setShowCopied] = useState(false)
  const [togglingFav, setTogglingFav] = useState(false)

  const copyUrl = () => {
    navigator.clipboard.writeText(bookmark.url)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  const toggleFavorite = async () => {
    try {
      setTogglingFav(true)
      
      const response = await fetch(`/api/bookmarks/${bookmark.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: !bookmark.is_favorite }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update favorite')
      }
      
      toast.success(bookmark.is_favorite ? 'Removed from favorites' : 'Added to favorites')
      onUpdate()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update')
    } finally {
      setTogglingFav(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="card flex items-start justify-between gap-4 group relative"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-400 hover:text-blue-300 block truncate transition-colors"
              >
                {bookmark.title}
              </a>
              {bookmark.description && (
                <p className="text-sm text-gray-400 mt-1">{bookmark.description}</p>
              )}
              <p className="text-sm text-gray-500 truncate mt-1">{bookmark.url}</p>
              {bookmark.tags && bookmark.tags.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {bookmark.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 glass rounded-full text-gray-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavorite}
            disabled={togglingFav}
            className={`px-2 py-1 rounded-lg glass transition-all ${
              bookmark.is_favorite ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-gray-400 hover:bg-gray-500/10'
            }`}
            title={bookmark.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-5 h-5" fill={bookmark.is_favorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyUrl}
            className="text-gray-400 hover:text-blue-300 px-2 py-1 rounded-lg glass hover:bg-blue-500/10 transition-all"
            title="Copy URL"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showCopied ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              )}
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditOpen(true)}
            className="text-gray-400 hover:text-purple-300 px-2 py-1 rounded-lg glass hover:bg-purple-500/10 transition-all"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(bookmark.id)}
            className="text-red-400 hover:text-red-300 px-2 py-1 rounded-lg glass hover:bg-red-500/10 transition-all"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
      <EditModal
        bookmark={bookmark}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={onUpdate}
      />
    </>
  )
}
