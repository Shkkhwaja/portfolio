'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Mascot from '@/components/mascot/Mascot'
import { chatStore, useChatState } from '@/lib/chatbot/store'
import AurexLogo from '@/components/chatbot/AurexLogo'

const LABEL = 'Ask me anything! 💬'

/**
 * The walking robot is also the chatbot launcher: click / Enter / Space opens the chat.
 * While the chat is open the robot "moves into" the chat panel (rendered by ChatWidget), so this one hides.
 */
export default function ScrollingMascot() {
  const [mounted, setMounted] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const prevXRef = useRef(88)
  const { open } = useChatState()

  const rawX = useMotionValue(88)
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
      const angle = (window.scrollY / 1000) * Math.PI
      const newX = 48 + 40 * Math.cos(angle)
      if (newX !== prevXRef.current) setFlipped(newX > prevXRef.current)
      prevXRef.current = newX
      rawX.set(newX)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [rawX])

  if (!mounted || open) return null

  const activate = () => chatStore.setOpen(true)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      activate()
    }
  }
  const a11y = {
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': 'Ask me anything — open the AI portfolio assistant chat',
    'aria-haspopup': 'dialog' as const,
    onClick: activate,
    onKeyDown,
  }
  // Always visible (the mascot is fixed to the viewport, so it follows the visitor while scrolling).
  const bubble = LABEL

  /* ── Mobile / touch: fixed bottom-right corner, no scroll tracking ── */
  if (isTouch) {
    return (
      <motion.div
        className="fixed bottom-4 right-3 z-[60] cursor-pointer rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5C39]"
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        /* Wait for loading screen to clear (~1.9s dismiss + 0.62s exit) */
        transition={{ delay: 2.7, duration: 0.55, type: 'spring', stiffness: 200, damping: 18 }}
        whileTap={{ scale: 0.92 }}
        {...a11y}
      >
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}>
          <span className="absolute -left-3 top-2 z-10 pointer-events-none">
            <AurexLogo size={24} />
          </span>
          <Mascot size={46} bubble={bubble} bubbleAlign="right" hoverText={null} clickText={null} />
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
          className="pointer-events-auto cursor-pointer relative rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5C39]"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          {...a11y}
        >
          {/* soft pulsing halo signals "clickable" */}
          <span
            aria-hidden
            className="absolute inset-x-2 inset-y-4 rounded-full bg-[#FF5C39]/25 blur-xl motion-safe:animate-pulse"
          />
          {/* AUREX emblem orbiting at the mascot's shoulder */}
          <span className="absolute -right-3 top-6 z-10 pointer-events-none">
            <AurexLogo size={34} />
          </span>
          <Mascot size={88} flip={flipped} bubble={bubble} hoverText="Click me to chat! 💬" clickText="Opening chat… ⚡" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
