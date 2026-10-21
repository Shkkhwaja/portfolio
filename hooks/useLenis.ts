'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // lerp-based easing: continuous and interruptible, so wheel bursts glide instead of snapping
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      smoothWheel: true,
    })

    lenisRef.current = lenis
    window.__lenis = lenis

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  return lenisRef
}
