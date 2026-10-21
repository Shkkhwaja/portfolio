/** Smooth-scroll to an element id (or "#id"), going through Lenis when it is running. */
export function scrollToId(idOrHash: string, offset = -72) {
  const el = document.getElementById(idOrHash.replace('#', ''))
  if (!el) return
  const lenis = typeof window !== 'undefined' ? window.__lenis : undefined
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function scrollToTop() {
  const lenis = typeof window !== 'undefined' ? window.__lenis : undefined
  if (lenis) lenis.scrollTo(0, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
