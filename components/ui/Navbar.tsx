'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useActiveSection } from '@/hooks/useActiveSection'
import ThemeToggle from './ThemeToggle'
import { HiMenuAlt3, HiX } from 'react-icons/hi'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Certs', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
]

const sectionIds = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'certifications', 'contact']

function MagneticNavLink({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 280, damping: 20 })
  const sy = useSpring(y, { stiffness: 280, damping: 20 })
  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className="relative group px-1.5 py-2 flex flex-col items-center"
    >
      {/* Hover background pill */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute inset-0 rounded-lg"
            style={{ background: isActive ? 'rgba(255,92,57,0.12)' : 'rgba(255,255,255,0.06)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
          />
        )}
      </AnimatePresence>

      {/* Letter-split label */}
      <span className="relative flex items-center gap-0 text-sm font-semibold tracking-wide overflow-hidden">
        {label.split('').map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            animate={{
              y: hovered ? [0, -3, 0] : 0,
              color: isActive ? '#FF5C39' : hovered ? '#FF5C39' : 'var(--muted)',
            }}
            transition={{
              y: { delay: i * 0.035, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
              color: { duration: 0.2 },
            }}
          >
            {ch}
          </motion.span>
        ))}
      </span>

      {/* Active underline */}
      <motion.span
        className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full bg-[#FF5C39]"
        initial={false}
        animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0.5 }}
      />

      {/* Hover underline */}
      <motion.span
        className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full"
        style={{ background: 'var(--lime)' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered && !isActive ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useActiveSection(sectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 h-[72px]"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          backgroundColor: scrolled ? 'rgba(10,10,10,0.88)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'background-color 0.3s, border-color 0.3s',
        }}
      >
        {/* Logo */}
        <motion.button
          onClick={() => scrollTo('#hero')}
          className="flex items-end gap-0.5 group"
          aria-label="Scroll to top"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          <span className="text-2xl font-black text-[#FF5C39] leading-none">K</span>
          <span className="text-2xl font-black text-[var(--lime)] leading-none">S</span>
        </motion.button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <MagneticNavLink
                label={label}
                isActive={activeSection === href.replace('#', '')}
                onClick={() => scrollTo(href)}
              />
            </motion.div>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Mobile hamburger — always visible with orange ring */}
          <motion.button
            className="md:hidden relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#FF5C39] text-[#FF5C39] bg-[#FF5C39]/10 backdrop-blur-sm"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.88 }}
            animate={{ rotate: menuOpen ? 135 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {menuOpen ? <HiX size={19} /> : <HiMenuAlt3 size={19} />}
            {/* Ping ring only when closed */}
            {!menuOpen && (
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-[#FF5C39]"
                animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(24px)' }}
            initial={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 3.5rem) 3.5rem)' }}
            animate={{ opacity: 1, clipPath: 'circle(160% at calc(100% - 3.5rem) 3.5rem)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 3.5rem) 3.5rem)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Decorative orange glow spot */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FF5C39]/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#D4FF4F]/8 blur-3xl pointer-events-none" />

            <nav className="flex flex-col items-center gap-5">
              {navLinks.map(({ label, href }, i) => (
                <motion.button
                  key={href}
                  onClick={() => scrollTo(href)}
                  className="relative group text-[clamp(2.4rem,9vw,4rem)] font-black text-white"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ delay: i * 0.065, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Hover underline */}
                  <span className="relative inline-block">
                    {label}
                    <motion.span
                      className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-[#FF5C39]"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.25 }}
                    />
                  </span>
                  {/* Leading arrow */}
                  <motion.span
                    className="absolute -left-10 top-1/2 -translate-y-1/2 text-[#FF5C39] font-black"
                    initial={{ opacity: 0, x: -4 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ›
                  </motion.span>
                </motion.button>
              ))}
            </nav>

            <motion.p
              className="absolute bottom-10 text-xs font-mono text-[var(--muted)] tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              KHS · FULL STACK DEV · MUMBAI
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
