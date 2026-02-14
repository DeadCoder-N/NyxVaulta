/**
 * API Service Layer
 * Centralized API calls with error handling
 */

import { Bookmark } from './types'

const API_BASE = '/api/bookmarks'

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Request failed')
  }
  return response.json()
}

export const bookmarkApi = {
  async create(data: Partial<Bookmark>) {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async update(id: string, data: Partial<Bookmark>) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async toggleFavorite(id: string, isFavorite: boolean) {
    return this.update(id, { is_favorite: !isFavorite })
  },
}
