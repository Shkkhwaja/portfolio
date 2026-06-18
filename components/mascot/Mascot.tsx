'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type EyePos = { x: number; y: number }

export default function Mascot({ size = 120 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [leftEye, setLeftEye] = useState<EyePos>({ x: 0, y: 0 })
  const [rightEye, setRightEye] = useState<EyePos>({ x: 0, y: 0 })
  const [isWaving, setIsWaving] = useState(false)
  const [blinkState, setBlinkState] = useState(false)

  useEffect(() => {
    // Auto-blink
    const blinkInterval = setInterval(() => {
      setBlinkState(true)
      setTimeout(() => setBlinkState(false), 150)
    }, 3200)

    // Eye tracking
    const onMouseMove = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      const angle = Math.atan2(e.clientY - cy, e.clientX - cx)
      const dist = 4
      const ex = Math.cos(angle) * dist
      const ey = Math.sin(angle) * dist

      setLeftEye({ x: ex, y: ey })
      setRightEye({ x: ex, y: ey })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      clearInterval(blinkInterval)
    }
  }, [])

  const scale = size / 120

  return (
    <motion.div
      ref={containerRef}
      style={{ width: size, height: size }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      onHoverStart={() => setIsWaving(true)}
      onHoverEnd={() => setIsWaving(false)}
      className="relative select-none"
    >
      <svg
        viewBox="0 0 120 150"
        width={size}
        height={(size / 120) * 150}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Friendly coding mascot"
      >
        {/* Antenna */}
        <line x1="60" y1="8" x2="60" y2="22" stroke="#FF5C39" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="6" r="4" fill="#D4FF4F" />

        {/* Head */}
        <rect x="22" y="20" width="76" height="64" rx="18" fill="#D4FF4F" />

        {/* Left Eye socket */}
        <circle cx="43" cy="50" r="13" fill="#0A0A0A" />
        {/* Right Eye socket */}
        <circle cx="77" cy="50" r="13" fill="#0A0A0A" />

        {/* Left Pupil */}
        <circle cx={43 + leftEye.x} cy={50 + leftEye.y} r={blinkState ? 0.5 : 6} fill="white" />
        <circle cx={43 + leftEye.x * 0.6} cy={50 + leftEye.y * 0.6} r={blinkState ? 0 : 2.5} fill="#0A0A0A" />

        {/* Right Pupil */}
        <circle cx={77 + rightEye.x} cy={50 + rightEye.y} r={blinkState ? 0.5 : 6} fill="white" />
        <circle cx={77 + rightEye.x * 0.6} cy={50 + rightEye.y * 0.6} r={blinkState ? 0 : 2.5} fill="#0A0A0A" />

        {/* Mouth */}
        <path d="M46 68 Q60 78 74 68" stroke="#0A0A0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Cheeks */}
        <circle cx="32" cy="62" r="7" fill="#FF5C39" opacity="0.4" />
        <circle cx="88" cy="62" r="7" fill="#FF5C39" opacity="0.4" />

        {/* Body */}
        <rect x="34" y="82" width="52" height="38" rx="12" fill="#FF5C39" />

        {/* Body detail */}
        <rect x="52" y="92" width="16" height="10" rx="4" fill="#0A0A0A" opacity="0.3" />
        <circle cx="48" cy="97" r="3" fill="#D4FF4F" />
        <circle cx="72" cy="97" r="3" fill="#D4FF4F" />

        {/* Left arm */}
        <motion.g
          animate={isWaving ? { rotate: [-10, 30, -10] } : { rotate: 0 }}
          transition={{ duration: 0.6, repeat: isWaving ? Infinity : 0 }}
          style={{ originX: '34px', originY: '92px' }}
        >
          <rect x="16" y="88" width="20" height="10" rx="5" fill="#FF5C39" />
          <circle cx="16" cy="93" r="6" fill="#FF5C39" />
        </motion.g>

        {/* Right arm */}
        <rect x="84" y="88" width="20" height="10" rx="5" fill="#FF5C39" />
        <circle cx="104" cy="93" r="6" fill="#FF5C39" />

        {/* Legs */}
        <rect x="40" y="118" width="14" height="16" rx="7" fill="#0A0A0A" />
        <rect x="66" y="118" width="14" height="16" rx="7" fill="#0A0A0A" />

        {/* Feet */}
        <ellipse cx="47" cy="134" rx="10" ry="5" fill="#1a1a1a" />
        <ellipse cx="73" cy="134" rx="10" ry="5" fill="#1a1a1a" />

        {/* Cloud shadow — multi-layer blurred ellipses for depth */}
        <defs>
          <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
          <filter id="cloudBlurOuter" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" />
          </filter>
        </defs>
        {/* Outer glow */}
        <ellipse cx="60" cy="140" rx="38" ry="7" fill="#FF5C39" opacity="0.18" filter="url(#cloudBlurOuter)" />
        {/* Mid glow */}
        <ellipse cx="60" cy="140" rx="28" ry="5" fill="#D4FF4F" opacity="0.22" filter="url(#cloudBlur)" />
        {/* Core shadow */}
        <ellipse cx="60" cy="140" rx="20" ry="3.5" fill="#FF5C39" opacity="0.35" filter="url(#cloudBlur)" />
      </svg>

      {/* Speech bubble on hover */}
      {isWaving && (
        <motion.div
          className="absolute -top-10 -right-4 bg-[#D4FF4F] text-[#0A0A0A] text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap"
          initial={{ opacity: 0, scale: 0.7, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          style={{ fontSize: 11 * scale }}
        >
          Hi there! 👋
          <span className="absolute bottom-[-6px] right-4 w-3 h-3 bg-[#D4FF4F] rotate-45 transform translate-y-1" />
        </motion.div>
      )}
    </motion.div>
  )
}
