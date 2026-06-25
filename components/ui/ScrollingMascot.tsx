'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Mascot from '@/components/mascot/Mascot'

export default function ScrollingMascot() {
  const [mounted, setMounted]   = useState(false)
  const [isTouch, setIsTouch]   = useState(false)
  const [flipped, setFlipped]   = useState(false)
  const prevXRef = useRef(88)

  const rawX    = useMotionValue(88)
  const smoothX = useSpring(rawX, { stiffness: 35, damping: 14, mass: 1.2 })
  const leftStyle = useTransform(smoothX, (v) => `${v}%`)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
      return
    }

    const onScroll = () => {
      const scrollY = window.scrollY
      const period  = 1000
      const angle   = (scrollY / period) * Math.PI
      const newX    = 48 + 40 * Math.cos(angle)
      if (newX !== prevXRef.current) {
        setFlipped(newX > prevXRef.current)
      }
      prevXRef.current = newX
      rawX.set(newX)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [rawX])

  if (!mounted) return null

  /* ── Mobile / touch: fixed bottom-right corner, no scroll tracking ── */
  if (isTouch) {
    return (
      <motion.div
        className="fixed bottom-4 right-3 z-[60]"
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        /* Wait for loading screen to clear (~1.9s dismiss + 0.62s exit) */
        transition={{ delay: 2.7, duration: 0.55, type: 'spring', stiffness: 200, damping: 18 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Mascot size={38} />
        </motion.div>
      </motion.div>
    )
  }

  /* ── Desktop: scroll-driven horizontal walk ── */
  return (
    <motion.div
      className="fixed bottom-2 z-[60] pointer-events-none will-change-transform"
      style={{ left: leftStyle, translateX: '-50%' }}
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          animate={{ scaleX: flipped ? -1 : 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ originX: '50%' }}
        >
          <Mascot size={88} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
