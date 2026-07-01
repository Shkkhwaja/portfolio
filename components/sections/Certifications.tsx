'use client'

import { motion } from 'framer-motion'
import { FiExternalLink, FiAward, FiStar, FiCheckCircle } from 'react-icons/fi'
import certifications from '@/data/certifications'

const issuerIcon: Record<string, string> = {
  'Tilak Maharashtra Vidyapeeth': '🏆',
  'ExcelR': '🎓',
  'Deloitte Australia (via Forage)': '🏢',
  'Tata Group (via Forage)': '📊',
  'Great Learning': '📚',
}

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 md:py-32 bg-[var(--bg-2)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-mono text-[#FF5C39] tracking-widest uppercase mb-3">06 — Certifications</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-4xl md:text-6xl font-black text-[var(--fg)]">
              Credentials &amp; <span className="text-[#FF5C39]">Courses</span>
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#16a34a]/10 dark:bg-[#22c55e]/10 border border-[#16a34a]/30 dark:border-[#22c55e]/20">
              <FiCheckCircle size={14} className="text-[#16a34a] dark:text-[#22c55e]" />
              <span className="text-xs font-bold text-[#16a34a] dark:text-[#22c55e]">{certifications.length} Verified</span>
            </div>
          </div>
        </motion.div>

        {/* Featured: Department Topper — full width */}
        {certifications[0] && (
          <motion.a
            href={certifications[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex rounded-2xl overflow-hidden border-2 border-[#FF5C39] bg-[var(--card)] hover:shadow-2xl hover:shadow-[#FF5C39]/10 transition-all duration-300 mb-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            whileHover={{ y: -4 }}
          >
            {/* Accent stripe */}
            <div className="w-2 flex-shrink-0 bg-[#FF5C39]" />

            <div className="flex-1 p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Trophy icon */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border-2 border-[#FF5C39]/30 bg-[#FF5C39]/10">
                    🏆
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF5C39] uppercase">Achievement</span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#16a34a]/10 dark:bg-[#22c55e]/10 text-[#16a34a] dark:text-[#22c55e] border border-[#16a34a]/30 dark:border-[#22c55e]/20">
                        <FiCheckCircle size={9} /> VERIFIED
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[var(--fg)] group-hover:text-[#FF5C39] transition-colors leading-tight">
                      {certifications[0].title}
                    </h3>
                    <p className="text-sm font-semibold text-[#FF5C39] mt-0.5">{certifications[0].issuer}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="px-3 py-1 rounded-full bg-[var(--bg)] border border-[var(--border)] text-xs font-mono text-[var(--muted)]">
                    {certifications[0].date}
                  </span>
                  {certifications[0].credentialId && (
                    <div className="flex items-center gap-1.5 bg-[var(--bg)] rounded-lg px-3 py-1.5">
                      <FiAward size={11} className="text-[#FF5C39] flex-shrink-0" />
                      <span className="text-[10px] font-mono text-[var(--muted)]">{certifications[0].credentialId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-5 text-xs font-bold text-[#FF5C39]">
                View Proof <FiExternalLink size={12} />
              </div>
            </div>
          </motion.a>
        )}

        {/* 2-column grid for the rest */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {certifications.slice(1).map((cert, i) => (
            <motion.a
              key={cert.id}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)] hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
            >
              {/* Left color stripe */}
              <div className="w-1.5 flex-shrink-0 transition-all duration-300 group-hover:w-2" style={{ backgroundColor: cert.color }} />

              {/* Main content */}
              <div className="flex-1 p-6">
                {/* Top row: issuer badge + verified chip */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border"
                    style={{ backgroundColor: `${cert.color}15`, borderColor: `${cert.color}30` }}
                  >
                    {issuerIcon[cert.issuer] ?? '🏅'}
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#16a34a]/10 dark:bg-[#22c55e]/10 text-[#16a34a] dark:text-[#22c55e] border border-[#16a34a]/30 dark:border-[#22c55e]/20">
                    <FiCheckCircle size={10} /> VERIFIED
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[var(--fg)] leading-snug mb-1 group-hover:text-[#FF5C39] transition-colors">
                  {cert.title}
                </h3>
                <p className="text-sm font-semibold mb-1" style={{ color: cert.color }}>{cert.issuer}</p>
                <p className="text-[11px] text-[var(--muted)] font-mono mb-4">{cert.date}</p>

                {/* Credential ID */}
                {cert.credentialId && (
                  <div className="flex items-center gap-2 bg-[var(--bg)] rounded-lg px-3 py-2 mb-4">
                    <FiStar size={11} className="text-[var(--muted)] flex-shrink-0" />
                    <span className="text-[10px] font-mono text-[var(--muted)] break-all">
                      {cert.credentialId}
                    </span>
                  </div>
                )}

                {/* CTA */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] group-hover:text-[#FF5C39] transition-colors">
                  View Certificate <FiExternalLink size={12} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
