/**
 * Application Constants
 * Centralized configuration and magic values
 */

export const ANIMATION = {
  COPIED_TIMEOUT: 2000,
  STAGGER_DELAY: 0.1,
} as const

export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  TITLE_ASC: 'title',
  TITLE_DESC: 'title-desc',
} as const

export const DATE_FORMAT = {
  SHORT: { month: 'short', day: 'numeric', year: 'numeric' } as const,
}

export const EXPORT_FILENAME_PREFIX = 'nyxvaulta-bookmarks'

export const CSV_HEADERS = ['Title', 'URL', 'Description', 'Tags', 'Favorite', 'Created'] as const
