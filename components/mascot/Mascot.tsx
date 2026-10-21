'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useAnimation, AnimatePresence, useReducedMotion } from 'framer-motion'
import AurexLogo from '@/components/chatbot/AurexLogo'


function ThrusterFlame({ x, delay = 0 }: { x: number; delay?: number }) {
  // scaleY + opacity only (transform animations avoid re-computing SVG geometry every frame)
  const common = { transformBox: 'fill-box' as const, transformOrigin: '50% 0%' }
  return (
    <motion.g>
      <motion.ellipse
        cx={x} cy={148} rx={6} ry={10}
        fill="url(#flameGrad)"
        style={common}
        animate={{ scaleY: [1, 1.6, 0.8, 1.4, 1], scaleX: [1, 0.7, 1.1, 0.85, 1], opacity: [0.9, 0.6, 1, 0.7, 0.9] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut', delay }}
      />
      <motion.ellipse
        cx={x} cy={147} rx={3} ry={6}
        fill="white"
        style={common}
        animate={{ scaleY: [1, 1.6, 0.8, 1.5, 1], opacity: [1, 0.7, 1, 0.8, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.05 }}
      />
    </motion.g>
  )
}

/**
 * The AUREX orb, tossed from the left hand to the right hand and back.
 * Hand positions come from the SVG (viewBox 120x160): left hand ≈ (14, 93), right hand ≈ (106, 93).
 */
function JugglingBall({ size, busy }: { size: number; busy: boolean }) {
  const reduce = useReducedMotion()
  const H = (size / 120) * 160
  const orb = Math.round(size * 0.4)
  const lx = (14 / 120) * size - orb / 2
  const rx = (106 / 120) * size - orb / 2
  const mid = (lx + rx) / 2
  const hy = (93 / 160) * H - orb / 2
  const arc = H * 0.2
  const total = busy ? 1.9 : 3.6 // seconds for a full left → right → left cycle

  return (
    <motion.span
      aria-hidden
      className="absolute left-0 top-0 z-10 pointer-events-none"
      style={{ width: orb, height: orb }}
      initial={{ x: lx, y: hy }}
      animate={
        reduce
          ? { x: lx, y: hy }
          : {
              // hold in the left hand, toss across in an arc, hold in the right hand, toss back
              x: [lx, mid, rx, rx, mid, lx, lx],
              y: [hy, hy - arc, hy, hy, hy - arc, hy, hy],
            }
      }
      transition={{
        duration: total,
        repeat: Infinity,
        times: [0, 0.2, 0.4, 0.5, 0.7, 0.9, 1],
        x: { duration: total, repeat: Infinity, times: [0, 0.2, 0.4, 0.5, 0.7, 0.9, 1], ease: 'linear' },
        y: {
          duration: total,
          repeat: Infinity,
          times: [0, 0.2, 0.4, 0.5, 0.7, 0.9, 1],
          // rise decelerates, fall accelerates → a natural toss
          ease: ['easeOut', 'easeIn', 'linear', 'easeOut', 'easeIn', 'linear'],
        },
      }}
    >
      <AurexLogo size={orb} thinking={busy} steady />
    </motion.span>
  )
}

type MascotProps = {
  size?: number
  /** text shown on hover; null disables the hover bubble */
  hoverText?: string | null
  /** text shown on click; null disables the click bubble */
  clickText?: string | null
  /** persistent bubble (e.g. "Ask me anything!") */
  bubble?: string | null
  /** waving + smiling "working" state, used while the chatbot is answering */
  busy?: boolean
  /** the AUREX orb juggled between the two hands */
  ball?: boolean
  /** mirror the sprite only (bubble text stays readable) */
  flip?: boolean
  /** keep bubble inside the viewport when the mascot hugs the right edge */
  bubbleAlign?: 'center' | 'right'
}

export default function Mascot({
  size = 120,
  hoverText = 'Hi there! 👋',
  clickText = 'Boop! ⚡',
  bubble = null,
  busy = false,
  flip = false,
  ball = false,
  bubbleAlign = 'center',
}: MascotProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // pupils are moved imperatively (rAF-throttled) — no React re-render per mouse move
  const pupilRef = useRef<SVGGElement>(null)
  const irisRef = useRef<SVGGElement>(null)
  const shineRef = useRef<SVGGElement>(null)
  const [hovered, setHovered] = useState(false)
  const isWaving = hovered || busy
  const [blinkState, setBlinkState] = useState(false)
  const [clicked, setClicked] = useState(false)
  const clickAnim = useAnimation()

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true)
      setTimeout(() => setBlinkState(false), 130)
    }, 2800)

    let raf = 0
    let mx = 0
    let my = 0
    const apply = () => {
      raf = 0
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const angle = Math.atan2(my - (rect.top + rect.height / 2), mx - (rect.left + rect.width / 2))
      const x = Math.cos(angle) * 4.5
      const y = Math.sin(angle) * 4.5
      pupilRef.current?.setAttribute('transform', `translate(${x} ${y})`)
      irisRef.current?.setAttribute('transform', `translate(${x * 0.6} ${y * 0.6})`)
      shineRef.current?.setAttribute('transform', `translate(${x * 0.4} ${y * 0.4})`)
    }
    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      clearInterval(blinkInterval)
    }
  }, [])

  const handleClick = async () => {
    setClicked(true)
    await clickAnim.start({ scale: [1, 1.18, 0.9, 1.05, 1], rotate: [0, -8, 8, -4, 0] })
    setClicked(false)
  }

  const scale = size / 120

  // Walking leg oscillation (arms + legs)
  const walkCycle = { duration: 0.55, repeat: Infinity, ease: 'easeInOut' as const }

  return (
    <motion.div
      ref={containerRef}
      style={{ width: size, height: (size / 120) * 160 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
      className="relative select-none"
    >
      <motion.div animate={clickAnim} style={{ originX: '50%', originY: '50%' }}>
        <div style={{ transform: flip ? 'scaleX(-1)' : undefined, transition: 'transform 0.3s ease-in-out' }}>
        <svg
          viewBox="0 0 120 160"
          width={size}
          height={(size / 120) * 160}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive coding robot mascot"
        >
          <defs>
            {/* Thruster flame gradient */}
            <radialGradient id="flameGrad" cx="50%" cy="20%" r="80%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#D4FF4F" />
              <stop offset="70%" stopColor="#FF5C39" />
              <stop offset="100%" stopColor="rgba(255,92,57,0)" />
            </radialGradient>
            {/* Body gradient */}
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF5C39" />
              <stop offset="100%" stopColor="#cc3d20" />
            </linearGradient>
            {/* Head gradient */}
            <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8ff6b" />
              <stop offset="100%" stopColor="#D4FF4F" />
            </linearGradient>
            {/* Eye glow */}
            <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4FF4F" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D4FF4F" stopOpacity="0" />
            </radialGradient>
            {/* Glow filter */}
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
            </filter>
            <filter id="shadowBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            </filter>
          </defs>

          {/* ── Ground shadow ── */}
          <ellipse cx="60" cy="156" rx="30" ry="4" fill="#FF5C39" opacity="0.18" filter="url(#softGlow)" />
          <ellipse cx="60" cy="156" rx="18" ry="2.5" fill="#D4FF4F" opacity="0.25" filter="url(#shadowBlur)" />

          {/* ── Thruster flames ── */}
          <ThrusterFlame x={47} delay={0} />
          <ThrusterFlame x={73} delay={0.12} />

          {/* ── Legs with walk animation ── */}
          <motion.g
            animate={isWaving ? { rotate: [0, 0] } : { rotate: [-16, 16] }}
            transition={walkCycle}
            style={{ originX: '47px', originY: '118px' }}
          >
            <rect x="40" y="118" width="14" height="18" rx="7" fill="#0A0A0A" />
            <ellipse cx="47" cy="137" rx="9" ry="4.5" fill="#1a1a1a" />
            {/* Shoe highlight */}
            <ellipse cx="44" cy="136" rx="3.5" ry="1.5" fill="#333" opacity="0.6" />
          </motion.g>
          <motion.g
            animate={isWaving ? { rotate: [0, 0] } : { rotate: [16, -16] }}
            transition={walkCycle}
            style={{ originX: '73px', originY: '118px' }}
          >
            <rect x="66" y="118" width="14" height="18" rx="7" fill="#0A0A0A" />
            <ellipse cx="73" cy="137" rx="9" ry="4.5" fill="#1a1a1a" />
            <ellipse cx="70" cy="136" rx="3.5" ry="1.5" fill="#333" opacity="0.6" />
          </motion.g>

          {/* ── Body ── */}
          <rect x="33" y="82" width="54" height="38" rx="13" fill="url(#bodyGrad)" />

          {/* Body screen / chest detail */}
          <rect x="46" y="90" width="28" height="18" rx="5" fill="#0A0A0A" opacity="0.5" />
          <motion.rect
            x={48} y={92} width={8} height={4} rx={2}
            fill="#D4FF4F"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.rect
            x={60} y={92} width={12} height={4} rx={2}
            fill="#FF5C39"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.rect
            x={48} y={100} width={24} height={3} rx={1.5}
            fill="#D4FF4F"
            initial={{ width: 24 }}
            animate={{ width: [24, 14, 20, 8, 24] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            opacity={0.6}
          />

          {/* Body rivet dots */}
          <circle cx="39" cy="88" r="2" fill="#cc3d20" />
          <circle cx="81" cy="88" r="2" fill="#cc3d20" />
          <circle cx="39" cy="114" r="2" fill="#cc3d20" />
          <circle cx="81" cy="114" r="2" fill="#cc3d20" />

          {/* ── Left arm ── */}
          <motion.g
            animate={isWaving ? { rotate: [-10, 45, -10] } : { rotate: [8, -8] }}
            transition={isWaving ? { duration: 0.55, repeat: Infinity } : walkCycle}
            style={{ originX: '33px', originY: '92px' }}
          >
            <rect x="14" y="88" width="21" height="10" rx="5" fill="url(#bodyGrad)" />
            <circle cx="14" cy="93" r="6" fill="#FF5C39" />
            {/* Hand glow on wave */}
            {isWaving && (
              <circle cx="14" cy="93" r="8" fill="#FF5C39" opacity="0.3" filter="url(#glow)" />
            )}
          </motion.g>

          {/* ── Right arm ── */}
          <motion.g
            animate={isWaving ? { rotate: [0, 0] } : { rotate: [-8, 8] }}
            transition={walkCycle}
            style={{ originX: '87px', originY: '92px' }}
          >
            <rect x="85" y="88" width="21" height="10" rx="5" fill="url(#bodyGrad)" />
            <circle cx="106" cy="93" r="6" fill="#FF5C39" />
          </motion.g>

          {/* ── Neck ── */}
          <rect x="52" y="76" width="16" height="10" rx="4" fill="#cc3d20" />
          <rect x="54" y="77" width="12" height="8" rx="3" fill="#e8460f" opacity="0.5" />

          {/* ── Head ── */}
          <rect x="20" y="20" width="80" height="60" rx="18" fill="url(#headGrad)" />

          {/* Head side bolts */}
          <circle cx="20" cy="42" r="4" fill="#D4FF4F" />
          <circle cx="20" cy="58" r="4" fill="#D4FF4F" />
          <circle cx="100" cy="42" r="4" fill="#D4FF4F" />
          <circle cx="100" cy="58" r="4" fill="#D4FF4F" />

          {/* ── Eye sockets ── */}
          <circle cx="43" cy="50" r="14" fill="#0A0A0A" />
          <circle cx="43" cy="50" r="14" fill="url(#eyeGlow)" />
          <circle cx="77" cy="50" r="14" fill="#0A0A0A" />
          <circle cx="77" cy="50" r="14" fill="url(#eyeGlow)" />

          {/* Pupils (white) — group translated by the mouse tracker */}
          <g ref={pupilRef}>
            <motion.circle cx={43} cy={50} r={6.5} fill="white" initial={{ r: 6.5 }} animate={{ r: blinkState ? 0.5 : 6.5 }} transition={{ duration: 0.07 }} />
            <motion.circle cx={77} cy={50} r={6.5} fill="white" initial={{ r: 6.5 }} animate={{ r: blinkState ? 0.5 : 6.5 }} transition={{ duration: 0.07 }} />
          </g>
          {/* Iris (dark) */}
          <g ref={irisRef} style={{ opacity: blinkState ? 0 : 1 }}>
            <circle cx={43} cy={50} r={2.8} fill="#0A0A0A" />
            <circle cx={77} cy={50} r={2.8} fill="#0A0A0A" />
          </g>
          {/* Shine */}
          <g ref={shineRef} style={{ opacity: blinkState ? 0 : 0.9 }}>
            <circle cx={45} cy={48} r={1.2} fill="white" />
            <circle cx={79} cy={48} r={1.2} fill="white" />
          </g>

          {/* ── Mouth ── */}
          {isWaving ? (
            <path d="M44 68 Q60 82 76 68" stroke="#0A0A0A" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M46 68 Q60 76 74 68" stroke="#0A0A0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}

          {/* Cheeks */}
          <ellipse cx="30" cy="62" rx="8" ry="5" fill="#FF5C39" opacity="0.35" />
          <ellipse cx="90" cy="62" rx="8" ry="5" fill="#FF5C39" opacity="0.35" />

          {/* ── Antenna ── */}
          <motion.g
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '60px', originY: '20px' }}
          >
            <line x1="60" y1="8" x2="60" y2="22" stroke="#FF5C39" strokeWidth="3" strokeLinecap="round" />
            <motion.circle
              cx="60" cy="6" r="4.5" fill="#D4FF4F"
              initial={{ r: 4.5, opacity: 1 }}
              animate={{ r: [4.5, 6, 4.5], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              filter="url(#glow)"
            />
          </motion.g>

          {/* Head top accent stripe */}
          <rect x="35" y="20" width="50" height="5" rx="4" fill="#e8ff6b" opacity="0.5" />
        </svg>
        </div>
      </motion.div>

      {ball && <JugglingBall size={size} busy={busy} />}

      {/* Speech bubbles */}
      <AnimatePresence>
        {(() => {
          const text = clicked && clickText ? clickText : hovered && hoverText ? hoverText : bubble
          if (!text) return null
          const accent = clicked && clickText
          return (
            <motion.div
              key={text}
              className={`absolute -top-12 ${bubbleAlign === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'} font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg pointer-events-none ${
                accent ? 'bg-[#FF5C39] text-white' : 'bg-[#D4FF4F] text-[#0A0A0A]'
              }`}
              style={{ fontSize: Math.max(10, Math.round(11 * scale)) }}
              initial={{ opacity: 0, scale: 0.6, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {text}
              <span
                className={`absolute -bottom-1.5 ${bubbleAlign === 'right' ? 'right-4' : 'left-1/2 -translate-x-1/2'} w-3 h-3 rotate-45 ${
                  accent ? 'bg-[#FF5C39]' : 'bg-[#D4FF4F]'
                }`}
              />
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </motion.div>
  )
}
