'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import FloatingBackground from '@/components/ui/FloatingBackground'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

const roles = ['Full Stack Developer', 'MERN Stack Engineer', 'Next.js Specialist', 'React Developer']
const HEADING = ['FULL', 'STACK', 'DEVELOPER']

const stats = [
  { value: '1.3', label: 'Years Experience' },
  { value: '10+', label: 'Projects' },
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
    <section id="hero" className="relative sm:min-h-screen flex flex-col overflow-hidden">
      <FloatingBackground />

      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-4xl mx-auto px-6 md:px-12 pt-24 pb-12">
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

            {/* Typewriter */}
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
                Let&apos;s Talk
              </button>
            </motion.div>

            {/* Social links */}
            <motion.div
              className="flex items-center gap-2 pt-1 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.9, duration: 0.5 }}
            >
              {[
                { label: 'GitHub',   href: 'https://github.com/Shkkhwaja/',                   icon: FiGithub   },
                { label: 'LinkedIn', href: 'https://linkedin.com/in/khwaja-shaikh-960b981b1/', icon: FiLinkedin },
                { label: 'Email',    href: 'mailto:khwajashaikh703@gmail.com',                 icon: FiMail     },
              ].map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={label !== 'Email' ? '_blank' : undefined}
                  rel={label !== 'Email' ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium border transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    borderColor: 'rgba(255,255,255,0.18)',
                    color: 'var(--fg)',
                    backgroundColor: 'var(--bg-2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FF5C39'
                    e.currentTarget.style.color = '#FF5C39'
                    e.currentTarget.style.backgroundColor = 'rgba(255,92,57,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
                    e.currentTarget.style.color = 'var(--fg)'
                    e.currentTarget.style.backgroundColor = 'var(--bg-2)'
                  }}
                >
                  <Icon size={12} />
                  {label}
                </a>
              ))}
            </motion.div>
          </div>
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
        className="absolute bottom-[7rem] left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
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
