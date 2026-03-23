import { useEffect, useState } from 'react'

import type { NavigationItem } from '../../types/portfolio'

interface SectionShortcutProps {
  items: NavigationItem[]
}

export function SectionShortcut({ items }: SectionShortcutProps) {
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

  return (
    <aside className="section-shortcut" aria-label="Section shortcut">
      <div className="section-shortcut__inner">
        {items.map((item) => {
          const isActive = item.href === activeHref

          return (
            <a
              key={item.href}
              className={`section-shortcut__link${isActive ? ' section-shortcut__link--active' : ''}`}
              href={item.href}
            >
              <span className="section-shortcut__dot" aria-hidden="true" />
              <span className="section-shortcut__label">{item.label}</span>
            </a>
          )
        })}
      </div>
    </aside>
  )
}
