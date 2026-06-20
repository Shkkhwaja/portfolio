'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const ProfileScene = dynamic(() => import('@/components/three/ProfileScene'), { ssr: false })

const WEATHER_EMOJI: Record<string, string> = {
  sunny: '☀️', partly_cloudy: '⛅', cloudy: '☁️',
  foggy: '🌫️', drizzle: '🌦️', rainy: '🌧️', stormy: '⛈️',
}

function codeToType(code: number) {
  if (code <= 1)                                  return 'sunny'
  if (code === 2)                                 return 'partly_cloudy'
  if (code === 3)                                 return 'cloudy'
  if (code === 45 || code === 48)                 return 'foggy'
  if (code >= 51 && code <= 57)                   return 'drizzle'
  if (code >= 61 && code <= 82)                   return 'rainy'
  if (code === 95 || code === 96 || code === 99)  return 'stormy'
  return 'cloudy'
}

export default function ProfileSection() {
  const [weatherStr, setWeatherStr] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/weather')
      .then(r => r.json())
      .then(d => {
        const emoji = WEATHER_EMOJI[codeToType(d.weathercode ?? -1)] ?? '🌤️'
        setWeatherStr(`"${emoji} ${d.temperature}°C · ${d.description}"`)
      })
      .catch(() => setWeatherStr('"🌤️ Mumbai"'))
  }, [])

  /* Reusable code snippet — rendered twice (desktop absolute, mobile block) */
  const CodeSnippet = (
    <div className="bg-[#0D0D0D] border border-[#2a2a2a] rounded-2xl p-4 font-mono text-xs shadow-2xl">
      <div className="text-[#555] mb-2 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500/70" />
        <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
        <span className="w-2 h-2 rounded-full bg-green-400/70" />
        <span className="ml-1 text-[10px]">khwaja.ts</span>
      </div>
      <div className="space-y-0.5">
        <div>
          <span className="text-[#C792EA]">const </span>
          <span className="text-[#D4FF4F]">dev</span>
          <span className="text-white"> = {"{"}</span>
        </div>
        <div className="pl-3">
          <span className="text-[#FF5C39]">city</span>
          <span className="text-white">: </span>
          <span className="text-[#C3E88D]">&quot;Mumbai 🇮🇳&quot;</span>
          <span className="text-white">,</span>
        </div>
        <div className="pl-3">
          <span className="text-[#FF5C39]">exp</span>
          <span className="text-white">: </span>
          <span className="text-[#C3E88D]">&quot;1.3 yrs&quot;</span>
          <span className="text-white">,</span>
        </div>
        <div className="pl-3">
          <span className="text-[#FF5C39]">open</span>
          <span className="text-white">: </span>
          <span className="text-[#D4FF4F]">true</span>
          <span className="text-white">,</span>
        </div>
        <div className="pl-3">
          <span className="text-[#FF5C39]">weather</span>
          <span className="text-white">: </span>
          {weatherStr ? (
            <span className="text-[#C3E88D]">{weatherStr}</span>
          ) : (
            <span className="text-[#555] italic">
              loading<span className="animate-pulse">...</span>
            </span>
          )}
        </div>
        <div><span className="text-white">{"}"}</span></div>
      </div>
    </div>
  )

  return (
    <section id="profile" className="relative py-6 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col items-center">

          {/* ── Scene container ── */}
          <div className="relative w-full h-[50vh] sm:h-[560px] md:h-[680px] lg:h-[760px] max-w-full lg:max-w-[1100px]">

            {/* 3D Scene */}
            <div className="absolute inset-0 z-10">
              <ProfileScene />
            </div>

            {/* MERN badge — top right */}
            <motion.div
              className="absolute top-6 right-0 z-20 bg-[#FF5C39] text-white px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-lg"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              MERN · Next.js · TypeScript
            </motion.div>

            {/* Code snippet — desktop: absolute top-left overlay; hidden on mobile */}
            <motion.div
              className="hidden sm:block absolute top-6 left-0 z-20"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              {CodeSnippet}
            </motion.div>

            {/* Name plate — bottom centre */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <div className="px-5 py-2 rounded-xl backdrop-blur-md bg-[#0A0A0A]/70 border border-white/10 text-center">
                <p className="text-sm font-bold text-white">Khwaja Hussain Shaikh</p>
                <p className="text-[10px] font-mono text-[#D4FF4F]">Full Stack Developer · Mumbai 🇮🇳</p>
              </div>
            </div>
          </div>

          {/* Code snippet — mobile only, shown below scene as a normal block */}
          <motion.div
            className="sm:hidden mt-5 w-full max-w-[300px]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {CodeSnippet}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
