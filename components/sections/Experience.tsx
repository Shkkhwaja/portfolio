'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import experience from '@/data/experience'

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [activeCard, setActiveCard] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    const el = carouselRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.offsetWidth)
    setActiveCard(idx)
  }

  return (
    <section id="experience" className="py-14 md:py-32 relative" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          className="mb-10 md:mb-20"
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

        {/* ── MOBILE: horizontal snap carousel ─────────────────── */}
        <div className="md:hidden">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-6 px-6 pb-3"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          >
            {experience.map((exp, i) => (
              <motion.div
                key={exp.id}
                className="snap-center flex-shrink-0 w-[85vw]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                <div
                  className="h-full rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4"
                  style={{ borderLeft: `3px solid ${exp.accentColor}` }}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[var(--fg)] leading-tight">{exp.role}</h3>
                      <p className="text-xs font-medium mt-0.5" style={{ color: exp.accentColor }}>{exp.company}</p>
                      <p className="text-[10px] text-[var(--muted)] mt-0.5">{exp.location}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[9px] font-mono text-[var(--muted)] whitespace-nowrap">
                        {exp.period}
                      </span>
                      <p className="text-[9px] text-[var(--muted)] mt-0.5">{exp.type}</p>
                    </div>
                  </div>

                  {/* Bullets — show first 3 on mobile */}
                  <ul className="space-y-1.5 mb-3">
                    {exp.bullets.slice(0, 3).map((b, bi) => (
                      <li key={bi} className="flex items-start gap-2 text-[11px] text-[var(--muted)] leading-snug">
                        <span className="mt-1 w-1 h-1 rounded-full bg-[#FF5C39] flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {exp.tags.slice(0, 6).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium border border-[var(--border)] text-[var(--muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                    {exp.tags.length > 6 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-[var(--muted)]">
                        +{exp.tags.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {experience.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  carouselRef.current?.scrollTo({ left: i * carouselRef.current.offsetWidth, behavior: 'smooth' })
                  setActiveCard(i)
                }}
                className={`rounded-full transition-all duration-300 ${
                  activeCard === i
                    ? 'w-5 h-2 bg-[#FF5C39]'
                    : 'w-2 h-2 bg-[var(--border)]'
                }`}
                aria-label={`Go to experience ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── DESKTOP: vertical timeline ────────────────────────── */}
        <div className="hidden md:block relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[var(--border)] -translate-x-1/2" />
          {/* Animated fill */}
          <motion.div
            className="absolute left-1/2 top-0 w-[2px] bg-gradient-to-b from-[#FF5C39] to-[#D4FF4F] -translate-x-1/2 origin-top"
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
                  className={`relative flex flex-row ${isLeft ? 'flex-row-reverse' : ''} gap-0`}
                  initial={{ opacity: 0, x: isLeft ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  {/* Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-5 flex items-center justify-center z-10">
                    <motion.div
                      className="w-4 h-4 rounded-full border-2 border-[#FF5C39] bg-[var(--bg)]"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    />
                  </div>

                  {/* Spacer */}
                  <div className="w-1/2" />

                  {/* Card */}
                  <div className={`w-1/2 ${isLeft ? 'pr-12' : 'pl-12'}`}>
                    <div
                      className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#FF5C39]/40 transition-colors duration-300"
                      style={{ borderLeft: `3px solid ${exp.accentColor}` }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-[var(--fg)]">{exp.role}</h3>
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

                      <ul className="space-y-2 mb-4">
                        {exp.bullets.map((b, bi) => (
                          <li key={bi} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5C39] flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>

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
