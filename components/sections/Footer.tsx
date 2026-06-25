'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
]

const socials = [
  { icon: FiGithub, href: 'https://github.com/Shkkhwaja/', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://linkedin.com/in/khwaja-shaikh-960b981b1/', label: 'LinkedIn' },
  { icon: FaWhatsapp, href: 'https://wa.me/917039551617', label: 'WhatsApp' },
  { icon: FiMail, href: 'mailto:khwajashaikh703@gmail.com', label: 'Email' },
]

export default function Footer() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.85)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-2)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-12">

          {/* Logo + tagline */}
          <div className="space-y-3">
            <div className="flex items-end gap-0.5">
              <span className="text-3xl font-black text-[#FF5C39]">K</span>
              <span className="text-3xl font-black text-[var(--lime)]">S</span>
            </div>
            <p className="text-sm text-[var(--muted)] max-w-xs">
              Full Stack Developer building scalable web applications with MERN stack and Next.js.
            </p>
            <p className="text-xs font-mono text-[var(--muted)]">
              📍 Mumbai, Maharashtra, India
            </p>
          </div>

          {/* Quick nav */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {navLinks.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className="text-sm text-[var(--muted)] hover:text-[#FF5C39] transition-colors font-medium"
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[#FF5C39] hover:text-[#FF5C39] transition-all duration-200 hover:scale-110"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Big divider text */}
        <div className="border-t border-[var(--border)] pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--muted)] font-mono">
              © {new Date().getFullYear()} Khwaja Hussain Shaikh. All rights reserved.
            </p>
            <p className="text-xs text-[var(--muted)] font-mono">
              Built with{' '}
              <span className="text-[#FF5C39]">Next.js</span>,{' '}
              <span className="text-[var(--lime)]">Tailwind CSS</span>, &{' '}
              <span className="text-[#FF5C39]">Framer Motion</span>
            </p>
          </div>
        </div>
      </div>

      {/* Back to top — hidden until scrolled past hero; on mobile floats above the robot */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed z-50 flex items-center justify-center rounded-full bg-[#FF5C39] text-white shadow-lg hover:bg-[#e84d2b] transition-colors
              bottom-[5.5rem] right-3 w-9 h-9 text-sm
              sm:bottom-8 sm:right-8 sm:w-12 sm:h-12 sm:text-base"
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Back to top"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  )
}
