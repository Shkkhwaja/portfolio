import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { SYSTEM_PROMPT } from '@/lib/chatbot/knowledge'
import { CHAT_CONFIG, CHAT_LIMITS } from '@/lib/chatbot/config'
import { rateLimit } from '@/lib/chatbot/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

type ChatMessage = { role: 'user' | 'assistant'; content: string }

function json(error: string, status: number, headers?: Record<string, string>) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  })
}

function validate(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== 'object') return null
  const raw = (body as { messages?: unknown }).messages
  if (!Array.isArray(raw) || raw.length === 0) return null

  const out: ChatMessage[] = []
  for (const m of raw.slice(-CHAT_LIMITS.maxMessages)) {
    if (!m || typeof m !== 'object') return null
    const { role, content } = m as { role?: unknown; content?: unknown }
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
    // strip control chars, trim, cap length
    const clean = content.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
    if (!clean) return null
    if (role === 'user') {
      if (clean.length > CHAT_LIMITS.maxMessageChars) return null
      out.push({ role, content: clean })
    } else {
      // assistant turns are our own earlier (long) replies echoed back: truncate, never reject
      out.push({ role, content: clean.slice(0, CHAT_LIMITS.maxAssistantChars) })
    }
  }
  if (out[out.length - 1].role !== 'user') return null
  return out
}

/** Drops <think>…</think> blocks that some reasoning models inline into `content`, even across chunks. */
function createThinkFilter() {
  let inThink = false
  let buf = ''
  return (chunk: string): string => {
    buf += chunk
    let out = ''
    for (;;) {
      if (inThink) {
        const end = buf.indexOf('</think>')
        if (end === -1) {
          buf = buf.slice(-8) // keep tail in case the tag is split
          return out
        }
        buf = buf.slice(end + 8)
        inThink = false
      } else {
        const start = buf.indexOf('<think>')
        if (start === -1) {
          // hold back a possible partial "<think>" prefix at the end
          const keep = Math.min(buf.length, 6)
          let hold = 0
          for (let i = keep; i > 0; i--) {
            if ('<think>'.startsWith(buf.slice(-i))) {
              hold = i
              break
            }
          }
          out += buf.slice(0, buf.length - hold)
          buf = buf.slice(buf.length - hold)
          return out
        }
        out += buf.slice(0, start)
        buf = buf.slice(start + 7)
        inThink = true
      }
    }
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) return json('Chat is not configured yet.', 503)

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
  const rl = rateLimit(ip)
  if (!rl.ok) {
    return json('Too many messages. Please wait a moment and try again.', 429, {
      'Retry-After': String(rl.retryAfterSec),
    })
  }

  const declared = Number(req.headers.get('content-length') ?? 0)
  if (declared > CHAT_LIMITS.maxBodyBytes) return json('Request too large.', 413)

  let text: string
  try {
    text = await req.text()
  } catch {
    return json('Invalid request.', 400)
  }
  if (text.length > CHAT_LIMITS.maxBodyBytes) return json('Request too large.', 413)

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return json('Invalid JSON.', 400)
  }
  const messages = validate(parsed)
  if (!messages) return json('Invalid messages. Keep each message under 1000 characters.', 400)

  const openai = new OpenAI({ apiKey, baseURL: CHAT_CONFIG.baseURL, maxRetries: 0 })
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), CHAT_CONFIG.upstreamTimeoutMs)
  req.signal.addEventListener('abort', () => controller.abort())

  let upstream: Awaited<ReturnType<typeof openai.chat.completions.create>> & AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
  try {
    upstream = (await openai.chat.completions.create(
      {
        model: CHAT_CONFIG.model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        temperature: CHAT_CONFIG.temperature,
        top_p: CHAT_CONFIG.topP,
        max_tokens: CHAT_CONFIG.maxTokens,
        stream: true,
      },
      { signal: controller.signal },
    )) as typeof upstream
  } catch (err) {
    clearTimeout(timeout)
    const status = (err as { status?: number })?.status
    console.error('[chat] upstream error', status ?? (err as Error)?.name)
    if (status === 429) return json('The AI service is busy or its quota is used up. Please try again later.', 429)
    if (status === 401 || status === 403) return json('Chat is temporarily unavailable.', 503)
    if ((err as Error)?.name === 'AbortError') return json('The AI service timed out. Please try again.', 504)
    return json('The AI service is unavailable. Please try again.', 502)
  }

  const encoder = new TextEncoder()
  const filter = createThinkFilter()

  const stream = new ReadableStream({
    async start(ctrl) {
      try {
        for await (const chunk of upstream) {
          // Only user-facing `content`; `reasoning_content` is intentionally never forwarded.
          const piece = chunk.choices?.[0]?.delta?.content
          if (!piece) continue
          const visible = filter(piece)
          if (visible) ctrl.enqueue(encoder.encode(visible))
        }
        ctrl.close()
      } catch (err) {
        console.error('[chat] stream interrupted', (err as Error)?.name)
        ctrl.error(err)
      } finally {
        clearTimeout(timeout)
      }
    },
    cancel() {
      controller.abort()
      clearTimeout(timeout)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
