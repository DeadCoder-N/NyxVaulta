# Frontend Implementation (UI Modules) – Dashboard Page Composition and State Management

This section details how the **Dashboard** page of NyxVaulta is built in the frontend. It covers how data flows from the Supabase-backed `useBookmarks` hook into local UI state, how filtering and sorting are memoized for performance, and how the page is composed from reusable UI modules.

---

## Data Source – useBookmarks Hook

The dashboard relies on the custom `useBookmarks` hook to fetch and keep bookmark data in sync.

- **Fetch & Subscription**: On mount, bookmarks are fetched and a Realtime channel is opened
- **State**: Exposes
- `bookmarks`: array of all bookmarks
- `loading`: boolean loading indicator
- `deleteBookmark(id)`: deletes a bookmark
- `refetch()`: manual reload

```ts
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchBookmarks = async () => { /* ... */ }
  useEffect(() => {
    fetchBookmarks()
    const channel = supabase
      .channel('bookmarks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' }, fetchBookmarks)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const deleteBookmark = async (id: string) => { /* ... */ }
  return { bookmarks, loading, deleteBookmark, refetch: fetchBookmarks }
}
```

(see `hooks/useBookmarks.ts`)

---

## Local UI State

The dashboard holds three pieces of local state for controlling its search, sort, and favorite-only filters:

| State Variable | Type | Purpose |
| --- | --- | --- |
| `searchQuery` | `string` | Text to search in title, URL, description, tags |
| `sortBy` | `string` | Sort order: `'newest'`, `'oldest'`, `'title'`, `'title-desc'` |
| `showFavoritesOnly` | `boolean` | Toggle to filter only starred bookmarks |


```jsx
const [searchQuery, setSearchQuery] = useState('')
const [sortBy, setSortBy] = useState('newest')
const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
```

(from `app/dashboard/page.tsx`)

---

## Memoized Filtering & Sorting

To avoid expensive recalculations on every render, the filtered and sorted list is computed inside a `useMemo` hook:

- **Filter by search**: case-insensitive match against title, URL, description, tags
- **Filter favorites**: if `showFavoritesOnly` is `true`
- **Sort**: by creation date or title, ascending or descending

```ts
const filteredAndSortedBookmarks = useMemo(() => {
  let filtered = bookmarks

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.tags?.some(tag => tag.toLowerCase().includes(q))
    )
  }

  if (showFavoritesOnly) {
    filtered = filtered.filter(b => b.is_favorite)
  }

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
```

(from `app/dashboard/page.tsx`)

---

## Component Composition & Rendering Flow

The dashboard pages stitches together the following UI modules in order:

1. **Navbar** – Sticky top bar with branding and sign-out button
2. **Header** – Title, subtitle and description
3. **Analytics Tiles** 📊 – Total bookmarks, favorites count, tag count, and “showing” count
4. **Search & Export** –
5. `SearchBar` for text queries
6. `ExportButton` (JSON/CSV)
7. **FilterControls** – Sort selector and favorites-only toggle
8. **BookmarkForm** – Add new bookmark modal/form
9. **Results Feedback** – Display count of found bookmarks when filters applied
10. **BookmarkList** – Renders each bookmark via `BookmarkItem`, with skeleton/loading and empty-state

```jsx
return (
  <div className="min-h-screen relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br … blur-3xl" />

    <Navbar />

    <main className="max-w-6xl mx-auto px-4 py-12 space-y-8 relative z-10">
      {/* Header */}
      <motion.div {/* ... */}>
        <h1>Your Vault</h1>
        <p>Synced in real-time across all devices</p>
      </motion.div>

      {/* Analytics */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Total */}
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-400">
            {bookmarks.length}
          </div>
          <div className="text-sm text-gray-400 mt-1">Total</div>
        </div>
        {/* Favorites */}
        {/* ... */}
      </motion.div>

      {/* Search & Export */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <ExportButton bookmarks={bookmarks} />
      </div>

      {/* Sort & Favorites Toggle */}
      <FilterControls
        sortBy={sortBy}
        onSortChange={setSortBy}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
      />

      {/* New Bookmark Form */}
      <BookmarkForm onSuccess={refetch} />

      {/* Feedback */}
      {(searchQuery || showFavoritesOnly) && (
        <div className="text-sm text-gray-400">
          Found {filteredAndSortedBookmarks.length}
          {filteredAndSortedBookmarks.length !== 1 ? 's' : ''} bookmark
        </div>
      )}

      {/* List */}
      <BookmarkList
        bookmarks={filteredAndSortedBookmarks}
        loading={loading}
        onDelete={deleteBookmark}
        onUpdate={refetch}
      />
    </main>
  </div>
)
```

(references `app/dashboard/page.tsx`)

---

## Sub-Component Responsibilities

| Component | Responsibility |
| --- | --- |
| Navbar | Displays app title, user email, and sign-out button |
| SearchBar | Controlled input for search text |
| ExportButton | Triggers JSON/CSV download of all bookmarks |
| FilterControls | Dropdown to sort and button to toggle favorites filter |
| BookmarkForm | Form to add a new bookmark; calls `refetch` on success |
| BookmarkList | Handles loading, empty states, and maps bookmarks to items |
| BookmarkItem | Individual bookmark card; copy URL, favorite toggle, edit modal |


This composition ensures a clear separation of concerns, easy reusability, and optimal performance via memoization.