'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { TECH_ITEMS } from './tech-items'
import { scrollToId } from '@/lib/scroll'

const SEEN_KEY = 'khs-tech-game-seen'

/**
 * Small DOM overlay for the "Collect My Tech Stack" mini-game:
 *  - a thought-cloud that invites people to play (click it for "How to play"),
 *  - the progress pill (also the keyboard / tap-friendly way to reveal the next technology),
 *  - an info card for the technology you just unlocked.
 * Deliberately tiny — the portrait stays the hero of the section.
 */
export default function TechHud({
  collected, last, onReveal, onReset,
}: {
  collected: string[]
  last: { id: string; stamp: number } | null
  onReveal: () => void
  onReset: () => void
}) {
  const reduce = useReducedMotion()
  const total = TECH_ITEMS.length
  const count = collected.length
  const done = count >= total

  /* info card auto-hides */
  const [shown, setShown] = useState<{ id: string; stamp: number } | null>(null)
  useEffect(() => {
    if (!last) return
    setShown(last)
    const t = window.setTimeout(() => setShown(null), last.id === '__done' ? 9000 : 5200)
    return () => window.clearTimeout(t)
  }, [last])

  /* "How to play" cloud: full invitation until the visitor has opened it or played once */
  const [helpOpen, setHelpOpen] = useState(false)
  const [seen, setSeen] = useState(true) // start compact to avoid a flash before we read storage
  useEffect(() => {
    try {
      setSeen(sessionStorage.getItem(SEEN_KEY) === '1')
    } catch {
      setSeen(false)
    }
  }, [])
  const markSeen = () => {
    setSeen(true)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {}
  }
  useEffect(() => {
    if (count > 0 && !seen) markSeen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])
  useEffect(() => {
    if (!helpOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setHelpOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [helpOpen])

  const item = shown && shown.id !== '__done' ? TECH_ITEMS.find((t) => t.id === shown.id) : null
  const label = count === 0 ? 'Discover My Tech Stack' : done ? 'All 8 discovered · Replay' : `${count} / ${total} Technologies Discovered`
  const compactCloud = seen // after the first look, the cloud shrinks to a small "?"

  return (
    <div className="absolute left-1/2 top-full z-20 mt-[4.4rem] flex w-[min(310px,calc(100%-1rem))] -translate-x-1/2 flex-col-reverse items-center gap-2 sm:bottom-3 sm:left-auto sm:right-3 sm:top-auto sm:mt-0 sm:w-auto sm:max-w-[310px] sm:translate-x-0 sm:flex-col sm:items-end">
      <AnimatePresence mode="wait">
        {helpOpen ? (
          <motion.div
            key="help"
            initial={reduce ? false : { opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 shadow-xl"
            role="dialog"
            aria-label="How to play the tech stack game"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--fg)]">How to play</p>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                aria-label="Close instructions"
                className="-mr-1 flex h-6 w-6 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5C39]"
              >
                ✕
              </button>
            </div>
            <ol className="space-y-1.5 text-xs leading-relaxed text-[var(--muted)]">
              <li><span className="font-bold text-[#FF5C39]">1.</span> Eight tech chips orbit my portrait.</li>
              <li><span className="font-bold text-[#FF5C39]">2.</span> Click (or tap) a chip to collect it and see what it is.</li>
              <li><span className="font-bold text-[#FF5C39]">3.</span> Collect all 8 — the counter fills as you go.</li>
              <li><span className="font-bold text-[#FF5C39]">4.</span> Stuck? The little drone hovers by one you haven&apos;t found, or tap the counter to reveal the next.</li>
            </ol>
            <p className="mt-2 text-[11px] text-[var(--muted)]">Totally optional — just for fun.</p>
          </motion.div>
        ) : (
          shown && (
            <motion.div
              key={shown.stamp}
              initial={reduce ? false : { opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 shadow-xl"
              role="status"
            >
              {item ? (
                <>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                    <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--fg)]">{item.name} unlocked</p>
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--muted)]">{item.desc}</p>
                </>
              ) : (
                <>
                  <p className="mb-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--fg)]">Full stack discovered</p>
                  <p className="mb-2 text-xs leading-relaxed text-[var(--muted)]">That&apos;s the whole universe. Let&apos;s build something together.</p>
                  <button
                    type="button"
                    onClick={() => scrollToId('contact')}
                    className="font-mono text-[11px] font-bold text-[#FF5C39] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5C39]"
                  >
                    Say hello →
                  </button>
                </>
              )}
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* thought-cloud: invitation → "How to play" (shrinks to a small "?" once seen) */}
      {!helpOpen && (
        <motion.button
          type="button"
          onClick={() => {
            markSeen()
            setHelpOpen(true)
            setShown(null)
          }}
          aria-label="How to play the tech stack game"
          initial={reduce ? false : { opacity: 0, scale: 0.8 }}
          animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -4, 0] }}
          transition={reduce ? { duration: 0.2 } : { opacity: { duration: 0.4 }, scale: { duration: 0.4 }, y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } }}
          whileHover={reduce ? undefined : { scale: 1.06 }}
          className={`relative flex items-center gap-1.5 border border-[var(--border)] bg-[var(--card)] font-mono text-[var(--fg)] shadow-lg transition-colors hover:border-[#FF5C39] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5C39] ${
            compactCloud ? 'h-7 w-7 justify-center rounded-full text-[12px] font-bold' : 'rounded-[999px] px-3.5 py-1.5 text-[11px]'
          }`}
        >
          {compactCloud ? (
            <span aria-hidden>?</span>
          ) : (
            <>
              <span aria-hidden>💡</span>
              <span className="whitespace-nowrap">Psst… there&apos;s a mini-game here</span>
            </>
          )}
          {/* little cloud puffs pointing at the pill (down on desktop, up on phones) */}
          <span aria-hidden className="pointer-events-none absolute left-1/2 -top-1.5 h-2 w-2 -translate-x-1/2 rounded-full border border-[var(--border)] bg-[var(--card)] sm:-bottom-1.5 sm:top-auto" />
          <span aria-hidden className="pointer-events-none absolute left-1/2 -top-3 h-1 w-1 -translate-x-1/2 rounded-full border border-[var(--border)] bg-[var(--card)] sm:-bottom-3 sm:top-auto" />
        </motion.button>
      )}

      <button
        type="button"
        onClick={done ? onReset : onReveal}
        aria-label={
          done
            ? 'All technologies discovered. Replay the tech stack game'
            : count === 0
            ? 'Discover my tech stack: reveal the first technology'
            : `${count} of ${total} technologies discovered. Reveal the next one`
        }
        className="group flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--card)] py-1.5 pl-3 pr-3.5 font-mono text-[11px] text-[var(--fg)] shadow-lg transition-colors hover:border-[#FF5C39] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5C39]"
      >
        <span className="flex items-center gap-[3px]" aria-hidden>
          {TECH_ITEMS.map((t) => (
            <span
              key={t.id}
              className="h-1.5 w-2.5 rounded-full transition-all duration-500"
              style={{ backgroundColor: collected.includes(t.id) ? t.color : 'var(--border)' }}
            />
          ))}
        </span>
        <span className="whitespace-nowrap">{label}</span>
        {count === 0 && !reduce && <span aria-hidden className="h-1.5 w-1.5 animate-ping rounded-full bg-[#FF5C39]" />}
      </button>
    </div>
  )
}
