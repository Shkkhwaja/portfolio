'use client'

import { motion } from 'framer-motion'

const facts = [
  { label: 'Location', value: 'Mumbai, Maharashtra, India', icon: '📍' },
  { label: 'Email', value: 'khwajashaikh703@gmail.com', icon: '✉️' },
  { label: 'Degree', value: 'BCA — Tilak Maharashtra Vidyapeeth', icon: '🎓' },
  { label: 'Current Role', value: 'Full Stack Developer @ ZAR Luxury', icon: '💼' },
  { label: 'Status', value: 'Open to freelance & opportunities', icon: '🟢' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const codeLines = [
  { key: '"name"',      val: '"Khwaja Shaikh"',  color: '#C3E88D' },
  { key: '"role"',      val: '"Full Stack Dev"',  color: '#C3E88D' },
  { key: '"city"',      val: '"Mumbai 🇮🇳"',      color: '#C3E88D' },
  { key: '"exp"',       val: '"1.3 years"',        color: '#C3E88D' },
  { key: '"available"', val: 'true',              color: '#D4FF4F' },
]

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-mono text-[#FF5C39] tracking-widest uppercase mb-3">01 — About</p>
          <h2 className="text-4xl md:text-6xl font-black text-[var(--fg)]">
            Who I <span className="text-[#FF5C39]">Am</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — terminal card + bio */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            {/* Terminal code card */}
            <div className="relative w-full max-w-sm">
              <motion.div
                className="relative bg-[#0D0D0D] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2a2a2a]">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-[11px] text-[#555] font-mono">khwaja.json</span>
                </div>
                <div className="p-5 font-mono text-sm space-y-1">
                  <div className="text-[#555]">{'{'}</div>
                  {codeLines.map(({ key, val, color }) => (
                    <div key={key} className="pl-4">
                      <span className="text-[#FF5C39]">{key}</span>
                      <span className="text-white">: </span>
                      <span style={{ color }}>{val}</span>
                      {key !== '"available"' && <span className="text-white">,</span>}
                    </div>
                  ))}
                  <div className="text-[#555]">{'}'}</div>
                </div>
              </motion.div>
              <div className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 bg-[#D4FF4F] text-[#0A0A0A] rounded-full text-[11px] font-black shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
                OPEN TO WORK
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-4 max-w-lg">
              <p className="text-base md:text-lg text-[var(--fg)] leading-relaxed">
                I'm a <span className="font-bold text-[#FF5C39]">Full Stack Developer</span> based in Mumbai with
                experience building fast, scalable, and user-focused web applications.
              </p>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                Experienced in developing responsive frontends, secure REST APIs, JWT authentication systems,
                database optimization, SEO improvements, and cloud deployments using Vercel and Cloudflare R2.
              </p>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                Currently working at{' '}
                <span style={{ color: 'var(--lime)' }} className="font-medium">ZAR Luxury Pvt. Ltd.</span>{' '}
                developing and maintaining production-grade web platforms.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['🏆 Tech Shaastra Winner 2024 & 2025', '🥈 Alkemy Hackerthon 2nd Prize', '🎓 Department Topper — BCA'].map((a) => (
                  <span
                    key={a}
                    className="text-xs font-medium px-3 py-1.5 rounded-full border"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--lime) 40%, transparent)',
                      color: 'var(--lime)',
                      backgroundColor: 'color-mix(in srgb, var(--lime) 8%, transparent)',
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — quick facts */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <p className="text-sm font-mono text-[var(--muted)] uppercase tracking-widest mb-6">Quick Facts</p>
            <div className="space-y-3">
              {facts.map(({ label, value, icon }) => (
                <motion.div
                  key={label}
                  variants={itemVariants}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[#FF5C39]/40 transition-colors duration-300"
                >
                  <span className="text-xl mt-0.5 flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-xs text-[var(--muted)] font-mono uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-[var(--fg)]">{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              variants={itemVariants}
              className="mt-6 p-5 rounded-xl bg-[#FF5C39] text-white"
            >
              <p className="text-sm font-bold mb-1">Currently at ZAR Luxury Pvt. Ltd.</p>
              <p className="text-xs opacity-80">Full Stack Developer — Dec 2025 to Present</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
