export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export type ChatErrorKind =
  | 'offline'
  | 'network'
  | 'rate_limit'
  | 'timeout'
  | 'interrupted'
  | 'empty'
  | 'unavailable'
  | 'invalid'
  | 'server'

export class ChatError extends Error {
  constructor(
    message: string,
    public kind: ChatErrorKind,
    public status?: number,
    /** seconds until a retry makes sense (rate limits) */
    public retryAfter?: number,
    /** text received before an interruption */
    public partial?: string,
  ) {
    super(message)
  }
}

const FIRST_BYTE_TIMEOUT_MS = 30_000
const IDLE_TIMEOUT_MS = 25_000

function fromStatus(status: number, serverMsg: string | undefined, retryAfter?: number): ChatError {
  switch (status) {
    case 400:
    case 413:
      return new ChatError(serverMsg || 'That message could not be processed. Try a shorter question.', 'invalid', status)
    case 429:
      return new ChatError(
        serverMsg || 'Too many requests right now. Please wait a moment.',
        'rate_limit',
        status,
        retryAfter ?? 20,
      )
    case 503:
      return new ChatError(serverMsg || 'The assistant is temporarily unavailable.', 'unavailable', status)
    case 504:
      return new ChatError(serverMsg || 'The assistant took too long to respond.', 'timeout', status)
    default:
      return new ChatError(serverMsg || 'The assistant ran into a problem. Please try again.', 'server', status)
  }
}

/**
 * POSTs the conversation to /api/chat and calls `onToken` with the accumulated
 * assistant text as chunks arrive. Throws ChatError on HTTP or stream failure.
 * Aborts itself if the server goes silent (first byte / idle timeouts).
 */
export async function streamChat(
  messages: ChatMessage[],
  onToken: (fullText: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new ChatError("You're offline. Check your connection and retry.", 'offline')
  }

  const controller = new AbortController()
  let timedOut = false
  const onUserAbort = () => controller.abort()
  signal?.addEventListener('abort', onUserAbort)

  let timer: ReturnType<typeof setTimeout> | undefined
  const arm = (ms: number) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, ms)
  }
  const cleanup = () => {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onUserAbort)
  }

  let full = ''
  try {
    arm(FIRST_BYTE_TIMEOUT_MS)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    })

    if (!res.ok || !res.body) {
      let msg: string | undefined
      try {
        msg = (await res.json())?.error
      } catch {}
      const ra = Number(res.headers.get('Retry-After'))
      throw fromStatus(res.status, msg, Number.isFinite(ra) && ra > 0 ? ra : undefined)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    for (;;) {
      arm(full ? IDLE_TIMEOUT_MS : FIRST_BYTE_TIMEOUT_MS)
      const { done, value } = await reader.read()
      if (done) break
      full += decoder.decode(value, { stream: true })
      onToken(full)
    }
    full += decoder.decode()
    onToken(full)

    if (!full.trim()) throw new ChatError('The assistant returned an empty answer. Please retry.', 'empty')
    return full
  } catch (e) {
    if (e instanceof ChatError) throw e
    if ((e as Error).name === 'AbortError') {
      if (timedOut) {
        throw new ChatError(
          full ? 'The response stalled partway through.' : 'The assistant is taking too long to respond.',
          full ? 'interrupted' : 'timeout',
          undefined,
          undefined,
          full || undefined,
        )
      }
      throw e // user cancelled
    }
    if (full) throw new ChatError('The connection was interrupted mid-answer.', 'interrupted', undefined, undefined, full)
    throw new ChatError("Couldn't reach the assistant. Check your connection and retry.", 'network')
  } finally {
    cleanup()
  }
}
