import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'

import type { NavigationItem } from '../types/portfolio'

export function useActiveSection(items: NavigationItem[], scrollY: MotionValue<number>) {
  const [activeHref, setActiveHref] = useState('')
  const active = useRef('')
  const offsets = useRef<{ href: string; top: number }[]>([])

  const syncActiveSection = (scrollTop: number) => {
    const threshold = scrollTop + window.innerHeight * 0.35
    let currentHref = ''

    for (const section of offsets.current) {
      if (section.top <= threshold) currentHref = section.href
    }

    if (active.current !== currentHref) {
      active.current = currentHref
      setActiveHref(currentHref)
    }
  }

  useMotionValueEvent(scrollY, 'change', syncActiveSection)

  useEffect(() => {
    const sections = items.flatMap((item) =>
      [item.href, ...(item.activeHrefs ?? [])].map((href) => ({
        navHref: item.href,
        element: document.querySelector<HTMLElement>(href),
      })),
    ).filter((entry) => entry.element !== null)

    const measure = () => {
      const scrollTop = window.scrollY
      offsets.current = sections
        .map(section => ({ href: section.navHref, top: section.element!.getBoundingClientRect().top + scrollTop }))
        .sort((a, b) => a.top - b.top)
      syncActiveSection(scrollTop)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(document.querySelector('main') ?? document.body)
    measure()
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [items, scrollY])

  return activeHref
}
