'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'

type EyePos = { x: number; y: number }

function ThrusterFlame({ x, delay = 0 }: { x: number; delay?: number }) {
  return (
    <motion.g>
      {/* Outer flame */}
      <motion.ellipse
        cx={x}
        cy={148}
        rx={6}
        ry={10}
        fill="url(#flameGrad)"
        initial={{ rx: 6, ry: 10, opacity: 0.9 }}
        animate={{ ry: [10, 16, 8, 14, 10], rx: [6, 4, 7, 5, 6], opacity: [0.9, 0.6, 1, 0.7, 0.9] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut', delay }}
      />
      {/* Inner core */}
      <motion.ellipse
        cx={x}
        cy={147}
        rx={3}
        ry={6}
        fill="white"
        initial={{ ry: 6, opacity: 1 }}
        animate={{ ry: [6, 10, 5, 9, 6], opacity: [1, 0.7, 1, 0.8, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.05 }}
      />
    </motion.g>
  )
}

export default function Mascot({ size = 120 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [leftEye, setLeftEye] = useState<EyePos>({ x: 0, y: 0 })
  const [rightEye, setRightEye] = useState<EyePos>({ x: 0, y: 0 })
  const [isWaving, setIsWaving] = useState(false)
  const [blinkState, setBlinkState] = useState(false)
  const [clicked, setClicked] = useState(false)
  const clickAnim = useAnimation()

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true)
      setTimeout(() => setBlinkState(false), 130)
    }, 2800)

    const onMouseMove = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx)
      const dist = 4.5
      setLeftEye({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist })
      setRightEye({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
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
      onHoverStart={() => setIsWaving(true)}
      onHoverEnd={() => setIsWaving(false)}
      onClick={handleClick}
      className="relative select-none"
    >
      <motion.div animate={clickAnim} style={{ originX: '50%', originY: '50%' }}>
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

          {/* ── Left Eye socket ── */}
          <circle cx="43" cy="50" r="14" fill="#0A0A0A" />
          <circle cx="43" cy="50" r="14" fill="url(#eyeGlow)" />
          {/* Left Pupil */}
          <motion.circle
            cx={43 + leftEye.x}
            cy={50 + leftEye.y}
            r={blinkState ? 0.5 : 6.5}
            fill="white"
            initial={{ r: 6.5 }}
            animate={{ r: blinkState ? 0.5 : 6.5 }}
            transition={{ duration: 0.07 }}
          />
          {!blinkState && (
            <>
              <circle cx={43 + leftEye.x * 0.6} cy={50 + leftEye.y * 0.6} r={2.8} fill="#0A0A0A" />
              {/* Pupil shine */}
              <circle cx={43 + leftEye.x * 0.4 + 2} cy={50 + leftEye.y * 0.4 - 2} r={1.2} fill="white" opacity={0.9} />
            </>
          )}

          {/* ── Right Eye socket ── */}
          <circle cx="77" cy="50" r="14" fill="#0A0A0A" />
          <circle cx="77" cy="50" r="14" fill="url(#eyeGlow)" />
          {/* Right Pupil */}
          <motion.circle
            cx={77 + rightEye.x}
            cy={50 + rightEye.y}
            r={blinkState ? 0.5 : 6.5}
            fill="white"
            initial={{ r: 6.5 }}
            animate={{ r: blinkState ? 0.5 : 6.5 }}
            transition={{ duration: 0.07 }}
          />
          {!blinkState && (
            <>
              <circle cx={77 + rightEye.x * 0.6} cy={50 + rightEye.y * 0.6} r={2.8} fill="#0A0A0A" />
              <circle cx={77 + rightEye.x * 0.4 + 2} cy={50 + rightEye.y * 0.4 - 2} r={1.2} fill="white" opacity={0.9} />
            </>
          )}

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
      </motion.div>

      {/* Speech bubble on hover */}
      <AnimatePresence>
        {isWaving && (
          <motion.div
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#D4FF4F] text-[#0A0A0A] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg"
            style={{ fontSize: Math.round(11 * scale) }}
            initial={{ opacity: 0, scale: 0.6, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Hi there! 👋
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#D4FF4F] rotate-45" />
          </motion.div>
        )}
        {clicked && (
          <motion.div
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#FF5C39] text-white font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg"
            style={{ fontSize: Math.round(11 * scale) }}
            initial={{ opacity: 0, scale: 0.6, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          >
            Boop! ⚡
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FF5C39] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
