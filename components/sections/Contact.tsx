'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMail, FiGithub, FiLinkedin,
  FiSend, FiMessageSquare, FiPaperclip, FiX, FiFile,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

const contactLinks = [
  { icon: FiMail,     label: 'Email',    value: 'khwajashaikh703@gmail.com',    href: 'mailto:khwajashaikh703@gmail.com' },
  { icon: FaWhatsapp, label: 'WhatsApp', value: 'Message me on WhatsApp',        href: 'https://wa.me/917039551617' },
  { icon: FiGithub,   label: 'GitHub',   value: 'github.com/Shkkhwaja',          href: 'https://github.com/Shkkhwaja/' },
  { icon: FiLinkedin, label: 'LinkedIn', value: 'linkedin.com/in/khwaja-shaikh', href: 'https://linkedin.com/in/khwaja-shaikh-960b981b1/' },
]

/* ── Floating label input ─────────────────────────────────── */
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

/* ── Floating label textarea ──────────────────────────────── */
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

/* ── Optional attachment picker ───────────────────────────── */
function AttachmentPicker({
  file, onChange,
}: {
  file: File | null; onChange: (f: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const fmt = (b: number) =>
    b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`

  const pick = (f: File | undefined) => {
    if (!f) return
    if (f.size > 10 * 1024 * 1024) {
      alert('File too large — max 10 MB')
      return
    }
    onChange(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    pick(e.dataTransfer.files[0])
  }

  const clear = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />

      {!file ? (
        <motion.div
          className="flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-colors duration-200"
          style={{
            borderColor: dragOver ? '#FF5C39' : 'var(--border)',
            backgroundColor: dragOver ? 'rgba(255,92,57,0.04)' : 'var(--bg)',
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          whileHover={{ borderColor: '#FF5C39' }}
          transition={{ duration: 0.15 }}
        >
          <FiPaperclip size={18} className="text-[var(--muted)]" />
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--muted)]">
              Attach a file{' '}
              <span className="text-[#FF5C39] font-semibold">— Optional</span>
            </p>
            <p className="text-[11px] font-mono text-[var(--muted)] mt-0.5">
              PDF · DOC · DOCX · TXT · JPG · PNG &nbsp;·&nbsp; max 10 MB
            </p>
          </div>
          <p className="text-[10px] text-[var(--muted)] opacity-60">
            Click to browse or drag &amp; drop
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl border bg-[var(--bg)]"
          style={{ borderColor: '#FF5C39' }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-9 h-9 rounded-lg bg-[#FF5C39]/10 border border-[#FF5C39]/30 flex items-center justify-center flex-shrink-0">
            <FiFile size={16} className="text-[#FF5C39]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--fg)] truncate">{file.name}</p>
            <p className="text-[11px] font-mono text-[var(--muted)]">{fmt(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={clear}
            className="w-7 h-7 rounded-lg hover:bg-[var(--border)] flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Remove file"
          >
            <FiX size={14} className="text-[var(--muted)]" />
          </button>
        </motion.div>
      )}
    </>
  )
}

/* ── Main section ─────────────────────────────────────────── */
export default function Contact() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [file,    setFile]    = useState<File | null>(null)
  const [status,  setStatus]  = useState<SubmitStatus>('idle')
  const [errMsg,  setErrMsg]  = useState('')

  const reset = () => {
    setName(''); setEmail(''); setSubject(''); setMessage(''); setFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrMsg('')

    const fd = new FormData()
    fd.append('name',    name)
    fd.append('email',   email)
    fd.append('subject', subject)
    fd.append('message', message)
    if (file) fd.append('attachment', file, file.name)

    try {
      const res  = await fetch('/api/contact', { method: 'POST', body: fd })
      const data = await res.json() as { success: boolean; error?: string }

      if (data.success) {
        setStatus('success')
        reset()
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setErrMsg(data.error ?? 'Something went wrong.')
        setStatus('error')
        setTimeout(() => setStatus('idle'), 5000)
      }
    } catch {
      setErrMsg('Network error — check your connection.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
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
            <div className="p-6 rounded-2xl bg-[#FF5C39] text-white space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <FiMessageSquare size={18} />
                <span className="text-sm font-bold opacity-80">Have a project in mind?</span>
              </div>
              <h3 className="text-xl font-black">Open for freelance &amp; full-time roles</h3>
              <p className="text-sm opacity-85 leading-relaxed">
                Whether it's a project, a job opportunity, or just a hello — I always reply.
              </p>
            </div>

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
              <FloatingInput id="name"    label="Your Name"     value={name}    onChange={setName}    required />
              <FloatingInput id="email"   label="Email Address"  type="email" value={email}   onChange={setEmail}   required />
              <FloatingInput id="subject" label="Subject"        value={subject} onChange={setSubject} required />
              <FloatingTextarea id="message" label="Message"     value={message} onChange={setMessage} required />
              <AttachmentPicker file={file} onChange={setFile} />

              {/* Error detail */}
              <AnimatePresence>
                {status === 'error' && errMsg && (
                  <motion.p
                    className="text-xs text-red-400 font-mono text-center px-3"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {errMsg}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm transition-all duration-200 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: status === 'success' ? '#22c55e' : status === 'error' ? '#ef4444' : '#FF5C39',
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
                      ✓ Sent — I'll reply soon!
                    </motion.span>
                  )}
                  {status === 'error' && (
                    <motion.span key="error" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      ✗ Failed — try again
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
