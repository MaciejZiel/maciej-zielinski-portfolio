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

const SYSTEM_QUERY = '(prefers-reduced-motion: reduce)'

// Subscribed to the media query itself, so changing the system setting while the page is open
// takes effect at once instead of waiting for a reload.
const subscribeSystem = (listener: () => void) => {
  const query = window.matchMedia(SYSTEM_QUERY)
  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}
const systemSnapshot = () => window.matchMedia(SYSTEM_QUERY).matches

/** The system's reduced-motion setting or the visitor's own pause, whichever is on. */
export function useReduceMotion() {
  const systemReduced = useSyncExternalStore(subscribeSystem, systemSnapshot, () => false)
  const userPaused = useMotionPaused()
  return systemReduced || userPaused
}
