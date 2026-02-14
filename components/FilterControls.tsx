/**
 * Filter Controls Component
 * Provides sorting and favorites filtering
 */

'use client'

import { SORT_OPTIONS } from '@/lib/constants'
import { motion } from 'framer-motion'
import { StarIcon } from './Icons'

interface Props {
  sortBy: string
  onSortChange: (sort: string) => void
  showFavoritesOnly: boolean
  onToggleFavorites: () => void
}

const SORT_LABELS = {
  [SORT_OPTIONS.NEWEST]: 'Newest First',
  [SORT_OPTIONS.OLDEST]: 'Oldest First',
  [SORT_OPTIONS.TITLE_ASC]: 'Title (A-Z)',
  [SORT_OPTIONS.TITLE_DESC]: 'Title (Z-A)',
} as const

export default function FilterControls({ sortBy, onSortChange, showFavoritesOnly, onToggleFavorites }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 items-center flex-wrap"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Sort:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="glass px-3 py-2 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleFavorites}
        className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
          showFavoritesOnly 
            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
            : 'glass text-gray-400 hover:text-white'
        }`}
        aria-label={showFavoritesOnly ? 'Show all bookmarks' : 'Show favorites only'}
      >
        <StarIcon className="w-4 h-4" fill={showFavoritesOnly ? 'currentColor' : 'none'} />
        {showFavoritesOnly ? 'Show All' : 'Favorites Only'}
      </motion.button>
    </motion.div>
  )
}
