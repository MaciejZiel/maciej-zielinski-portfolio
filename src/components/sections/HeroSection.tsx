import type { Profile } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'

interface HeroSectionProps {
  profile: Profile
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section id="top" className="section hero-section">
      <div className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">Python backend and AI portfolio</p>
          <h1 className="hero__title">{profile.name}</h1>
          <p className="hero__headline">{profile.headline}</p>
          <p className="hero__summary">{profile.intro}</p>

          <div className="hero__actions">
            {profile.heroLinks.map((link) => (
              <ButtonLink
                key={link.label}
                href={link.href}
                variant={link.variant}
                icon={link.icon}
                external={link.external}
              >
                {link.label}
              </ButtonLink>
            ))}
          </div>

          <ul className="hero__meta">
            <li className="hero__meta-item">{profile.summary}</li>
            <li className="hero__meta-item">{profile.location}</li>
            <li className="hero__meta-item">{profile.education}</li>
          </ul>
        </div>

        <aside className="hero__panel" aria-label="Current profile details">
          <div className="hero-card hero-card--status">
            <span className="hero-card__status-dot" aria-hidden="true" />
            <p>{profile.availability}</p>
          </div>

          <div className="hero-card">
            <p className="hero-card__label">Current focus</p>
            <ul className="hero-focus-list">
              {profile.focusAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <dl className="hero-details hero-card">
            {profile.details.map((detail) => (
              <div key={detail.label} className="hero-details__item">
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}
