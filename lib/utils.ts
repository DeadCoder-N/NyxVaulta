/**
 * Utility Functions
 * Reusable helper functions
 */

import { Bookmark } from './types'
import { CSV_HEADERS, EXPORT_FILENAME_PREFIX } from './constants'

/**
 * Formats a date to localized string
 */
export const formatDate = (date: string, options: Intl.DateTimeFormatOptions) => {
  return new Date(date).toLocaleDateString('en-US', options)
}

/**
 * Downloads a file with given content
 */
export const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Generates filename with current date
 */
export const generateFilename = (extension: string) => {
  const date = new Date().toISOString().split('T')[0]
  return `${EXPORT_FILENAME_PREFIX}-${date}.${extension}`
}

/**
 * Converts bookmarks to CSV format
 */
export const bookmarksToCSV = (bookmarks: Bookmark[]): string => {
  const rows = bookmarks.map(b => [
    b.title,
    b.url,
    b.description || '',
    (b.tags || []).join('; '),
    b.is_favorite ? 'Yes' : 'No',
    formatDate(b.created_at, { month: 'short', day: 'numeric', year: 'numeric' })
  ])
  
  return [
    CSV_HEADERS.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
}

/**
 * Copies text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  await navigator.clipboard.writeText(text)
}
