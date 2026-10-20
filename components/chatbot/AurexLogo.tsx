'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Animated AUREX emblem. Layers: breathing aura, counter-rotating dashed orbit, floating orb,
 * and orbiting sparks that speed up while the assistant is "thinking".
 */
export default function AurexLogo({
  size = 40,
  thinking = false,
  priority = false,
  className = '',
}: {
  size?: number
  thinking?: boolean
  priority?: boolean
  className?: string
}) {
  const reduce = useReducedMotion()
  const spin = thinking ? 2.2 : 9

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* breathing aura */}
      <motion.span
        className="absolute inset-[-18%] rounded-full blur-md"
        style={{ background: 'radial-gradient(circle, rgba(212,255,79,0.55) 0%, rgba(255,92,57,0.35) 45%, transparent 70%)' }}
        animate={reduce ? undefined : { scale: thinking ? [1, 1.25, 1] : [1, 1.12, 1], opacity: thinking ? [0.8, 1, 0.8] : [0.5, 0.8, 0.5] }}
        transition={{ duration: thinking ? 0.9 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* dashed orbit ring */}
      <motion.span
        className="absolute inset-[2%] rounded-full border border-dashed border-[#D4FF4F]/50"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: spin * 1.6, repeat: Infinity, ease: 'linear' }}
      />

      {/* orbiting sparks */}
      {!reduce &&
        [0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: spin, repeat: Infinity, ease: 'linear', delay: -i * (spin / 2) }}
          >
            <span
              className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
              style={{
                width: Math.max(3, size * 0.09),
                height: Math.max(3, size * 0.09),
                background: i ? '#FF5C39' : '#D4FF4F',
                boxShadow: `0 0 ${size * 0.25}px ${i ? '#FF5C39' : '#D4FF4F'}`,
              }}
            />
          </motion.span>
        ))}

      {/* the orb */}
      <motion.span
        className="relative block h-full w-full"
        animate={reduce ? undefined : { y: [0, -size * 0.05, 0], rotate: thinking ? [0, 8, -8, 0] : [0, 3, -3, 0] }}
        transition={{ duration: thinking ? 1.2 : 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/images/aurex-logo.png"
          alt=""
          fill
          sizes={`${Math.ceil(size * 2)}px`}
          priority={priority}
          className="object-contain scale-[1.3] select-none pointer-events-none"
        />
      </motion.span>
    </span>
  )
}
