import { useEffect, useState } from 'react'

import type { NavigationItem } from '../types/portfolio'

export function useActiveSection(items: NavigationItem[]) {
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? '')

  useEffect(() => {
    const sections = items
      .map((item) => ({
        href: item.href,
        element: document.querySelector<HTMLElement>(item.href),
      }))
      .filter((entry) => entry.element !== null)

    const syncActiveSection = () => {
      const threshold = window.innerHeight * 0.35
      let currentHref = sections[0]?.href ?? ''

      for (const section of sections) {
        if (!section.element) {
          continue
        }

        const { top } = section.element.getBoundingClientRect()
        if (top <= threshold) {
          currentHref = section.href
        }
      }

      setActiveHref(currentHref)
    }

    syncActiveSection()
    window.addEventListener('scroll', syncActiveSection, { passive: true })
    window.addEventListener('resize', syncActiveSection)

    return () => {
      window.removeEventListener('scroll', syncActiveSection)
      window.removeEventListener('resize', syncActiveSection)
    }
  }, [items])

  return activeHref
}
