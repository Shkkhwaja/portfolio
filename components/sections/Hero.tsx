'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import FloatingBackground from '@/components/ui/FloatingBackground'

const ProfileScene = dynamic(() => import('@/components/three/ProfileScene'), { ssr: false })

const roles = ['Full Stack Developer', 'MERN Stack Engineer', 'Next.js Specialist', 'React Developer']
const HEADING = ['FULL', 'STACK', 'DEVELOPER']

const stats = [
  { value: '1.3', label: 'Years Experience' },
  { value: '7+', label: 'Projects Shipped' },
  { value: '10+', label: 'Technologies' },
]

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const current = roles[roleIndex]
    let i = 0
    let timeout: ReturnType<typeof setTimeout>

    if (typing) {
      const type = () => {
        if (i <= current.length) {
          setDisplayText(current.slice(0, i))
          i++
          timeout = setTimeout(type, 65)
        } else {
          timeout = setTimeout(() => setTyping(false), 1600)
        }
      }
      type()
    } else {
      const erase = () => {
        if (i >= 0) {
          setDisplayText(current.slice(0, i))
          i--
          timeout = setTimeout(erase, 35)
        } else {
          setRoleIndex((prev) => (prev + 1) % roles.length)
          setTyping(true)
        }
      }
      i = current.length
      erase()
    }

    return () => clearTimeout(timeout)
  }, [roleIndex, typing])

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden">
      <FloatingBackground />

      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── LEFT — Text ── */}
          <div className="space-y-6">

            {/* Availability pill */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-2)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.8 }}
            >
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-sm font-mono text-[var(--muted)]">Available for freelance work</span>
            </motion.div>

            {/* Heading */}
            <div className="space-y-1">
              {HEADING.map((word, wi) => (
                <div key={word} className="overflow-hidden">
                  <motion.h1
                    className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-tight"
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 2.8 + wi * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {wi === 0 && <span className="text-[#FF5C39]">{word}</span>}
                    {wi === 1 && <span className="text-[var(--fg)]">{word}</span>}
                    {wi === 2 && (
                      <span style={{ WebkitTextStroke: '2px var(--fg)', color: 'transparent' }}>
                        {word}
                      </span>
                    )}
                  </motion.h1>
                </div>
              ))}
            </div>

            {/* Typewriter — lime uses CSS var so it's readable in both modes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.3, duration: 0.5 }}
            >
              <span className="text-base md:text-lg text-[var(--muted)] font-mono">
                &gt;{' '}
                <span style={{ color: 'var(--lime)' }}>{displayText}</span>
                <span
                  className="inline-block w-[2px] h-[1.1em] ml-0.5 align-middle animate-pulse"
                  style={{ backgroundColor: 'var(--lime)' }}
                />
              </span>
            </motion.div>

            {/* Summary */}
            <motion.p
              className="text-base md:text-lg text-[var(--muted)] leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5, duration: 0.6 }}
            >
              Full Stack Developer with hands-on experience in the MERN stack and Next.js.
              Building scalable web applications from{' '}
              <span className="text-[#FF5C39] font-medium">Mumbai, India 🇮🇳</span>
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-wrap gap-4 pt-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.7, duration: 0.5 }}
            >
              <button
                onClick={() => scrollTo('projects')}
                className="px-7 py-3.5 bg-[#FF5C39] text-white font-semibold rounded-full hover:bg-[#e84d2b] active:scale-95 transition-all duration-200 text-sm"
              >
                View Work ↓
              </button>
              <a
                href="/resume.pdf"
                download
                className="px-7 py-3.5 border border-[var(--border)] text-[var(--fg)] font-semibold rounded-full hover:border-[#FF5C39] hover:text-[#FF5C39] active:scale-95 transition-all duration-200 text-sm"
              >
                Resume ↗
              </a>
              <button
                onClick={() => scrollTo('contact')}
                className="px-7 py-3.5 border font-semibold rounded-full active:scale-95 transition-all duration-200 text-sm"
                style={{ borderColor: 'var(--lime)', color: 'var(--lime)' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.backgroundColor = 'var(--lime)'
                  el.style.color = '#0A0A0A'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.backgroundColor = 'transparent'
                  el.style.color = 'var(--lime)'
                }}
              >
                Let's Talk
              </button>
            </motion.div>

            {/* Social links */}
            <motion.div
              className="flex items-center gap-4 pt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.9, duration: 0.5 }}
            >
              <a href="https://github.com/Shkkhwaja/" target="_blank" rel="noopener noreferrer"
                className="text-xs font-mono text-[var(--muted)] hover:text-[#FF5C39] transition-colors">
                GitHub ↗
              </a>
              <span className="text-[var(--border)]">·</span>
              <a href="https://linkedin.com/in/khwaja-shaikh-960b981b1/" target="_blank" rel="noopener noreferrer"
                className="text-xs font-mono text-[var(--muted)] hover:text-[#FF5C39] transition-colors">
                LinkedIn ↗
              </a>
              <span className="text-[var(--border)]">·</span>
              <a href="mailto:khwajashaikh703@gmail.com"
                className="text-xs font-mono text-[var(--muted)] hover:text-[#FF5C39] transition-colors">
                Email ↗
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT — 3D Profile Scene ── */}
          <motion.div
            className="relative flex items-center justify-center h-[500px] md:h-[640px]"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.0, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ProfileScene fills the column */}
            <div className="absolute inset-0 z-10">
              <ProfileScene />
            </div>

            {/* Stack badge — top right, floats */}
            <motion.div
              className="absolute top-6 right-0 z-20 bg-[#FF5C39] text-white px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-lg"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              MERN · Next.js · TypeScript
            </motion.div>

            {/* Floating code snippet — top left (replaces social card) */}
            <motion.div
              className="absolute top-6 left-0 z-20 bg-[#0D0D0D] border border-[#2a2a2a] rounded-2xl p-4 font-mono text-xs shadow-2xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              <div className="text-[#555] mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/70" />
                <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
                <span className="w-2 h-2 rounded-full bg-green-400/70" />
                <span className="ml-1 text-[10px]">khwaja.ts</span>
              </div>
              <div className="space-y-0.5">
                <div><span className="text-[#C792EA]">const </span><span className="text-[#D4FF4F]">dev</span><span className="text-white"> = {"{"}</span></div>
                <div className="pl-3"><span className="text-[#FF5C39]">city</span><span className="text-white">: </span><span className="text-[#C3E88D]">"Mumbai 🇮🇳"</span><span className="text-white">,</span></div>
                <div className="pl-3"><span className="text-[#FF5C39]">exp</span><span className="text-white">: </span><span className="text-[#C3E88D]">"1.3 yrs"</span><span className="text-white">,</span></div>
                <div className="pl-3"><span className="text-[#FF5C39]">open</span><span className="text-white">: </span><span className="text-[#D4FF4F]">true</span></div>
                <div><span className="text-white">{"}"}</span></div>
              </div>
            </motion.div>

            {/* Name plate — bottom centre overlay */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <div className="px-5 py-2 rounded-xl backdrop-blur-md bg-[#0A0A0A]/70 border border-white/10 text-center">
                <p className="text-sm font-bold text-white">Khwaja Hussain Shaikh</p>
                <p className="text-[10px] font-mono text-[#D4FF4F]">Full Stack Developer · Mumbai 🇮🇳</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <motion.div
        className="relative z-10 border-t border-[var(--border)] bg-[var(--bg-2)]/70 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.0, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-wrap justify-around gap-6">
          {stats.map(({ value, label }, i) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span
                className="text-3xl md:text-4xl font-black"
                style={{ color: i % 2 === 0 ? '#FF5C39' : 'var(--lime)' }}
              >
                {value}
              </span>
              <span className="text-xs text-[var(--muted)] uppercase tracking-widest font-mono">
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Scroll hint ── */}
      <motion.div
        className="absolute bottom-[7rem] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.3, duration: 0.5 }}
      >
        <motion.div
          className="w-[1px] h-12 bg-gradient-to-b from-[#FF5C39] to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originY: 'top' }}
        />
        <span className="text-[10px] text-[var(--muted)] font-mono tracking-widest uppercase">
          Scroll
        </span>
      </motion.div>
    </section>
  )
}
