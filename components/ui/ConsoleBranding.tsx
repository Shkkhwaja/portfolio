'use client'

import { useEffect } from 'react'

let _didBrand = false

export default function ConsoleBranding() {
  useEffect(() => {
    if (_didBrand) return
    _didBrand = true
    const o  = 'color:#FF5C39;font-weight:900;font-size:22px;font-family:monospace;text-shadow:0 0 12px rgba(255,92,57,0.6);'
    const l  = 'color:#FF5C39;font-weight:900;font-size:14px;font-family:monospace;'
    const m  = 'color:#aaaaaa;font-size:11px;font-family:monospace;line-height:1.8;'
    const lk = 'color:#7ec8f4;font-size:11px;font-family:monospace;text-decoration:underline;'
    const w  = 'color:#e04400;font-weight:600;font-size:11px;font-family:monospace;background:rgba(255,92,57,0.10);padding:3px 8px;border-radius:4px;border-left:3px solid #FF5C39;'
    const d  = 'color:#2a2a2a;font-size:10px;font-family:monospace;'

    console.log('%c⚡ KHS · PORTFOLIO', o)
    console.log('%cBuilt with ❤️  by Khwaja Hussain Shaikh', l)
    console.log('%cFull Stack Developer  ·  Mumbai, India  ·  2025', m)
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', d)
    console.log('%c🌐  Portfolio  →  https://khwajashaikh.vercel.app', lk)
    console.log('%c💻  GitHub     →  https://github.com/Shkkhwaja/', lk)
    console.log('%c🔗  LinkedIn   →  https://linkedin.com/in/khwaja-shaikh-960b981b1/', lk)
    console.log('%c📧  Email      →  khwajashaikh703@gmail.com', lk)
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', d)
    console.log('%c👋  Hey there, fellow developer!', w)
    console.log('%c    This portfolio was crafted from scratch with Next.js, Three.js,', m)
    console.log('%c    Framer Motion, and a lot of late-night ☕ and creativity.', m)
    console.log('%c    Please don\'t copy or reproduce it — your best work is your own! 🙏', w)
    console.log('%c    Need a portfolio or web project? Let\'s collaborate →  khwajashaikh703@gmail.com', m)
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', d)
    console.log('%c    © 2025 Khwaja Hussain Shaikh. All rights reserved.', m)
  }, [])

  return null
}
