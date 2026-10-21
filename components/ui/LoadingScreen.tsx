'use client'

import { useEffect, useState } from 'react'

/**
 * First-visit intro. Everything visual is CSS (transform/opacity only — see `.ld-*` in globals.css),
 * so it keeps animating on the compositor while React hydrates and the heavy scenes mount.
 * JS only decides *when* to leave: after a minimum on-screen time AND once the browser is idle.
 */

const MIN_VISIBLE_MS = 1500 // measured from navigation start, so slow loads don't wait twice
const EXIT_MS = 1300 // longest column transition (0.32 + 5*0.07 + 0.85) plus margin

const COLUMNS = 6
const LETTERS = [
  { l: 'K', color: '#FF5C39', glow: 'rgba(255,92,57,0.7)' },
  { l: 'H', color: '#D4FF4F', glow: 'rgba(212,255,79,0.7)' },
  { l: 'S', color: '#FFFFFF', glow: 'rgba(255,255,255,0.4)' },
]

const CORNERS = [
  'top-5 left-5 border-t-2 border-l-2 border-[#FF5C39]/70',
  'top-5 right-5 border-t-2 border-r-2 border-[#D4FF4F]/70',
  'bottom-5 left-5 border-b-2 border-l-2 border-[#D4FF4F]/70',
  'bottom-5 right-5 border-b-2 border-r-2 border-[#FF5C39]/70',
]

export default function LoadingScreen() {
  const [state, setState] = useState<'loading' | 'exit' | 'done'>('loading')

  /* decide when to leave: min time + browser idle, so the wipe never competes with hydration */
  useEffect(() => {
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'

    let idleId: number | undefined
    const start = () => {
      setState('exit')
      html.style.overflow = prevOverflow
    }
    const waitMs = Math.max(0, MIN_VISIBLE_MS - performance.now())
    const t = window.setTimeout(() => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(start, { timeout: 700 })
      else start()
    }, waitMs)

    return () => {
      clearTimeout(t)
      if (idleId !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
      html.style.overflow = prevOverflow
    }
  }, [])

  /* remove the DOM only after the wipe has finished */
  useEffect(() => {
    if (state !== 'exit') return
    const t = window.setTimeout(() => setState('done'), EXIT_MS)
    return () => clearTimeout(t)
  }, [state])

  if (state === 'done') return null

  return (
    <div className="ld-root" data-state={state} role="status" aria-label="Loading portfolio">
      {/* curtain: plain dark columns that wipe upward */}
      <div className="ld-cols" aria-hidden>
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div
            key={i}
            className="ld-col"
            style={{ ['--i' as string]: i, ['--c' as string]: i % 2 ? '#D4FF4F' : '#FF5C39' }}
          />
        ))}
      </div>

      <div className="ld-stage">
        <div className="ld-bg" aria-hidden />
        <div className="ld-vignette" aria-hidden />

        {CORNERS.map((cls, i) => (
          <span key={i} aria-hidden className={`ld-corner ${cls}`} style={{ animationDelay: `${0.1 + i * 0.07}s` }} />
        ))}

        <div className="ld-orbit">
          <svg viewBox="0 0 200 200" fill="none" aria-hidden>
            <defs>
              <linearGradient id="ldg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF5C39" />
                <stop offset="100%" stopColor="#D4FF4F" />
              </linearGradient>
            </defs>
            <g className="ld-ring-in" style={{ transformOrigin: '100px 100px' }}>
              <circle cx="100" cy="100" r="92" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              {/* gradient arc that spins */}
              <g className="ld-spin" style={{ transformOrigin: '100px 100px' }}>
                <circle cx="100" cy="100" r="92" stroke="url(#ldg)" strokeWidth="2" strokeLinecap="round" strokeDasharray="150 430" />
                <circle cx="100" cy="8" r="3.5" fill="#FF5C39" />
              </g>
              {/* dotted counter orbit */}
              <g className="ld-spin-rev" style={{ transformOrigin: '100px 100px' }}>
                <circle cx="100" cy="100" r="72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 7" />
                <circle cx="172" cy="100" r="3" fill="#D4FF4F" />
              </g>
            </g>
          </svg>

          <div className="ld-glow" aria-hidden />

          <div className="ld-mono" aria-label="KHS">
            {LETTERS.map(({ l, color, glow }, i) => (
              <span key={l} className="ld-mask" aria-hidden>
                <span className="ld-letter" style={{ ['--i' as string]: i, color, textShadow: `0 0 24px ${glow}` }}>
                  {l}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <p className="ld-name font-mono text-[12px] sm:text-sm uppercase tracking-[0.22em] text-white/80">
            Khwaja Hussain Shaikh
          </p>
          <p className="ld-role font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#D4FF4F]/80">
            Full Stack Developer
          </p>
        </div>

        <div className="ld-bar" aria-hidden>
          <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            <span>Loading experience</span>
            <span className="ld-dots text-[#FF5C39]">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
          <div className="ld-track">
            <div className="ld-fill" />
          </div>
        </div>
      </div>
    </div>
  )
}
