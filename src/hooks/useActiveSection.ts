import { useEffect, useState } from 'react'

import type { NavigationItem } from '../types/portfolio'

export function useActiveSection(items: NavigationItem[]) {
  const [activeHref, setActiveHref] = useState('')

  useEffect(() => {
    const sections = items
      .map((item) => ({
        href: item.href,
        element: document.querySelector<HTMLElement>(item.href),
      }))
      .filter((entry) => entry.element !== null)

    let frame = 0
    let active = ''
    let offsets: { href: string; top: number }[] = []
    const syncActiveSection = () => {
      frame = 0
      const threshold = window.scrollY + window.innerHeight * 0.35
      let currentHref = ''

      for (const section of offsets) {
        if (section.top <= threshold) {
          currentHref = section.href
        }
      }

      if (active !== currentHref) { active = currentHref; setActiveHref(currentHref) }
    }

    const measure = () => {
      cancelAnimationFrame(frame)
      offsets = sections.map(section => ({ href: section.href, top: section.element!.getBoundingClientRect().top + window.scrollY }))
      syncActiveSection()
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(syncActiveSection) }
    const observer = new ResizeObserver(measure)
    observer.observe(document.querySelector('main') ?? document.body)
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
    }
  }, [items])

  return activeHref
}
