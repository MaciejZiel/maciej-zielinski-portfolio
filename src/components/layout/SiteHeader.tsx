import type { ActionLink, NavigationItem } from '../../types/portfolio'
import { useActiveSection } from '../../hooks/useActiveSection'
import { Icon } from '../ui/Icon'

interface SiteHeaderProps {
  name: string
  headline: string
  navigationItems: NavigationItem[]
  socialLinks: ActionLink[]
}

export function SiteHeader({
  name,
  headline,
  navigationItems,
  socialLinks,
}: SiteHeaderProps) {
  const activeHref = useActiveSection(navigationItems)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#top" aria-label="Go to homepage top">
          <span className="brand__mark">MZ</span>
          <span className="brand__text">
            <span className="brand__name">{name}</span>
            <span className="brand__headline">{headline}</span>
          </span>
        </a>

        <div className="site-header__right">
          <nav className="site-nav" aria-label="Section navigation">
            {navigationItems.map((item, index) => (
              <a
                key={item.label}
                className={`site-nav__link${item.href === activeHref ? ' site-nav__link--active' : ''}`}
                href={item.href}
                aria-current={item.href === activeHref ? 'location' : undefined}
              >
                <span className="site-nav__number" aria-hidden="true">0{index + 1}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="site-socials" aria-label="Social links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                className="site-socials__link"
                aria-label={link.label}
                href={link.href}
                rel={link.external ? 'noreferrer' : undefined}
                target={link.external ? '_blank' : undefined}
              >
                <span className="site-socials__label">{link.label}</span>
                <Icon
                  name={link.icon ?? 'arrow-up-right'}
                  className="site-socials__icon"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
