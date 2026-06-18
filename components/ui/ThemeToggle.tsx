'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-14 h-7" />

  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-14 h-7 rounded-full border border-[var(--border)] bg-[var(--bg-2)] flex items-center p-1 focus-visible:ring-2 focus-visible:ring-[#FF5C39]"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      whileTap={{ scale: 0.95 }}
    >
      {/* Track */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0' }}
        transition={{ duration: 0.3 }}
      />

      {/* Thumb */}
      <motion.div
        className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center text-[11px]"
        animate={{
          x: isDark ? '100%' : '0%',
          backgroundColor: isDark ? '#FF5C39' : '#F59E0B',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.div>
    </motion.button>
  )
}
