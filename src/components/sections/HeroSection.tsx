import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useRef } from 'react'

import type { Profile } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'
import { MotionReveal } from '../ui/MotionReveal'

interface HeroSectionProps {
  profile: Profile
}

export function HeroSection({ profile }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const ribbonX = useTransform(scrollYProgress, [0, 1], [0, -180])

  const [firstName, ...lastNameParts] = profile.name.split(' ')
  const lastName = lastNameParts.join(' ')
  const ribbonItems = [...profile.heroRibbon, ...profile.heroRibbon]

  return (
    <section ref={sectionRef} id="top" className="hero-section">
      <div className="hero-section__mesh" aria-hidden="true" />

      <div className="hero-section__grid">
        <MotionReveal className="hero-copy" distance={48}>
          <p className="hero-copy__eyebrow">Backend engineering / AI systems</p>
          <h1 className="hero-copy__title">
            <span>{firstName}</span>
            <span>{lastName}</span>
          </h1>
          <p className="hero-copy__headline">{profile.headline}</p>
          <p className="hero-copy__summary">{profile.intro}</p>

          <div className="hero-copy__actions">
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
        </MotionReveal>

        <motion.aside
          className="hero-stage"
          style={reduceMotion ? undefined : { y: stageY }}
        >
          <MotionReveal className="hero-stage__surface" delay={0.14}>
            <p className="hero-stage__label">Current focus</p>
            <ul className="hero-stage__focus-list">
              {profile.focusAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="hero-stage__details" delay={0.22}>
            {profile.details.map((detail) => (
              <div key={detail.label} className="hero-stage__detail">
                <p>{detail.label}</p>
                <strong>{detail.value}</strong>
              </div>
            ))}
          </MotionReveal>

          <MotionReveal className="hero-stage__status" delay={0.28}>
            <span className="hero-stage__status-dot" aria-hidden="true" />
            <div>
              <p className="hero-stage__status-label">Availability</p>
              <p className="hero-stage__status-value">{profile.availability}</p>
            </div>
          </MotionReveal>
        </motion.aside>
      </div>

      <div className="hero-strip">
        <motion.div
          className="hero-strip__track"
          style={reduceMotion ? undefined : { x: ribbonX }}
        >
          {ribbonItems.map((item, index) => (
            <span key={`${item}-${index}`} className="hero-strip__item">
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="hero-meta">
        <MotionReveal className="hero-meta__lead" delay={0.1}>
          <p>{profile.summary}</p>
        </MotionReveal>
        <MotionReveal className="hero-meta__facts" delay={0.18}>
          <span>{profile.location}</span>
          <span>{profile.education}</span>
        </MotionReveal>
      </div>
    </section>
  )
}
