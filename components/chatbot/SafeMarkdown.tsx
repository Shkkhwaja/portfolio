import { Fragment, type ReactNode } from 'react'

/**
 * Minimal, XSS-safe Markdown renderer for assistant output.
 * Builds React elements only (never dangerouslySetInnerHTML); raw HTML is shown as text.
 * Supports: paragraphs, "-"/"*"/"1." lists, **bold**, *italic*, `code`, [text](url) and bare URLs.
 */

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s)]+|\*[^*\s][^*]*\*)/g

function safeHref(url: string): string | null {
  try {
    const u = new URL(url)
    return ['http:', 'https:', 'mailto:'].includes(u.protocol) ? u.href : null
  } catch {
    return null
  }
}

function Link({ href, children }: { href: string; children: ReactNode }) {
  const safe = safeHref(href)
  if (!safe) return <>{children}</>
  return (
    <a
      href={safe}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="text-[#FF5C39] underline underline-offset-2 hover:opacity-80 break-all"
    >
      {children}
    </a>
  )
}

function inline(text: string, keyBase: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyBase}-${i}`
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      return <strong key={key}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
      return (
        <code key={key} className="px-1 py-0.5 rounded bg-[var(--border)] font-mono text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      )
    const md = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (md) return <Link key={key} href={md[2]}>{md[1]}</Link>
    if (/^https?:\/\//.test(part)) {
      const trailing = part.match(/[.,;:!?]+$/)?.[0] ?? ''
      const url = trailing ? part.slice(0, -trailing.length) : part
      return (
        <Fragment key={key}>
          <Link href={url}>{url}</Link>
          {trailing}
        </Fragment>
      )
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
      return <em key={key}>{part.slice(1, -1)}</em>
    return <Fragment key={key}>{part}</Fragment>
  })
}

export default function SafeMarkdown({ text }: { text: string }) {
  const lines = text.replace(/\r/g, '').split('\n')
  const blocks: ReactNode[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  let para: string[] = []

  const flushPara = () => {
    if (para.length) {
      const k = `p${blocks.length}`
      blocks.push(<p key={k}>{inline(para.join(' '), k)}</p>)
      para = []
    }
  }
  const flushList = () => {
    if (list) {
      const k = `l${blocks.length}`
      const items = list.items.map((it, i) => <li key={i}>{inline(it, `${k}-${i}`)}</li>)
      blocks.push(
        list.ordered ? (
          <ol key={k} className="list-decimal pl-5 space-y-1">{items}</ol>
        ) : (
          <ul key={k} className="list-disc pl-5 space-y-1">{items}</ul>
        ),
      )
      list = null
    }
  }

  for (const line of lines) {
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/)
    const num = line.match(/^\s*\d+[.)]\s+(.*)$/)
    const heading = line.match(/^\s*#{1,6}\s+(.*)$/)
    if (bullet || num) {
      flushPara()
      const ordered = !!num
      if (list && list.ordered !== ordered) flushList()
      if (!list) list = { ordered, items: [] }
      list.items.push((bullet ?? num)![1])
    } else if (!line.trim()) {
      flushPara()
      flushList()
    } else if (heading) {
      flushPara()
      flushList()
      const k = `h${blocks.length}`
      blocks.push(<p key={k} className="font-semibold">{inline(heading[1], k)}</p>)
    } else {
      flushList()
      para.push(line.trim())
    }
  }
  flushPara()
  flushList()

  return <div className="space-y-2 leading-relaxed [overflow-wrap:anywhere]">{blocks}</div>
}
