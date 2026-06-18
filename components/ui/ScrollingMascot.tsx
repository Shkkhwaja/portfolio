'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Mascot from '@/components/mascot/Mascot'

export default function ScrollingMascot() {
  const [mounted, setMounted]   = useState(false)
  const [isTouch, setIsTouch]   = useState(false)
  const [flipped, setFlipped]   = useState(false)    // true = facing right → mascot walks right
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
      /*
        Oscillate between 8% (far left) and 88% (far right).
        At scrollY = 0         → cos(0)   = 1  → 88%  (right, start)
        At scrollY = period/2  → cos(π)   = -1 → 8%   (left)
        At scrollY = period    → cos(2π)  = 1  → 88%  (right)
        Repeat every `period` pixels of scroll.
      */
      const period = 1000
      const angle  = (scrollY / period) * Math.PI
      const newX   = 48 + 40 * Math.cos(angle)

      /* Determine walking direction */
      if (newX !== prevXRef.current) {
        setFlipped(newX > prevXRef.current) // moving right → face right
      }
      prevXRef.current = newX
      rawX.set(newX)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [rawX])

  if (!mounted || isTouch) return null

  return (
    /* Outer: scroll-driven horizontal position */
    <motion.div
      className="fixed bottom-2 z-[60] pointer-events-none will-change-transform"
      style={{ left: leftStyle, translateX: '-50%' }}
    >
      {/* Middle: smooth fly / float bob */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Inner: flip direction when moving right */}
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
