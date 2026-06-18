'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiExternalLink, FiArrowUpRight } from 'react-icons/fi'
import projects from '@/data/projects'

/* ─── Featured card (first project, full width) ───────────── */
function FeaturedCard({ project }: { project: typeof projects[0] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="group relative rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--card)] mb-8"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Large background number */}
      <div className="absolute top-0 right-0 text-[12rem] font-black leading-none text-[var(--fg)] opacity-[0.035] select-none pointer-events-none z-0">
        01
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[340px]">
        {/* Image */}
        <div className="lg:col-span-2 relative overflow-hidden h-60 lg:h-auto">
          <motion.img
            src={project.media.type === 'image' ? project.media.src : undefined}
            alt={project.media.alt}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--card)]/80 hidden lg:block" />
          {/* LIVE badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px] text-white font-bold tracking-widest">LIVE</span>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 flex flex-col justify-center p-8 lg:p-12 relative z-10">
          <p className="text-xs font-mono text-[var(--muted)] mb-3 tracking-widest uppercase">Featured Project</p>
          <h3 className="text-3xl md:text-4xl font-black text-[var(--fg)] mb-2 leading-tight">
            {project.title}
          </h3>
          <p className="text-sm font-medium text-[#FF5C39] mb-4">{project.subtitle}</p>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-6 max-w-lg">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-8">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono border border-[var(--border)] text-[var(--muted)] bg-[var(--bg)]"
              >
                {tech}
              </span>
            ))}
          </div>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5C39] text-white rounded-full text-sm font-bold w-fit hover:bg-[#e84d2b] transition-colors"
          >
            View Live Project <FiExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Grid card ───────────────────────────────────────────── */
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const num = String(index + 2).padStart(2, '0')

  return (
    <motion.div
      className="group relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Faded background number */}
      <div className="absolute bottom-0 right-2 text-[7rem] font-black leading-none text-[var(--fg)] opacity-[0.04] select-none pointer-events-none z-0">
        {num}
      </div>

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {project.media.type === 'image' ? (
          <motion.img
            src={project.media.src}
            alt={project.media.alt}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        ) : (
          <div className="w-full h-full" style={{ background: project.media.src }} />
        )}

        {/* LIVE + number */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] text-white font-bold tracking-widest">LIVE</span>
        </div>
        <div
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-[#0A0A0A] z-10"
          style={{ backgroundColor: project.accentColor }}
        >
          {num}
        </div>

        {/* Hover description overlay */}
        <motion.div
          className="absolute inset-0 bg-[#0A0A0A]/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 px-5"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-white text-xs text-center leading-relaxed">{project.description}</p>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5C39] text-white text-xs font-bold hover:bg-[#e84d2b] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View Live <FiExternalLink size={12} />
          </a>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-5 relative z-10">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-base font-bold text-[var(--fg)] leading-tight">{project.title}</h3>
            <p className="text-xs font-mono text-[var(--muted)] mt-0.5">{project.subtitle}</p>
          </div>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[#FF5C39] hover:text-[#FF5C39] transition-colors"
          >
            <FiArrowUpRight size={15} />
          </a>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md text-[10px] font-mono border border-[var(--border)] text-[var(--muted)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const featured = projects[0]
  const rest     = projects.slice(1)

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-mono text-[#FF5C39] tracking-widest uppercase mb-3">04 — Projects</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-4xl md:text-6xl font-black text-[var(--fg)]">
              Work I've <span className="text-[#FF5C39]">Shipped</span>
            </h2>
            <div className="flex items-center gap-3">
              <span
                className="text-6xl font-black opacity-10 select-none"
                style={{ color: 'var(--lime)' }}
              >
                {projects.length}
              </span>
              <p className="text-sm text-[var(--muted)] max-w-[14rem]">
                Real clients, real impact. All links are live.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Featured project */}
        <FeaturedCard project={featured} />

        {/* Remaining projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rest.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
