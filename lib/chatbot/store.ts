'use client'

import { useSyncExternalStore } from 'react'

/** Tiny shared store so the mascot (launcher) and the chat panel stay in sync without a provider. */
type State = { open: boolean; busy: boolean; hinted: boolean }

let state: State = { open: false, busy: false, hinted: false }
const subs = new Set<() => void>()

function set(patch: Partial<State>) {
  state = { ...state, ...patch }
  subs.forEach((fn) => fn())
}

export const chatStore = {
  setOpen: (open: boolean) => set(open ? { open, hinted: true } : { open }),
  toggle: () => set(state.open ? { open: false } : { open: true, hinted: true }),
  setBusy: (busy: boolean) => set({ busy }),
}

const subscribe = (fn: () => void) => {
  subs.add(fn)
  return () => {
    subs.delete(fn)
  }
}

const SERVER_STATE: State = { open: false, busy: false, hinted: false }

export function useChatState(): State {
  return useSyncExternalStore(subscribe, () => state, () => SERVER_STATE)
}
