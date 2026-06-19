'use client'

import { motion } from 'framer-motion'
import education from '@/data/education'

export default function Education() {
  return (
    <section id="education" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-mono text-[#FF5C39] tracking-widest uppercase mb-3">05 — Education</p>
          <h2 className="text-4xl md:text-6xl font-black text-[var(--fg)]">
            Academic <span className="text-[#FF5C39]">Background</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {education.map((edu, i) => (
            <motion.div
              key={edu.id}
              className="relative p-6 rounded-2xl border bg-[var(--card)] transition-colors duration-300 overflow-hidden group"
              style={{
                borderColor: i === 0 ? '#FF5C39' : 'var(--border)',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ borderColor: '#FF5C39' }}
            >
              {/* Number */}
              <span
                className="text-7xl font-black absolute -top-3 -right-2 opacity-[0.05] select-none"
                style={{ color: i % 2 === 0 ? '#FF5C39' : 'var(--lime)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Content */}
              <div className="relative z-10 space-y-2">
                <span
                  className="inline-block text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: i === 0 ? '#FF5C39' : 'var(--bg)',
                    color: i === 0 ? 'white' : 'var(--muted)',
                    border: i !== 0 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  {edu.period}
                </span>

                <h3 className="text-base font-bold text-[var(--fg)] leading-snug">{edu.degree}</h3>
                <p className="text-sm font-medium text-[#FF5C39]">{edu.institution}</p>
                <p className="text-xs text-[var(--muted)]">{edu.location}</p>

                {edu.grade && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4A7C00]/10 dark:bg-[#D4FF4F]/10 border border-[#4A7C00]/30 dark:border-[#D4FF4F]/30 mt-2">
                    <span className="w-2 h-2 rounded-full bg-[#4A7C00] dark:bg-[#D4FF4F]" />
                    <span className="text-xs font-bold text-[var(--lime)]">{edu.grade}</span>
                  </div>
                )}

                {edu.stream && (
                  <p className="text-xs text-[var(--muted)] font-mono">{edu.stream}</p>
                )}

                {edu.honours && edu.honours.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-2">
                    {edu.honours.map((h) => (
                      <span key={h} className="text-[11px] font-medium text-[#FF5C39]">{h}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
