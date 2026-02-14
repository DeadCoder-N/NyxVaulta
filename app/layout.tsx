/**
 * Root Layout Component
 * 
 * Provides the base HTML structure and global configurations for the entire application.
 * Includes font setup, metadata, and toast notifications.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import '../styles/globals.css'

// Configure Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] })

// Application metadata for SEO and browser display
export const metadata: Metadata = {
  title: 'NyxVaulta - Your Digital Sanctuary for Bookmarks',
  description: 'Organize, search, and sync your bookmarks with real-time updates. Smart tags, folders, and powerful search.',
}

/**
 * Root layout wrapper for all pages
 * 
 * @param children - Child components to render within the layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        {/* Global toast notification system */}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
