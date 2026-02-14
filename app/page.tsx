/**
 * Landing Page Component
 * 
 * Marketing page showcasing NyxVaulta features and benefits.
 * Includes hero section, features grid, stats, and call-to-action sections.
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

// Feature data for the features grid section
const FEATURES = [
  { title: 'Real-time Sync', desc: 'Changes appear instantly across all your devices without refresh' },
  { title: 'Smart Search', desc: 'Find any bookmark instantly with powerful full-text search' },
  { title: 'Tags & Organization', desc: 'Organize bookmarks with custom tags and descriptions' },
  { title: 'Secure Authentication', desc: 'Google OAuth with enterprise-grade security' },
  { title: 'Export & Backup', desc: 'Export your data anytime in JSON or CSV format' },
  { title: 'Advanced Filtering', desc: 'Sort and filter bookmarks by multiple criteria' }
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-white">NyxVaulta</span>
            </div>
            {/* Sign In Button */}
            <Link href="/login" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 px-4">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Main headline */}
            <h1 className="text-6xl md:text-7xl font-black text-white leading-tight">
              Your Digital
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Bookmark Sanctuary
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Organize, search, and sync your bookmarks across all devices. 
              Built for professionals who demand more from their tools.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/login" className="btn-primary text-lg px-8 py-4">
                Get Started Free
              </Link>
              <a href="#features" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg">Powerful features for modern bookmark management</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card hover:border-blue-500/30 transition-all"
              >
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Real-time
              </div>
              <div className="text-gray-400">Instant synchronization</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Secure
              </div>
              <div className="text-gray-400">Enterprise-grade security</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Fast
              </div>
              <div className="text-gray-400">Lightning-fast search</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card py-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join professionals managing their bookmarks smarter
            </p>
            <Link href="/login" className="btn-primary text-lg px-10 py-4 inline-block">
              Start Free Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Footer Logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
              <span className="font-bold text-white">NyxVaulta</span>
            </div>
            {/* Copyright */}
            <div className="text-gray-500 text-sm">
              © 2026 NyxVaulta. All rights reserved. Built by Dead Coderr.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
