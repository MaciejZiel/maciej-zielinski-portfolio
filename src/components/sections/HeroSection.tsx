import type { Profile } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'
import { Reveal } from '../ui/Reveal'

interface HeroSectionProps {
  profile: Profile
}

export function HeroSection({ profile }: HeroSectionProps) {
  const [firstName, ...lastNameParts] = profile.name.split(' ')
  const lastName = lastNameParts.join(' ')

  return (
    <section id="top" className="section hero-section">
      <div className="hero">
        <Reveal className="hero__content" delay={50}>
          <p className="hero__eyebrow">Python backend and AI portfolio</p>
          <h1 className="hero__title">
            <span>{firstName}</span>
            <span>{lastName}</span>
          </h1>
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
        </Reveal>

        <Reveal
          as="aside"
          className="hero__panel"
          aria-label="Current profile details"
          delay={180}
        >
          <div className="hero-card hero-card--status hero-card--terminal">
            <span className="hero-card__status-dot" aria-hidden="true" />
            <div>
              <p className="hero-card__terminal-label">Now building</p>
              <p>{profile.availability}</p>
            </div>
          </div>

          <div className="hero-card hero-card--focus">
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
        </Reveal>
      </div>
    </section>
  )
}
