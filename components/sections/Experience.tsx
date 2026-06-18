'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import experience from '@/data/experience'

export default function Experience() {
  const lineRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="experience" className="py-24 md:py-32 relative" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-mono text-[#FF5C39] tracking-widest uppercase mb-3">03 — Experience</p>
          <h2 className="text-4xl md:text-6xl font-black text-[var(--fg)]">
            Where I've <span className="text-[#FF5C39]">Worked</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-[var(--border)] md:-translate-x-1/2" />
          {/* Animated fill */}
          <motion.div
            className="absolute left-4 md:left-1/2 top-0 w-[2px] bg-gradient-to-b from-[#FF5C39] to-[#D4FF4F] md:-translate-x-1/2 origin-top"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%' }}
          />

          <div className="space-y-16">
            {experience.map((exp, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={exp.id}
                  className={`relative flex flex-col md:flex-row ${isLeft ? 'md:flex-row-reverse' : ''} gap-8 md:gap-0`}
                  initial={{ opacity: 0, x: isLeft ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-5 flex items-center justify-center z-10">
                    <motion.div
                      className="w-4 h-4 rounded-full border-2 border-[#FF5C39] bg-[var(--bg)]"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    />
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block w-1/2" />

                  {/* Card */}
                  <div className={`w-full md:w-1/2 pl-10 md:pl-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div
                      className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#FF5C39]/40 transition-colors duration-300"
                      style={{ borderLeft: `3px solid ${exp.accentColor}` }}
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-[var(--fg)]">{exp.role}</h3>
                          <p className="text-sm font-medium" style={{ color: exp.accentColor }}>{exp.company}</p>
                          <p className="text-xs text-[var(--muted)] mt-0.5">{exp.location}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 rounded-full bg-[var(--bg)] border border-[var(--border)] text-xs font-mono text-[var(--muted)]">
                            {exp.period}
                          </span>
                          <p className="text-[10px] text-[var(--muted)] mt-1">{exp.type}</p>
                        </div>
                      </div>

                      {/* Bullets */}
                      <ul className="space-y-2 mb-4">
                        {exp.bullets.map((b, bi) => (
                          <li key={bi} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5C39] flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border border-[var(--border)] text-[var(--muted)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
