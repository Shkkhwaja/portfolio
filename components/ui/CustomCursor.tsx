'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type CursorState = 'default' | 'hover' | 'project'

export default function CustomCursor() {
  const [mounted,    setMounted]    = useState(false)
  const [isTouch,    setIsTouch]    = useState(false)
  const [visible,    setVisible]    = useState(false)
  const [state,      setCurState]   = useState<CursorState>('default')
  const [clicking,   setClicking]   = useState(false)

  /* Exact position — no lag */
  const dotX = useMotionValue(-200)
  const dotY = useMotionValue(-200)

  /* Ring position — spring lag */
  const mx   = useMotionValue(-200)
  const my   = useMotionValue(-200)
  const ringX = useSpring(mx, { stiffness: 160, damping: 20, mass: 0.55 })
  const ringY = useSpring(my, { stiffness: 160, damping: 20, mass: 0.55 })

  /* Secondary trail — more lag */
  const tx    = useMotionValue(-200)
  const ty    = useMotionValue(-200)
  const trailX = useSpring(tx, { stiffness: 80, damping: 18, mass: 0.7 })
  const trailY = useSpring(ty, { stiffness: 80, damping: 18, mass: 0.7 })

  useEffect(() => {
    setMounted(true)
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
      return
    }

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      mx.set(e.clientX)
      my.set(e.clientY)
      tx.set(e.clientX)
      ty.set(e.clientY)
      setVisible(true)
    }
    const onDown  = () => setClicking(true)
    const onUp    = () => setClicking(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    const watch = () => {
      document.querySelectorAll('a, button, [role="button"], [data-cursor="interactive"]').forEach((el) => {
        el.addEventListener('mouseenter', () => setCurState('hover'))
        el.addEventListener('mouseleave', () => setCurState('default'))
      })
      document.querySelectorAll('[data-cursor="project"]').forEach((el) => {
        el.addEventListener('mouseenter', () => setCurState('project'))
        el.addEventListener('mouseleave', () => setCurState('default'))
      })
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup',   onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    watch()
    const mo = new MutationObserver(watch)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup',   onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      mo.disconnect()
    }
  }, [dotX, dotY, mx, my, tx, ty])

  if (!mounted || isTouch) return null

  /* ── State-derived values ─────────────────────────── */
  const dotSize   = clicking ? 4 : state === 'project' ? 0 : state === 'hover' ? 10 : 7
  const dotGlow   = clicking
    ? 'none'
    : state === 'hover'
    ? '0 0 14px #FF5C39, 0 0 28px rgba(255,92,57,0.4)'
    : '0 0 8px rgba(255,92,57,0.7)'

  const ringSize   = clicking ? 24 : state === 'project' ? 84 : state === 'hover' ? 52 : 38
  const ringBorder = state === 'project'
    ? '2px solid #D4FF4F'
    : state === 'hover'
    ? '2px solid #FF5C39'
    : '1.5px solid rgba(255,255,255,0.38)'
  const ringBg    = state === 'project'
    ? 'rgba(212,255,79,0.14)'
    : state === 'hover'
    ? 'rgba(255,92,57,0.10)'
    : 'transparent'
  const ringGlow  = state === 'project'
    ? '0 0 18px rgba(212,255,79,0.45)'
    : state === 'hover'
    ? '0 0 16px rgba(255,92,57,0.35)'
    : 'none'

  const trailSize = clicking ? 0 : state !== 'default' ? 0 : 16

  return (
    <>
      {/* ── Trail glow (farthest behind) ─────────────── */}
      <motion.div
        className="fixed top-0 left-0 z-[9996] pointer-events-none rounded-full"
        style={{
          x: trailX, y: trailY,
          translateX: '-50%', translateY: '-50%',
          background: 'radial-gradient(circle, rgba(255,92,57,0.5) 0%, transparent 70%)',
        }}
        animate={{
          opacity: visible && state === 'default' ? 0.22 : 0,
          width:  trailSize,
          height: trailSize,
        }}
        transition={{
          opacity: { duration: 0.2 },
          width:   { type: 'spring', stiffness: 250, damping: 22 },
          height:  { type: 'spring', stiffness: 250, damping: 22 },
        }}
      />

      {/* ── Ring (spring lag) ─────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full flex items-center justify-center"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible ? 1 : 0,
          width:   ringSize,
          height:  ringSize,
          border:  ringBorder,
          backgroundColor: ringBg,
          boxShadow: ringGlow,
        }}
        transition={{
          width:  { type: 'spring', stiffness: 300, damping: 26 },
          height: { type: 'spring', stiffness: 300, damping: 26 },
          opacity:         { duration: 0.15 },
          border:          { duration: 0.18 },
          backgroundColor: { duration: 0.18 },
          boxShadow:       { duration: 0.18 },
        }}
      >
        {state === 'project' && (
          <motion.span
            className="text-[10px] font-black tracking-widest uppercase select-none"
            style={{ color: '#D4FF4F' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
          >
            OPEN ↗
          </motion.span>
        )}
        {state === 'hover' && (
          <motion.span
            className="text-[9px] font-bold tracking-widest uppercase select-none"
            style={{ color: '#FF5C39' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
          >
            ↗
          </motion.span>
        )}
      </motion.div>

      {/* ── Dot (exact position) ─────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible ? 1 : 0,
          width:  dotSize,
          height: dotSize,
          backgroundColor: '#FF5C39',
          boxShadow: dotGlow,
          scale: clicking ? 0.6 : 1,
        }}
        transition={{
          width:  { type: 'spring', stiffness: 400, damping: 28 },
          height: { type: 'spring', stiffness: 400, damping: 28 },
          scale:  { type: 'spring', stiffness: 600, damping: 20 },
          opacity:    { duration: 0.08 },
          boxShadow:  { duration: 0.18 },
        }}
      />
    </>
  )
}
