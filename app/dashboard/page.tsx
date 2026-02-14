/**
 * Dashboard Page Component
 * 
 * Main application interface for managing bookmarks.
 * Features: search, filter, sort, add, edit, delete bookmarks with real-time sync.
 */

'use client'

import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import ExportButton from '@/components/ExportButton'
import FilterControls from '@/components/FilterControls'
import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import { useBookmarks } from '@/hooks/useBookmarks'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

export default function DashboardPage() {
  // Fetch bookmarks with real-time updates
  const { bookmarks, loading, deleteBookmark, refetch } = useBookmarks()
  
  // Local state for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  /**
   * Memoized filtered and sorted bookmarks
   * Applies search, favorites filter, and sorting logic
   */
  const filteredAndSortedBookmarks = useMemo(() => {
    let filtered = bookmarks

    // Apply search filter across multiple fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(query) ||
        b.url.toLowerCase().includes(query) ||
        b.description?.toLowerCase().includes(query) ||
        b.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(b => b.is_favorite)
    }

    // Apply sorting
    const sorted = [...filtered]
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'oldest':
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    return sorted
  }, [bookmarks, searchQuery, sortBy, showFavoritesOnly])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl" />
      
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-8 relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <h1 className="text-4xl font-black text-white">
              Your Vault
            </h1>
          </div>
          <p className="text-gray-400">Synced in real-time across all devices</p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {/* Total Bookmarks */}
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-400">{bookmarks.length}</div>
            <div className="text-sm text-gray-400 mt-1">Total</div>
          </div>
          {/* Favorites Count */}
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {bookmarks.filter(b => b.is_favorite).length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Favorites</div>
          </div>
          {/* Unique Tags Count */}
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-400">
              {new Set(bookmarks.flatMap(b => b.tags || [])).size}
            </div>
            <div className="text-sm text-gray-400 mt-1">Tags</div>
          </div>
          {/* Filtered Results Count */}
          <div className="card text-center">
            <div className="text-3xl font-bold text-pink-400">
              {filteredAndSortedBookmarks.length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Showing</div>
          </div>
        </motion.div>

        {/* Search and Export Controls */}
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <ExportButton bookmarks={bookmarks} />
        </div>
        
        {/* Filter and Sort Controls */}
        <FilterControls 
          sortBy={sortBy}
          onSortChange={setSortBy}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        />
        
        {/* Add Bookmark Form */}
        <BookmarkForm onSuccess={refetch} />
        
        {/* Search Results Counter */}
        {(searchQuery || showFavoritesOnly) && (
          <div className="text-sm text-gray-400">
            Found {filteredAndSortedBookmarks.length} bookmark{filteredAndSortedBookmarks.length !== 1 ? 's' : ''}
          </div>
        )}
        
        {/* Bookmarks List */}
        <BookmarkList 
          bookmarks={filteredAndSortedBookmarks} 
          loading={loading} 
          onDelete={deleteBookmark}
          onUpdate={refetch}
        />
      </main>
    </div>
  )
}
