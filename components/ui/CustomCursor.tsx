'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type CursorVariant = 'default' | 'interactive' | 'project'

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [visible, setVisible] = useState(false)
  const [variant, setVariant] = useState<CursorVariant>('default')

  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const ringX = useSpring(mx, { stiffness: 200, damping: 28, mass: 0.5 })
  const ringY = useSpring(my, { stiffness: 200, damping: 28, mass: 0.5 })

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
      return
    }

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      mx.set(e.clientX)
      my.set(e.clientY)
      setVisible(true)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    const watchElements = () => {
      document.querySelectorAll('a, button, [data-cursor="interactive"]').forEach((el) => {
        el.addEventListener('mouseenter', () => setVariant('interactive'))
        el.addEventListener('mouseleave', () => setVariant('default'))
      })
      document.querySelectorAll('[data-cursor="project"]').forEach((el) => {
        el.addEventListener('mouseenter', () => setVariant('project'))
        el.addEventListener('mouseleave', () => setVariant('default'))
      })
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    watchElements()
    const mo = new MutationObserver(watchElements)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      mo.disconnect()
    }
  }, [dotX, dotY, mx, my])

  if (!mounted || isTouch) return null

  const ringSize =
    variant === 'project' ? 80 : variant === 'interactive' ? 44 : 36
  const ringBg =
    variant === 'project' ? '#D4FF4F' : variant === 'interactive' ? '#FF5C39' : 'transparent'
  const ringBorder =
    variant === 'default' ? '1.5px solid rgba(255,255,255,0.45)' : 'none'

  return (
    <>
      {/* Dot — no lag */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference rounded-full"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      >
        <div className="w-[6px] h-[6px] rounded-full bg-white" />
      </motion.div>

      {/* Ring — spring lag */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full flex items-center justify-center"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible ? 1 : 0,
          width: ringSize,
          height: ringSize,
          backgroundColor: ringBg,
          border: ringBorder,
        }}
        transition={{ width: { duration: 0.2 }, height: { duration: 0.2 }, opacity: { duration: 0.15 } }}
      >
        {variant === 'project' && (
          <motion.span
            className="text-[#0A0A0A] text-[10px] font-bold tracking-widest uppercase select-none"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            VIEW
          </motion.span>
        )}
      </motion.div>
    </>
  )
}
