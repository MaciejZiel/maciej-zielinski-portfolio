import { useActiveSection } from '../../hooks/useActiveSection'
import type { NavigationItem } from '../../types/portfolio'

interface SectionShortcutProps {
  items: NavigationItem[]
}

export function SectionShortcut({ items }: SectionShortcutProps) {
  const activeHref = useActiveSection(items)

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
