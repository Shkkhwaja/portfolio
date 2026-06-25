'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Particle = { id: number; x: number; y: number; size: number; dur: number; del: number; color: string; op: number }

const BOOT_LINES = ['> SYSTEM INIT...', '> AUTH: OK', '> LOADING PORTFOLIO']

function LoadingContent({ progress }: { progress: number }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [bootLine, setBootLine] = useState(0)

  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.6,
        dur: Math.random() * 5 + 3,
        del: Math.random() * 2,
        color: (['#FF5C39', '#D4FF4F', '#ffffff'] as const)[i % 3],
        op: Math.random() * 0.18 + 0.05,
      }))
    )
    const t1 = setTimeout(() => setBootLine(1), 180)
    const t2 = setTimeout(() => setBootLine(2), 450)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="absolute inset-0 bg-[#0A0A0A] overflow-hidden select-none">

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 35%, #0A0A0A 100%)' }}
      />

      {/* Center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,92,57,0.07) 0%, transparent 70%)' }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, backgroundColor: p.color, opacity: p.op }}
          animate={{ y: ['-8px', '8px', '-8px'] }}
          transition={{ duration: p.dur, delay: p.del, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Fast scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, transparent 5%, rgba(212,255,79,0.45) 50%, transparent 95%)' }}
        animate={{ top: ['-2px', '100vh'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: 0.2 }}
      />

      {/* Corner brackets */}
      {[
        'top-4 left-4 border-t-2 border-l-2 border-[#FF5C39]/70',
        'top-4 right-4 border-t-2 border-r-2 border-[#D4FF4F]/70',
        'bottom-4 left-4 border-b-2 border-l-2 border-[#D4FF4F]/70',
        'bottom-4 right-4 border-b-2 border-r-2 border-[#FF5C39]/70',
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={`absolute w-5 h-5 sm:w-6 sm:h-6 ${cls}`}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {/* Boot lines — top-left terminal */}
      <div className="absolute top-9 left-6 sm:left-12 font-mono space-y-[3px]">
        {BOOT_LINES.slice(0, bootLine + 1).map((line, i) => (
          <motion.div
            key={i}
            className={`text-[9px] sm:text-[10px] ${i === bootLine ? 'text-[#D4FF4F]' : 'text-white/18'}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
          >
            {line}
            {i === bootLine && (
              <motion.span
                className="inline-block w-[5px] h-[9px] bg-[#D4FF4F] ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.45, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Progress % — top-right */}
      <motion.span
        className="absolute top-[22px] right-8 sm:right-14 font-mono text-[11px] text-[#FF5C39] tabular-nums"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {String(progress).padStart(3, '0')}%
      </motion.span>

      {/* Side data-stream lines */}
      <motion.div
        className="absolute left-5 top-1/2 h-px bg-gradient-to-r from-transparent to-[#FF5C39]/25"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '15%', opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
      <motion.div
        className="absolute right-5 top-1/2 h-px bg-gradient-to-l from-transparent to-[#D4FF4F]/25"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '15%', opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">

        {/* KS Monogram with glitch effect */}
        <div className="relative">
          {/* Ambient glow blob */}
          <div
            className="absolute -inset-8 blur-3xl opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,92,57,0.6) 0%, rgba(212,255,79,0.4) 100%)' }}
          />

          <div className="relative flex items-end gap-1.5 z-10">
            {/* K */}
            <div className="relative">
              <motion.span
                className="font-black text-[#FF5C39] leading-none block"
                style={{
                  fontSize: 'clamp(72px, 20vw, 128px)',
                  textShadow: '0 0 40px rgba(255,92,57,0.9), 0 0 80px rgba(255,92,57,0.4)',
                }}
                initial={{ opacity: 0, y: 24, filter: 'blur(20px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                K
              </motion.span>
              {/* Glitch layer K */}
              <motion.span
                className="absolute inset-0 font-black text-[#D4FF4F] leading-none pointer-events-none"
                style={{ fontSize: 'clamp(72px, 20vw, 128px)' }}
                animate={{
                  x: [0, -4, 3, -1, 0, 2, -2, 0],
                  opacity: [0, 0.8, 0, 0.6, 0, 0.4, 0, 0],
                  clipPath: [
                    'inset(30% 0 55% 0)', 'inset(30% 0 55% 0)',
                    'inset(65% 0 15% 0)', 'inset(65% 0 15% 0)',
                    'inset(10% 0 75% 0)', 'inset(10% 0 75% 0)',
                    'inset(45% 0 40% 0)', 'inset(45% 0 40% 0)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.08, 0.12, 0.22, 0.27, 0.38, 0.44, 1], delay: 0.9 }}
              >
                K
              </motion.span>
            </div>

            {/* S */}
            <div className="relative">
              <motion.span
                className="font-black text-[#D4FF4F] leading-none block"
                style={{
                  fontSize: 'clamp(72px, 20vw, 128px)',
                  textShadow: '0 0 40px rgba(212,255,79,0.9), 0 0 80px rgba(212,255,79,0.4)',
                }}
                initial={{ opacity: 0, y: 24, filter: 'blur(20px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                S
              </motion.span>
              {/* Glitch layer S */}
              <motion.span
                className="absolute inset-0 font-black text-[#FF5C39] leading-none pointer-events-none"
                style={{ fontSize: 'clamp(72px, 20vw, 128px)' }}
                animate={{
                  x: [0, 3, -2, 1, 0, -3, 2, 0],
                  opacity: [0, 0.7, 0, 0.5, 0, 0.35, 0, 0],
                  clipPath: [
                    'inset(50% 0 28% 0)', 'inset(50% 0 28% 0)',
                    'inset(18% 0 62% 0)', 'inset(18% 0 62% 0)',
                    'inset(72% 0 8% 0)',  'inset(72% 0 8% 0)',
                    'inset(38% 0 44% 0)', 'inset(38% 0 44% 0)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.08, 0.12, 0.22, 0.27, 0.38, 0.44, 1], delay: 1.3 }}
              >
                S
              </motion.span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <motion.div
          className="w-[min(220px,65vw)] h-px"
          style={{ background: 'linear-gradient(to right, transparent, #FF5C39 30%, #D4FF4F 70%, transparent)' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.38, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Name — single fade instead of letter-by-letter */}
        <motion.p
          className="font-mono text-[11px] sm:text-[13px] text-white/60 tracking-[0.12em] sm:tracking-[0.18em] px-4 text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.35 }}
        >
          Khwaja Hussain Shaikh
        </motion.p>

        {/* Role + blinking cursor */}
        <motion.div
          className="flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.38em] text-white/22 uppercase">
            Full Stack Developer
          </span>
          <motion.span
            className="inline-block w-[2px] h-3 bg-[#D4FF4F]"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.55, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.04]">
        <motion.div
          className="h-full"
          style={{ width: `${progress}%`, background: 'linear-gradient(to right, #FF5C39, #D4FF4F)' }}
        />
        <motion.div
          className="absolute top-0 h-[2px] w-20 pointer-events-none"
          style={{
            left: `${Math.max(0, progress - 10)}%`,
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.7), transparent)',
          }}
        />
      </div>
    </div>
  )
}

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  /* Progress 0→100 over ~1.6 s */
  useEffect(() => {
    let current = 0
    const iv = setInterval(() => {
      current = Math.min(current + (1.2 + Math.random() * 1.4) * (16 / 1600) * 100, 100)
      setProgress(Math.floor(current))
      if (current >= 100) clearInterval(iv)
    }, 16)
    return () => clearInterval(iv)
  }, [])

  /* Dismiss after 1.9 s */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1900)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <>
          {/* TOP panel — slides up on exit */}
          <motion.div
            key="ld-top"
            className="fixed top-0 left-0 right-0 z-[9990]"
            style={{ height: '50vh', overflow: 'hidden' }}
            exit={{ y: '-100%', transition: { duration: 0.62, ease: [0.76, 0, 0.24, 1] } }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh' }}>
              <LoadingContent progress={progress} />
            </div>
          </motion.div>

          {/* BOTTOM panel — slides down on exit */}
          <motion.div
            key="ld-bot"
            className="fixed bottom-0 left-0 right-0 z-[9990]"
            style={{ height: '50vh', overflow: 'hidden' }}
            exit={{ y: '100%', transition: { duration: 0.62, ease: [0.76, 0, 0.24, 1] } }}
          >
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100vh' }}>
              <LoadingContent progress={progress} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
