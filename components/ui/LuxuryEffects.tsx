'use client'

import { useEffect } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Premium micro-interactions that never touch layout:
 *  - a hairline scroll-progress bar (transform-only),
 *  - a cursor-following spotlight on cards (one passive listener, rAF-throttled, writes two CSS variables).
 * The matching CSS lives in globals.css under "Luxury layer".
 */

const SPOTLIGHT_SELECTOR = '[class*="bg-[var(--card)]"], [data-spotlight]'

export default function LuxuryEffects() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })

  useEffect(() => {
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let raf = 0
    let x = 0
    let y = 0
    let target: HTMLElement | null = null

    const paint = () => {
      raf = 0
      if (!target) return
      const r = target.getBoundingClientRect()
      target.style.setProperty('--mx', `${x - r.left}px`)
      target.style.setProperty('--my', `${y - r.top}px`)
    }
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(SPOTLIGHT_SELECTOR) as HTMLElement | null
      if (!el) return
      target = el
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(paint)
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduce])

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-0 z-[101] h-[2px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(to right, #FF5C39, #D4FF4F)',
        boxShadow: '0 0 12px rgba(255,92,57,0.6)',
      }}
    />
  )
}
