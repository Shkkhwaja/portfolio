'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Dot = { id: number; x: number; y: number; size: number; dur: number; del: number; color: string; op: number }

/* ─── Shared content rendered in both split panels ─────────── */
function LoadingContent({ progress }: { progress: number }) {
  const [dots, setDots] = useState<Dot[]>([])

  useEffect(() => {
    setDots(
      Array.from({ length: 45 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.8,
        dur: Math.random() * 10 + 8,
        del: Math.random() * 5,
        color: (['#FF5C39', '#D4FF4F', '#ffffff'] as const)[i % 3],
        op: Math.random() * 0.28 + 0.07,
      }))
    )
  }, [])

  const name = 'Khwaja Hussain Shaikh'
  const circumference = 2 * Math.PI * 168

  return (
    <div className="absolute inset-0 bg-[#0A0A0A] overflow-hidden select-none">

      {/* ── Grid ────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Vignette ────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, #0A0A0A 100%)' }}
      />

      {/* ── Center radial glow ─────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(255,92,57,0.09) 0%, transparent 70%)' }}
      />

      {/* ── Floating ambient dots ───────────────────────────── */}
      {dots.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            backgroundColor: d.color,
            opacity: d.op,
          }}
          animate={{ y: ['-10px', '10px', '-10px'], opacity: [d.op, Math.min(d.op * 2.8, 0.7), d.op] }}
          transition={{ duration: d.dur, delay: d.del, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Horizontal scan line ────────────────────────────── */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, transparent 5%, rgba(212,255,79,0.3) 50%, transparent 95%)' }}
        animate={{ top: ['-4px', '100vh'] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'linear', delay: 0.6 }}
      />

      {/* ── Corner brackets ─────────────────────────────────── */}
      {[
        'top-5 left-5 border-t-2 border-l-2 border-[#FF5C39]/60',
        'top-5 right-5 border-t-2 border-r-2 border-[#D4FF4F]/60',
        'bottom-5 left-5 border-b-2 border-l-2 border-[#D4FF4F]/60',
        'bottom-5 right-5 border-b-2 border-r-2 border-[#FF5C39]/60',
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={`absolute w-7 h-7 ${cls}`}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {/* ── Status labels ───────────────────────────────────── */}
      <motion.span
        className="absolute top-[22px] left-14 font-mono text-[10px] text-white/20 tracking-[0.3em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        INITIALISING
      </motion.span>

      <motion.span
        className="absolute top-[22px] right-14 font-mono text-[11px] text-[#FF5C39] tabular-nums"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {String(progress).padStart(3, '0')}%
      </motion.span>

      {/* ── Decorative horizontal lines left/right of center ── */}
      <motion.div
        className="absolute left-5 top-1/2 h-[1px] bg-gradient-to-r from-transparent to-[#FF5C39]/30"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '18%', opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      />
      <motion.div
        className="absolute right-5 top-1/2 h-[1px] bg-gradient-to-l from-transparent to-[#D4FF4F]/30"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '18%', opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      />

      {/* ── Center content ──────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">

        {/* Circular progress ring + KS */}
        <div className="relative flex items-center justify-center mb-7">
          {/* SVG ring */}
          <svg
            width="360"
            height="360"
            viewBox="0 0 360 360"
            className="absolute pointer-events-none"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Track */}
            <circle cx="180" cy="180" r="168" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            {/* Animated arc */}
            <motion.circle
              cx="180"
              cy="180"
              r="168"
              fill="none"
              stroke="url(#pgGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{ strokeDashoffset: circumference * (1 - progress / 100) }}
            />
            {/* Outer decorative ring */}
            <circle cx="180" cy="180" r="174" fill="none" stroke="rgba(255,92,57,0.06)" strokeWidth="0.5" strokeDasharray="4 8" />
            <defs>
              <linearGradient id="pgGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF5C39" />
                <stop offset="100%" stopColor="#D4FF4F" />
              </linearGradient>
            </defs>
          </svg>

          {/* Rotating outer dot on ring */}
          <motion.div
            className="absolute w-2.5 h-2.5 rounded-full bg-[#FF5C39] shadow-[0_0_12px_4px_rgba(255,92,57,0.6)]"
            style={{ top: '50%', left: '50%', marginLeft: -5, marginTop: -5 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            // orbit at r=168px
            // we use transformOrigin trick
          />

          {/* Pulsing background glow */}
          <motion.div
            className="absolute w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,92,57,0.12) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* KS monogram */}
          <div className="relative flex items-end gap-1 z-10">
            {/* Rotating ring accents */}
            <motion.div
              className="absolute -inset-8 rounded-full border border-[#FF5C39]/12"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute -inset-14 rounded-full border border-[#D4FF4F]/08"
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            />

            <motion.span
              className="text-[110px] font-black text-[#FF5C39] leading-none"
              style={{
                textShadow:
                  '0 0 30px rgba(255,92,57,0.7), 0 0 60px rgba(255,92,57,0.35), 0 0 100px rgba(255,92,57,0.15)',
              }}
              initial={{ x: -100, opacity: 0, filter: 'blur(24px)' }}
              animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              K
            </motion.span>

            <motion.span
              className="text-[110px] font-black text-[#D4FF4F] leading-none"
              style={{
                textShadow:
                  '0 0 30px rgba(212,255,79,0.7), 0 0 60px rgba(212,255,79,0.35), 0 0 100px rgba(212,255,79,0.15)',
              }}
              initial={{ x: 100, opacity: 0, filter: 'blur(24px)' }}
              animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              S
            </motion.span>
          </div>
        </div>

        {/* Divider */}
        <motion.div
          className="mb-4"
          style={{ height: 1, background: 'linear-gradient(to right, transparent, #FF5C39 30%, #D4FF4F 70%, transparent)' }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 240, opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Name — letter by letter */}
        <div className="flex flex-wrap justify-center gap-[0.5px] mb-2">
          {name.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="font-mono text-[13px]"
              style={{
                color:
                  i < 6
                    ? '#FF5C39'
                    : i < 13
                    ? 'rgba(255,255,255,0.75)'
                    : '#D4FF4F',
                width: ch === ' ' ? '0.45rem' : 'auto',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 + i * 0.048, duration: 0.22, ease: 'easeOut' }}
            >
              {ch}
            </motion.span>
          ))}
        </div>

        {/* Role */}
        <motion.p
          className="font-mono text-[10px] tracking-[0.42em] text-white/25 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3, duration: 0.6 }}
        >
          Full Stack Developer
        </motion.p>

        {/* Blinking cursor */}
        <motion.span
          className="inline-block w-[2px] h-3 bg-[#D4FF4F] mt-1 ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: 2.5 }}
        />
      </div>

      {/* ── Bottom progress bar ─────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/[0.04]">
        <motion.div
          className="h-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(to right, #FF5C39, #D4FF4F)',
          }}
        />
        {/* Travelling glow on bar */}
        <motion.div
          className="absolute top-0 h-[3px] w-24 pointer-events-none"
          style={{
            left: `${Math.max(0, progress - 12)}%`,
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.65), transparent)',
          }}
        />
      </div>
    </div>
  )
}

/* ─── Main export ───────────────────────────────────────────── */
export default function LoadingScreen() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  /* Smooth stochastic progress 0→100 over ~2.9 s */
  useEffect(() => {
    let current = 0
    const iv = setInterval(() => {
      current = Math.min(current + (0.65 + Math.random() * 0.8) * (16 / 2900) * 100, 100)
      setProgress(Math.floor(current))
      if (current >= 100) clearInterval(iv)
    }, 16)
    return () => clearInterval(iv)
  }, [])

  /* Dismiss after 3.2 s */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 3200)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <>
          {/* ── TOP PANEL — clips & slides up on exit ───────── */}
          <motion.div
            key="ld-top"
            className="fixed top-0 left-0 right-0 z-[9990]"
            style={{ height: '50vh', overflow: 'hidden' }}
            exit={{ y: '-100%', transition: { duration: 0.92, ease: [0.76, 0, 0.24, 1] } }}
          >
            {/* Full-height content anchored to top */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh' }}>
              <LoadingContent progress={progress} />
            </div>
          </motion.div>

          {/* ── BOTTOM PANEL — clips & slides down on exit ───── */}
          <motion.div
            key="ld-bot"
            className="fixed bottom-0 left-0 right-0 z-[9990]"
            style={{ height: '50vh', overflow: 'hidden' }}
            exit={{ y: '100%', transition: { duration: 0.92, ease: [0.76, 0, 0.24, 1] } }}
          >
            {/* Full-height content anchored to bottom so bottom-half shows */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100vh' }}>
              <LoadingContent progress={progress} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
