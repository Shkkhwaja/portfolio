'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiX, FiSend, FiTrash2, FiRefreshCw, FiAlertTriangle, FiWifiOff, FiClock, FiMail } from 'react-icons/fi'
import SafeMarkdown from './SafeMarkdown'
import Mascot from '@/components/mascot/Mascot'
import AurexLogo from './AurexLogo'
import { streamChat, ChatError, type ChatMessage, type ChatErrorKind } from '@/lib/chatbot/stream'
import { chatStore, useChatState } from '@/lib/chatbot/store'
import { PERSON } from '@/lib/seo-config'
import { BOT } from '@/lib/chatbot/brand'

const SUGGESTIONS = [
  'Tell me about yourself.',
  'What technologies do you work with?',
  'Show me your best projects.',
  'Tell me about your professional experience.',
  'How can I contact you?',
]

const MAX_INPUT = 1000

type ErrorState = { message: string; kind: ChatErrorKind; retryAfter: number }

/**
 * Chat panel. The launcher is the site mascot (ScrollingMascot) — when the panel is open the
 * mascot perches on top of it, so the robot is always visible above the chat.
 */
export default function ChatWidget() {
  const reduceMotion = useReducedMotion()
  const { open, busy } = useChatState()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorState | null>(null)
  const [countdown, setCountdown] = useState(0)

  const abortRef = useRef<AbortController | null>(null)
  const pendingRef = useRef<ChatMessage[]>([]) // history of the request that is / was in flight
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const close = useCallback(() => chatStore.setOpen(false), [])

  /* auto-scroll on new content */
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion || loading ? 'auto' : 'smooth' })
  }, [messages, error, loading, reduceMotion])

  /* focus input on open, Esc to close */
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 200)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  /* rate-limit countdown */
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  /* auto-resize textarea */
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`
  }, [input, open])

  /* abort any in-flight request on unmount; keep busy flag honest */
  useEffect(
    () => () => {
      abortRef.current?.abort()
      chatStore.setBusy(false)
    },
    [],
  )

  const run = useCallback(async (history: ChatMessage[]) => {
    pendingRef.current = history
    setError(null)
    setCountdown(0)
    setLoading(true)
    chatStore.setBusy(true)
    const controller = new AbortController()
    abortRef.current = controller
    setMessages([...history, { role: 'assistant', content: '' }])
    try {
      await streamChat(
        history,
        (text) => setMessages([...history, { role: 'assistant', content: text }]),
        controller.signal,
      )
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      const err =
        e instanceof ChatError ? e : new ChatError('Something went wrong. Please try again.', 'server')
      // keep any partial answer visible; otherwise drop the empty placeholder
      setMessages(err.partial ? [...history, { role: 'assistant', content: err.partial }] : history)
      setError({ message: err.message, kind: err.kind, retryAfter: err.retryAfter ?? 0 })
      if (err.kind === 'rate_limit') setCountdown(err.retryAfter ?? 20)
    } finally {
      if (abortRef.current === controller) {
        setLoading(false)
        chatStore.setBusy(false)
      }
    }
  }, [])

  const send = (text: string) => {
    const content = text.trim().slice(0, MAX_INPUT)
    if (!content || loading) return
    setInput('')
    const history = messages.filter((m) => m.content)
    // an interrupted partial answer is replaced by the new question's context
    const base = error && history[history.length - 1]?.role === 'assistant' ? history.slice(0, -1) : history
    run([...base, { role: 'user', content }])
  }

  const retry = () => {
    if (loading || countdown > 0 || !pendingRef.current.length) return
    run(pendingRef.current)
  }

  const clear = () => {
    abortRef.current?.abort()
    abortRef.current = null
    pendingRef.current = []
    setMessages([])
    setError(null)
    setCountdown(0)
    setLoading(false)
    chatStore.setBusy(false)
    inputRef.current?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send(input)
    }
  }

  const last = messages[messages.length - 1]
  const showTyping = loading && last?.role === 'assistant' && !last.content
  const canRetry = error && error.kind !== 'invalid' && pendingRef.current.length > 0
  const showEmailFallback = error && (error.kind === 'unavailable' || error.kind === 'server' || error.kind === 'timeout')

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="chat"
          role="dialog"
          aria-label={`${BOT.name} — AI Portfolio Assistant`}
          aria-modal="false"
          initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.96 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="fixed z-[110] inset-x-2 bottom-2 top-28
                     sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-6 sm:w-[400px] sm:h-[min(620px,calc(100dvh-7rem))]"
        >
          {/* Mascot perched above the panel */}
          <motion.div
            className="absolute -top-[74px] left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0 z-10"
            initial={reduceMotion ? false : { y: 40, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
          >
            <Mascot size={58} busy={busy} hoverText="Ask away! 💬" clickText="Boop! ⚡" />
          </motion.div>

          <div
            className={`relative flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--bg-2)] text-[var(--fg)] border shadow-2xl transition-[border-color,box-shadow] duration-500 ${
              loading
                ? 'border-[#D4FF4F]/50 shadow-[0_0_40px_rgba(212,255,79,0.18)]'
                : 'border-[var(--border)] shadow-black/40'
            }`}
          >
            {/* thinking shimmer along the top edge */}
            {loading && !reduceMotion && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 h-[2px] w-1/3 z-10"
                style={{ background: 'linear-gradient(to right, transparent, #D4FF4F, #FF5C39, transparent)' }}
                animate={{ x: ['-100%', '300%'] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            {/* header */}
            <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-[var(--border)] bg-gradient-to-r from-[#FF5C39]/10 to-transparent">
              <div className="flex min-w-0 items-center gap-3">
                <AurexLogo size={42} thinking={loading} priority />
                <div className="min-w-0">
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <span className="relative flex h-2 w-2" aria-hidden>
                    <span className={`absolute inline-flex h-full w-full rounded-full bg-[#D4FF4F] opacity-70 ${reduceMotion ? '' : 'animate-ping'}`} />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4FF4F]" />
                  </span>
                  {BOT.name}
                  <span className="text-[10px] font-mono font-normal text-[var(--muted)] uppercase tracking-wider">AI Assistant</span>
                </h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {loading ? 'Thinking…' : 'Ask me about my skills, projects, and experience.'}
                </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <IconButton label="Clear conversation" onClick={clear} disabled={!messages.length && !error}>
                  <FiTrash2 size={15} />
                </IconButton>
                <IconButton label="Close chat" onClick={close}>
                  <FiX size={17} />
                </IconButton>
              </div>
            </div>

            {/* conversation */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              role="log"
              aria-live="polite"
              aria-busy={loading}
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3 text-sm"
            >
              <Bubble role="assistant">
                <p>
                  Hi! I'm {BOT.name}, Khwaja's AI assistant. Ask me anything about his skills, projects, experience, or how to get in touch.
                </p>
              </Bubble>

              {!messages.length && (
                <div className="flex flex-wrap gap-2 pt-1" aria-label="Suggested questions">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={s}
                      type="button"
                      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.07, type: 'spring', stiffness: 260, damping: 20 }}
                      whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                      onClick={() => send(s)}
                      className="text-xs text-left px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)]
                                 hover:border-[#FF5C39] hover:text-[#FF5C39] hover:-translate-y-0.5 transition-all
                                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5C39]"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}

              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <Bubble key={i} role="user">
                    <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">{m.content}</p>
                  </Bubble>
                ) : m.content ? (
                  <Bubble key={i} role="assistant" thinking={loading && i === messages.length - 1}>
                    <SafeMarkdown text={m.content} />
                    {loading && i === messages.length - 1 && (
                      <span className="inline-block ml-0.5 h-3.5 w-1.5 align-middle bg-[#FF5C39] animate-pulse" aria-hidden />
                    )}
                  </Bubble>
                ) : null,
              )}

              {showTyping && (
                <Bubble role="assistant" thinking>
                  <span className="sr-only">Assistant is typing</span>
                  <span className="flex gap-1 py-1" aria-hidden>
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className={`h-1.5 w-1.5 rounded-full bg-[#FF5C39] ${reduceMotion ? '' : 'animate-bounce'}`}
                        style={{ animationDelay: `${d * 120}ms` }}
                      />
                    ))}
                  </span>
                </Bubble>
              )}

              {error && (
                <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-3 text-xs">
                  <div className="flex items-start gap-2">
                    <ErrorIcon kind={error.kind} />
                    <p className="text-[var(--fg)] leading-relaxed">{error.message}</p>
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 pl-6">
                    {canRetry && (
                      <button
                        type="button"
                        onClick={retry}
                        disabled={countdown > 0}
                        className="inline-flex items-center gap-1.5 font-mono font-bold text-[#FF5C39] enabled:hover:underline
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5C39]"
                      >
                        <FiRefreshCw size={12} aria-hidden />
                        {countdown > 0 ? `Retry in ${countdown}s` : 'Retry'}
                      </button>
                    )}
                    {showEmailFallback && (
                      <a
                        href={`mailto:${PERSON.email}`}
                        className="inline-flex items-center gap-1.5 font-mono text-[var(--muted)] hover:text-[var(--fg)] hover:underline"
                      >
                        <FiMail size={12} aria-hidden /> Email Khwaja instead
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="flex items-end gap-2 p-3 border-t border-[var(--border)]"
            >
              <label htmlFor="chat-input" className="sr-only">
                Message the AI portfolio assistant
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT))}
                onKeyDown={onKeyDown}
                rows={1}
                maxLength={MAX_INPUT}
                placeholder="Ask about skills, projects, experience…"
                className="flex-1 resize-none min-h-[40px] rounded-xl px-3 py-2 text-sm bg-[var(--card)]
                           border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--muted)]
                           focus:outline-none focus:border-[#FF5C39] focus-visible:ring-2 focus-visible:ring-[#FF5C39]/40"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-[#FF5C39] text-white
                           disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:brightness-110 enabled:active:scale-95 transition
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C39]"
              >
                <FiSend size={16} aria-hidden />
              </button>
            </form>
            <p className="px-4 pb-2 -mt-1 text-[10px] text-[var(--muted)]">
              {BOT.name} · Developed by {BOT.developer}. AI can make mistakes — for anything important, use the contact form.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ErrorIcon({ kind }: { kind: ChatErrorKind }) {
  const cls = 'mt-0.5 shrink-0 text-red-500'
  if (kind === 'offline' || kind === 'network') return <FiWifiOff size={14} className={cls} aria-hidden />
  if (kind === 'rate_limit' || kind === 'timeout') return <FiClock size={14} className={cls} aria-hidden />
  return <FiAlertTriangle size={14} className={cls} aria-hidden />
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="h-8 w-8 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--fg)]
                 hover:bg-[var(--border)] disabled:opacity-30 disabled:pointer-events-none transition-colors
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5C39]"
    >
      {children}
    </button>
  )
}

function Bubble({
  role,
  children,
  thinking = false,
}: {
  role: 'user' | 'assistant'
  children: React.ReactNode
  thinking?: boolean
}) {
  const reduce = useReducedMotion()
  const isUser = role === 'user'
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && <AurexLogo size={26} thinking={thinking} className="mb-0.5" />}
      <div
        className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 ${
          isUser
            ? 'bg-[#FF5C39] text-white rounded-br-md'
            : 'bg-[var(--card)] border border-[var(--border)] rounded-bl-md'
        }`}
      >
        {children}
      </div>
    </motion.div>
  )
}
