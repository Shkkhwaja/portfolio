'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiPhone, FiGithub, FiLinkedin, FiSend, FiMessageSquare } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

const contactLinks = [
  { icon: FiMail,     label: 'Email',     value: 'khwajashaikh703@gmail.com', href: 'mailto:khwajashaikh703@gmail.com' },
  { icon: FiPhone,    label: 'Phone',     value: '+91 7039551617', href: 'tel:+917039551617' },
  { icon: FaWhatsapp, label: 'WhatsApp',  value: '+91 7039551617', href: 'https://wa.me/917039551617' },
  { icon: FiGithub,   label: 'GitHub',    value: 'github.com/Shkkhwaja', href: 'https://github.com/Shkkhwaja/' },
  { icon: FiLinkedin, label: 'LinkedIn',  value: 'linkedin.com/in/khwaja-shaikh', href: 'https://linkedin.com/in/khwaja-shaikh-960b981b1/' },
]

function FloatingInput({
  id, label, type = 'text', value, onChange, required,
}: {
  id: string; label: string; type?: string
  value: string; onChange: (v: string) => void; required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const isUp = focused || value.length > 0

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="absolute left-4 transition-all duration-200 pointer-events-none z-10 font-mono"
        style={{
          top: isUp ? '8px' : '50%',
          transform: isUp ? 'translateY(0) scale(0.75)' : 'translateY(-50%)',
          transformOrigin: 'left',
          color: focused ? '#FF5C39' : 'var(--muted)',
          fontSize: isUp ? '10px' : '14px',
        }}
      >
        {label}{required && ' *'}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className="w-full px-4 pt-6 pb-2 rounded-xl bg-[var(--bg)] border transition-colors duration-200 text-sm text-[var(--fg)] outline-none"
        style={{ borderColor: focused ? '#FF5C39' : 'var(--border)' }}
      />
    </div>
  )
}

function FloatingTextarea({
  id, label, value, onChange, required,
}: {
  id: string; label: string
  value: string; onChange: (v: string) => void; required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const isUp = focused || value.length > 0

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="absolute left-4 transition-all duration-200 pointer-events-none z-10 font-mono"
        style={{
          top: isUp ? '10px' : '20px',
          transform: `scale(${isUp ? 0.75 : 1})`,
          transformOrigin: 'left',
          color: focused ? '#FF5C39' : 'var(--muted)',
          fontSize: '14px',
        }}
      >
        {label}{required && ' *'}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        rows={5}
        className="w-full px-4 pt-8 pb-3 rounded-xl bg-[var(--bg)] border transition-colors duration-200 text-sm text-[var(--fg)] outline-none resize-none"
        style={{ borderColor: focused ? '#FF5C39' : 'var(--border)' }}
      />
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const set = (key: keyof FormState) => (v: string) => setForm((p) => ({ ...p, [key]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 4000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-mono text-[#FF5C39] tracking-widest uppercase mb-3">07 — Contact</p>
          <h2 className="text-4xl md:text-6xl font-black text-[var(--fg)]">
            Let's <span className="text-[#FF5C39]">Talk</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            {/* CTA banner */}
            <div className="p-6 rounded-2xl bg-[#FF5C39] text-white space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <FiMessageSquare size={18} />
                <span className="text-sm font-bold opacity-80">Have a project in mind?</span>
              </div>
              <h3 className="text-xl font-black">Open for freelance & full-time roles</h3>
              <p className="text-sm opacity-85 leading-relaxed">
                Whether it's a project, a job opportunity, or just a hello — I always reply.
              </p>
            </div>

            {/* Availability indicator */}
            <div className="flex items-center gap-3 p-4 rounded-xl border border-[#22c55e]/30 bg-[#22c55e]/5">
              <div className="relative flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#22c55e] animate-ping opacity-60" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--fg)]">Currently available</p>
                <p className="text-xs text-[var(--muted)]">Response time: usually within 24 hours</p>
              </div>
            </div>

            {/* Contact links */}
            <div className="space-y-2.5">
              {contactLinks.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[#FF5C39]/50 transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center group-hover:bg-[#FF5C39] group-hover:border-[#FF5C39] transition-all duration-200">
                    <Icon size={16} className="text-[var(--muted)] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]">{label}</p>
                    <p className="text-sm font-medium text-[var(--fg)] group-hover:text-[#FF5C39] transition-colors">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <FloatingInput id="name"    label="Your Name"      value={form.name}    onChange={set('name')}    required />
              <FloatingInput id="email"   label="Email Address"  type="email" value={form.email}   onChange={set('email')}   required />
              <FloatingInput id="subject" label="Subject"        value={form.subject} onChange={set('subject')} required />
              <FloatingTextarea id="message" label="Message"     value={form.message} onChange={set('message')} required />

              <motion.button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm transition-all duration-200 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: status === 'success' ? '#22c55e' : '#FF5C39',
                  color: 'white',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.span key="idle" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <FiSend size={15} /> Send Message
                    </motion.span>
                  )}
                  {status === 'loading' && (
                    <motion.span key="loading" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending...
                    </motion.span>
                  )}
                  {status === 'success' && (
                    <motion.span key="success" className="flex items-center gap-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      ✓ Message Sent — I'll reply soon!
                    </motion.span>
                  )}
                  {status === 'error' && (
                    <motion.span key="error" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      ✗ Failed — please try again
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <p className="text-[11px] text-[var(--muted)] text-center font-mono">
                Or email directly at{' '}
                <a href="mailto:khwajashaikh703@gmail.com" className="text-[#FF5C39] hover:underline">
                  khwajashaikh703@gmail.com
                </a>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
