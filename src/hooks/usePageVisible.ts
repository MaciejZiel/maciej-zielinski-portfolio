import { useSyncExternalStore } from 'react'

const subscribers = new Set<() => void>()
const notify = () => subscribers.forEach(callback => callback())
const snapshot = () => document.visibilityState !== 'hidden'
const serverSnapshot = () => true

function subscribe(callback: () => void) {
  if (!subscribers.size) document.addEventListener('visibilitychange', notify)
  subscribers.add(callback)
  return () => {
    subscribers.delete(callback)
    if (!subscribers.size) document.removeEventListener('visibilitychange', notify)
  }
}

/** One shared visibility subscription for all ambient animation owners. */
export function usePageVisible() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}
