/**
 * Sliding-window in-memory rate limiter.
 *
 * Caveat: on Vercel each serverless instance keeps its own memory, so this is a
 * best-effort guard, not a hard global limit. For strict limits swap this module
 * for Upstash Redis / Vercel KV (same `rateLimit(key)` signature).
 */
import { CHAT_LIMITS } from './config'

const hits = new Map<string, number[]>()

export function rateLimit(key: string): { ok: boolean; retryAfterSec: number } {
  const now = Date.now()
  const windowStart = now - CHAT_LIMITS.rateWindowMs
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart)

  if (recent.length >= CHAT_LIMITS.rateMaxRequests) {
    hits.set(key, recent)
    const retryAfterSec = Math.ceil((recent[0] + CHAT_LIMITS.rateWindowMs - now) / 1000)
    return { ok: false, retryAfterSec: Math.max(retryAfterSec, 1) }
  }

  recent.push(now)
  hits.set(key, recent)

  // opportunistic cleanup so the map cannot grow unbounded
  if (hits.size > 5000) {
    hits.forEach((v, k) => {
      if (!v.some((t) => t > windowStart)) hits.delete(k)
    })
  }
  return { ok: true, retryAfterSec: 0 }
}
