import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion'

import { useActiveSection } from '../../hooks/useActiveSection'
import type { NavigationItem } from '../../types/portfolio'

interface SectionShortcutProps {
  items: NavigationItem[]
}

export function SectionShortcut({ items }: SectionShortcutProps) {
  const activeHref = useActiveSection(items)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progressScaleY = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.24,
  })

  return (
    <aside className="section-shortcut" aria-label="Section shortcut">
      <div className="section-shortcut__inner">
        <span className="section-shortcut__progress-track" aria-hidden="true" />
        <motion.span
          aria-hidden="true"
          className="section-shortcut__progress-fill"
          style={reduceMotion ? undefined : { scaleY: progressScaleY }}
        />
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
