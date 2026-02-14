/**
 * Bookmark Item Component
 * Displays individual bookmark with actions
 */

'use client'

import { bookmarkApi } from '@/lib/api'
import { ANIMATION, DATE_FORMAT } from '@/lib/constants'
import { Bookmark } from '@/lib/types'
import { copyToClipboard, formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'
import EditModal from './EditModal'
import { CheckIcon, CopyIcon, DeleteIcon, EditIcon, StarIcon } from './Icons'

interface Props {
  bookmark: Bookmark
  onDelete: (id: string) => void
  onUpdate: () => void
}

export default function BookmarkItem({ bookmark, onDelete, onUpdate }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showCopied, setShowCopied] = useState(false)
  const [togglingFav, setTogglingFav] = useState(false)

  const handleCopyUrl = async () => {
    await copyToClipboard(bookmark.url)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), ANIMATION.COPIED_TIMEOUT)
  }

  const handleToggleFavorite = async () => {
    try {
      setTogglingFav(true)
      await bookmarkApi.toggleFavorite(bookmark.id, bookmark.is_favorite)
      toast.success(bookmark.is_favorite ? 'Removed from favorites' : 'Added to favorites')
      onUpdate()
    } catch (error: any) {
      toast.error(error.message)
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
            {formatDate(bookmark.created_at, DATE_FORMAT.SHORT)}
          </p>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            disabled={togglingFav}
            className={`px-2 py-1 rounded-lg glass transition-all ${
              bookmark.is_favorite ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-gray-400 hover:bg-gray-500/10'
            }`}
            aria-label={bookmark.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <StarIcon fill={bookmark.is_favorite ? 'currentColor' : 'none'} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopyUrl}
            className="text-gray-400 hover:text-blue-300 px-2 py-1 rounded-lg glass hover:bg-blue-500/10 transition-all"
            aria-label="Copy URL"
          >
            {showCopied ? <CheckIcon /> : <CopyIcon />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditOpen(true)}
            className="text-gray-400 hover:text-purple-300 px-2 py-1 rounded-lg glass hover:bg-purple-500/10 transition-all"
            aria-label="Edit bookmark"
          >
            <EditIcon />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(bookmark.id)}
            className="text-red-400 hover:text-red-300 px-2 py-1 rounded-lg glass hover:bg-red-500/10 transition-all"
            aria-label="Delete bookmark"
          >
            <DeleteIcon />
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
