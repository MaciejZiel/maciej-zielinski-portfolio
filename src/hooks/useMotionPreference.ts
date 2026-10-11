import { useReducedMotion } from 'framer-motion'
import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'portfolio-motion-paused'
const listeners = new Set<() => void>()
let paused = false

try {
  paused = window.localStorage.getItem(STORAGE_KEY) === '1'
} catch {
  // Storage can be blocked; the page then simply starts with motion on.
}

const applyToDocument = () => {
  document.documentElement.dataset.motion = paused ? 'paused' : 'running'
}
applyToDocument()

export function setMotionPaused(next: boolean) {
  paused = next
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
  } catch {
    // Not remembering the choice is acceptable.
  }
  applyToDocument()
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** True when the visitor paused motion with the switch in the header. */
export function useMotionPaused() {
  return useSyncExternalStore(subscribe, () => paused, () => false)
}

/** The system's reduced-motion setting or the visitor's own pause, whichever is on. */
export function useReduceMotion() {
  const systemReduced = useReducedMotion()
  const userPaused = useMotionPaused()
  return Boolean(systemReduced) || userPaused
}
