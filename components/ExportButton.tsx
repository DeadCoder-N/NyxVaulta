/**
 * Export Button Component
 * Handles bookmark export in JSON and CSV formats
 */

'use client'

import { Bookmark } from '@/lib/types'
import { bookmarksToCSV, downloadFile, generateFilename } from '@/lib/utils'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { DownloadIcon } from './Icons'

interface Props {
  bookmarks: Bookmark[]
}

export default function ExportButton({ bookmarks }: Props) {
  const exportJSON = () => {
    const data = JSON.stringify(bookmarks, null, 2)
    downloadFile(data, generateFilename('json'), 'application/json')
    toast.success('Bookmarks exported!')
  }

  const exportCSV = () => {
    const csv = bookmarksToCSV(bookmarks)
    downloadFile(csv, generateFilename('csv'), 'text/csv')
    toast.success('Bookmarks exported!')
  }

  return (
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={exportJSON}
        className="btn-secondary text-sm flex items-center gap-2"
      >
        <DownloadIcon />
        Export JSON
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={exportCSV}
        className="btn-secondary text-sm flex items-center gap-2"
      >
        <DownloadIcon />
        Export CSV
      </motion.button>
    </div>
  )
}
