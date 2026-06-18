'use client'

import { motion } from 'framer-motion'
import {
  SiJavascript, SiTypescript, SiHtml5, SiCss,
  SiReact, SiNextdotjs, SiTailwindcss, SiAntdesign, SiGreensock,
  SiNodedotjs, SiExpress, SiSpringboot,
  SiMongodb, SiPostgresql, SiMysql,
  SiGit, SiGithub, SiVercel, SiCloudflare, SiJsonwebtokens,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'
import { TbApi } from 'react-icons/tb'

type SkillItem = {
  name: string
  Icon: React.ElementType
  color: string
}

const categories: { title: string; color: string; skills: SkillItem[] }[] = [
  {
    title: 'Languages',
    color: '#FF5C39',
    skills: [
      { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
      { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
      { name: 'Java', Icon: FaJava, color: '#ED8B00' },
      { name: 'HTML5', Icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS3', Icon: SiCss, color: '#1572B6' },
    ],
  },
  {
    title: 'Frontend',
    color: '#D4FF4F',
    skills: [
      { name: 'React.js', Icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', Icon: SiNextdotjs, color: '#FFFFFF' },
      { name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'Ant Design', Icon: SiAntdesign, color: '#0170FE' },
      { name: 'GSAP', Icon: SiGreensock, color: '#88CE02' },
    ],
  },
  {
    title: 'Backend',
    color: '#FF5C39',
    skills: [
      { name: 'Node.js', Icon: SiNodedotjs, color: '#339933' },
      { name: 'Express.js', Icon: SiExpress, color: '#AAAAAA' },
      { name: 'Spring Boot', Icon: SiSpringboot, color: '#6DB33F' },
    ],
  },
  {
    title: 'Databases',
    color: '#D4FF4F',
    skills: [
      { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
      { name: 'PostgreSQL', Icon: SiPostgresql, color: '#336791' },
      { name: 'MySQL', Icon: SiMysql, color: '#4479A1' },
      { name: 'Oracle SQL', Icon: SiMysql, color: '#F80000' },
    ],
  },
  {
    title: 'APIs & Auth',
    color: '#FF5C39',
    skills: [
      { name: 'REST APIs', Icon: TbApi, color: '#FF5C39' },
      { name: 'JWT Auth', Icon: SiJsonwebtokens, color: '#D63AFF' },
    ],
  },
  {
    title: 'Tools & Platforms',
    color: '#D4FF4F',
    skills: [
      { name: 'Git', Icon: SiGit, color: '#F05032' },
      { name: 'GitHub', Icon: SiGithub, color: '#AAAAAA' },
      { name: 'Vercel', Icon: SiVercel, color: '#AAAAAA' },
      { name: 'Cloudflare', Icon: SiCloudflare, color: '#F6821F' },
    ],
  },
]

/* Marquee of all icons */
const allIcons: SkillItem[] = categories.flatMap((c) => c.skills)

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-mono text-[#FF5C39] tracking-widest uppercase mb-3">02 — Skills</p>
          <h2 className="text-4xl md:text-6xl font-black text-[var(--fg)]">
            Tech <span className="text-[#FF5C39]">Stack</span>
          </h2>
        </motion.div>

        {/* Skill categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#FF5C39]/40 transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: ci * 0.08 }}
            >
              {/* Category header */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-2 h-5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[var(--fg)]">
                  {cat.title}
                </h3>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap gap-2">
                {cat.skills.map(({ name, Icon, color }) => (
                  <motion.div
                    key={name}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs font-medium text-[var(--fg)] hover:border-[#FF5C39]/50 hover:scale-105 transition-all duration-200"
                    whileHover={{ scale: 1.06 }}
                  >
                    <Icon size={13} style={{ color }} />
                    {name}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--bg-2)] py-4">
        <div className="flex gap-8 animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...allIcons, ...allIcons].map(({ name, Icon, color }, i) => (
            <div key={`${name}-${i}`} className="flex items-center gap-2 px-4">
              <Icon size={18} style={{ color }} />
              <span className="text-sm font-mono text-[var(--muted)]">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
