'use client'

import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from 'framer-motion'

/**
 * First-visit intro.
 *
 * Smoothness notes:
 *  - progress is a MotionValue (no React re-render per frame) and the bar uses scaleX (compositor only);
 *  - content is rendered once (the old version rendered it twice in two split panels);
 *  - exit = content dissolves, then 6 curtain columns wipe upward in a stagger. Only transform/opacity animate.
 *
 * Total run time ≈ 2.8 s (the hero animations are timed to start right after).
 */

const EASE_OUT = [0.16, 1, 0.3, 1] as const
const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const
const COLUMNS = 6
const LOAD_SECONDS = 1.9

const curtain: Variants = {
  initial: {},
  animate: {},
  exit: { transition: { staggerChildren: 0.07, delayChildren: 0.28 } },
}
const column: Variants = {
  initial: { y: 0 },
  animate: { y: 0 },
  exit: { y: '-101%', transition: { duration: 0.7, ease: EASE_IN_OUT } },
}
const content: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 0, scale: 1.06, filter: 'blur(8px)', transition: { duration: 0.38, ease: 'easeIn' } },
}

const LETTERS = ['K', 'H', 'S']

function Intro({ reduce }: { reduce: boolean }) {
  const progress = useMotionValue(0)
  const rounded = useTransform(progress, (v) => String(Math.round(v)).padStart(3, '0'))
  const scaleX = useTransform(progress, (v) => v / 100)
  const ringLength = useTransform(progress, (v) => v / 100)

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: reduce ? 0.6 : LOAD_SECONDS,
      ease: [0.65, 0, 0.35, 1],
    })
    return () => controls.stop()
  }, [progress, reduce])

  return (
    <motion.div variants={content} className="absolute inset-0 select-none will-change-transform">
      {/* grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 20%, transparent 80%)',
        }}
      />

      {/* aurora blobs */}
      {!reduce && (
        <>
          <motion.div
            className="absolute -left-1/4 top-1/4 h-[55vmax] w-[55vmax] rounded-full blur-[90px]"
            style={{ background: 'radial-gradient(circle, rgba(255,92,57,0.22), transparent 65%)' }}
            animate={{ x: ['0%', '25%', '0%'], y: ['0%', '-10%', '0%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -right-1/4 bottom-0 h-[50vmax] w-[50vmax] rounded-full blur-[90px]"
            style={{ background: 'radial-gradient(circle, rgba(212,255,79,0.16), transparent 65%)' }}
            animate={{ x: ['0%', '-25%', '0%'], y: ['0%', '12%', '0%'] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* corner brackets */}
      {[
        'top-5 left-5 border-t-2 border-l-2 border-[#FF5C39]/70',
        'top-5 right-5 border-t-2 border-r-2 border-[#D4FF4F]/70',
        'bottom-5 left-5 border-b-2 border-l-2 border-[#D4FF4F]/70',
        'bottom-5 right-5 border-b-2 border-r-2 border-[#FF5C39]/70',
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={`absolute h-6 w-6 sm:h-8 sm:w-8 ${cls}`}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: EASE_OUT }}
        />
      ))}

      {/* centre stage */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-7">
        {/* orbit rings + monogram */}
        <div className="relative flex items-center justify-center" style={{ width: 'min(300px, 72vw)', height: 'min(300px, 72vw)' }}>
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden>
            <defs>
              <linearGradient id="ldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF5C39" />
                <stop offset="100%" stopColor="#D4FF4F" />
              </linearGradient>
            </defs>
            {/* ring that draws itself */}
            <motion.circle
              cx="100"
              cy="100"
              r="92"
              stroke="url(#ldGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ rotate: -90, transformOrigin: '100px 100px' }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.3, ease: EASE_OUT }}
            />
            {/* progress ring */}
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              stroke="#D4FF4F"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ rotate: -90, transformOrigin: '100px 100px', pathLength: ringLength }}
            />
            {/* counter-rotating dashed orbit with satellites */}
            <motion.g
              style={{ transformOrigin: '100px 100px' }}
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="100" cy="100" r="68" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="2 7" />
              <circle cx="100" cy="32" r="3.5" fill="#FF5C39" />
              <circle cx="168" cy="100" r="2.5" fill="#D4FF4F" />
            </motion.g>
          </svg>

          {/* glow */}
          <div
            className="absolute h-1/2 w-1/2 rounded-full blur-3xl opacity-40"
            style={{ background: 'radial-gradient(circle, rgba(255,92,57,0.7), rgba(212,255,79,0.4))' }}
          />

          {/* monogram — each letter slides up out of a mask */}
          <div className="relative z-10 flex items-end gap-1 sm:gap-2" aria-label="KHS">
            {LETTERS.map((l, i) => (
              <span key={l} className="block overflow-hidden pb-1">
                <motion.span
                  className="block font-black leading-[0.9]"
                  style={{
                    fontSize: 'clamp(44px, 12vw, 76px)',
                    color: i === 1 ? '#D4FF4F' : i === 0 ? '#FF5C39' : '#ffffff',
                    textShadow: `0 0 30px ${i === 0 ? 'rgba(255,92,57,0.8)' : i === 1 ? 'rgba(212,255,79,0.8)' : 'rgba(255,255,255,0.5)'}`,
                  }}
                  initial={{ y: '115%', rotate: 6 }}
                  animate={{ y: '0%', rotate: 0 }}
                  transition={{ duration: 0.95, delay: 0.25 + i * 0.12, ease: EASE_OUT }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </div>
        </div>

        {/* name + role */}
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <span className="block overflow-hidden">
            <motion.p
              className="font-mono text-[12px] sm:text-sm text-white/80 uppercase"
              initial={{ y: '120%', opacity: 0, letterSpacing: '0.6em' }}
              animate={{ y: 0, opacity: 1, letterSpacing: '0.2em' }}
              transition={{ duration: 1.1, delay: 0.7, ease: EASE_OUT }}
            >
              Khwaja Hussain Shaikh
            </motion.p>
          </span>
          <motion.p
            className="font-mono text-[10px] sm:text-[11px] tracking-[0.35em] text-[#D4FF4F]/80 uppercase"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: EASE_OUT }}
          >
            Full Stack Developer
          </motion.p>
        </div>
      </div>

      {/* bottom: counter + progress bar */}
      <div className="absolute bottom-8 left-1/2 w-[min(320px,78vw)] -translate-x-1/2">
        <div className="mb-2 flex items-end justify-between font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
          <span>Loading experience</span>
          <span className="text-sm text-[#FF5C39] tabular-nums tracking-normal">
            <motion.span>{rounded}</motion.span>%
          </span>
        </div>
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full w-full origin-left"
            style={{ scaleX, background: 'linear-gradient(to right, #FF5C39, #D4FF4F)' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function LoadingScreen() {
  const reduce = useReducedMotion() ?? false
  const [loading, setLoading] = useState(true)

  /* dismiss when the progress animation is done (+ a beat) */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ((reduce ? 0.6 : LOAD_SECONDS) + 0.1) * 1000)
    return () => clearTimeout(t)
  }, [reduce])

  /* freeze scroll behind the intro so nothing janks underneath */
  useEffect(() => {
    if (!loading) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prev
    }
  }, [loading])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9990]"
          variants={curtain}
          initial="initial"
          animate="animate"
          exit="exit"
          role="status"
          aria-label="Loading portfolio"
        >
          {/* curtain columns — plain dark panels with a glowing lower edge */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: COLUMNS }).map((_, i) => (
              <motion.div
                key={i}
                variants={column}
                className="relative h-full flex-1 bg-[#0A0A0A] will-change-transform"
                style={{ marginRight: i < COLUMNS - 1 ? -1 : 0 }}
              >
                <span
                  className="absolute bottom-0 left-0 right-0 h-[3px]"
                  style={{ background: i % 2 ? '#D4FF4F' : '#FF5C39', boxShadow: `0 0 18px ${i % 2 ? '#D4FF4F' : '#FF5C39'}` }}
                />
              </motion.div>
            ))}
          </div>

          <Intro reduce={reduce} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
