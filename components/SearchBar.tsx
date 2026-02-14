/**
 * Search Bar Component
 * Provides search input with clear functionality
 */

'use client'

import { motion } from 'framer-motion'
import { SearchIcon, CloseIcon } from './Icons'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder="Search bookmarks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input pl-12"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          aria-label="Clear search"
        >
          <CloseIcon />
        </button>
      )}
    </motion.div>
  )
}
