'use client'

import { motion } from 'framer-motion'

interface Props {
  sortBy: string
  onSortChange: (sort: string) => void
  showFavoritesOnly: boolean
  onToggleFavorites: () => void
}

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
          className="glass px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
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
      >
        <svg className="w-4 h-4" fill={showFavoritesOnly ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        {showFavoritesOnly ? 'Show All' : 'Favorites Only'}
      </motion.button>
    </motion.div>
  )
}
