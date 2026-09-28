import { useEffect, useState, type RefObject } from 'react'
import { usePageVisible } from './usePageVisible'

const targets = new Map<Element, (visible: boolean) => void>()
let observer: IntersectionObserver | null = null

/** A pooled observer keeps ambient loops dormant outside the viewport or in a hidden tab. */
export function useAmbientActivity(ref: RefObject<Element | null>) {
  const [inView, setInView] = useState(false)
  const pageVisible = usePageVisible()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    observer ??= new IntersectionObserver(entries => {
      entries.forEach(entry => targets.get(entry.target)?.(entry.isIntersecting))
    }, { rootMargin: '120px' })
    targets.set(element, setInView)
    observer.observe(element)
    return () => {
      observer?.unobserve(element)
      targets.delete(element)
      if (!targets.size) { observer?.disconnect(); observer = null }
    }
  }, [ref])

  return inView && pageVisible
}
