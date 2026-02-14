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
import { SORT_OPTIONS } from '@/lib/constants'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

export default function DashboardPage() {
  const { bookmarks, loading, deleteBookmark, refetch } = useBookmarks()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const filteredAndSortedBookmarks = useMemo(() => {
    let filtered = bookmarks

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(query) ||
        b.url.toLowerCase().includes(query) ||
        b.description?.toLowerCase().includes(query) ||
        b.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(b => b.is_favorite)
    }

    const sorted = [...filtered]
    switch (sortBy) {
      case SORT_OPTIONS.NEWEST:
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case SORT_OPTIONS.OLDEST:
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case SORT_OPTIONS.TITLE_ASC:
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case SORT_OPTIONS.TITLE_DESC:
        sorted.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    return sorted
  }, [bookmarks, searchQuery, sortBy, showFavoritesOnly])

  const stats = useMemo(() => ({
    total: bookmarks.length,
    favorites: bookmarks.filter(b => b.is_favorite).length,
    tags: new Set(bookmarks.flatMap(b => b.tags || [])).size,
    showing: filteredAndSortedBookmarks.length,
  }), [bookmarks, filteredAndSortedBookmarks])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl" />
      
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <h1 className="text-4xl font-black text-white">Your Vault</h1>
          </div>
          <p className="text-gray-400">Synced in real-time across all devices</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
            <div className="text-sm text-gray-400 mt-1">Total</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-400">{stats.favorites}</div>
            <div className="text-sm text-gray-400 mt-1">Favorites</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-400">{stats.tags}</div>
            <div className="text-sm text-gray-400 mt-1">Tags</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-pink-400">{stats.showing}</div>
            <div className="text-sm text-gray-400 mt-1">Showing</div>
          </div>
        </motion.div>

        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <ExportButton bookmarks={bookmarks} />
        </div>
        
        <FilterControls 
          sortBy={sortBy}
          onSortChange={setSortBy}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        />
        
        <BookmarkForm onSuccess={refetch} />
        
        {(searchQuery || showFavoritesOnly) && (
          <div className="text-sm text-gray-400">
            Found {stats.showing} bookmark{stats.showing !== 1 ? 's' : ''}
          </div>
        )}
        
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
