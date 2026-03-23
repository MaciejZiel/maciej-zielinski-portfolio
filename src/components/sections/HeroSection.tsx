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
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 92])
  const stageRotate = useTransform(scrollYProgress, [0, 1], [-2.5, 1.5])
  const ribbonX = useTransform(scrollYProgress, [0, 1], [0, -180])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 28])

  const [firstName, ...lastNameParts] = profile.name.split(' ')
  const lastName = lastNameParts.join(' ')
  const ribbonItems = [...profile.heroRibbon, ...profile.heroRibbon]

  return (
    <section ref={sectionRef} id="top" className="hero-section">
      <div className="hero-section__mesh" aria-hidden="true" />
      <div className="hero-section__beam hero-section__beam--left" aria-hidden="true" />
      <div className="hero-section__beam hero-section__beam--right" aria-hidden="true" />

      <div className="hero-section__grid">
        <motion.div
          className="hero-copy"
          style={reduceMotion ? undefined : { y: copyY }}
        >
          <MotionReveal className="hero-copy__body" distance={48}>
            <p className="hero-copy__eyebrow">Backend engineering / AI systems</p>

            <div className="hero-copy__masthead">
              <h1 className="hero-copy__title">
                <span>{firstName}</span>
                <span>{lastName}</span>
              </h1>
              <p className="hero-copy__headline">{profile.headline}</p>
            </div>

            <div className="hero-copy__body-grid">
              <div className="hero-copy__narrative">
                <p className="hero-copy__summary">{profile.intro}</p>

                <ul className="hero-copy__focus-listing">
                  {profile.focusAreas.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

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
              </div>

              <dl className="hero-copy__proof">
                {profile.details.map((detail) => (
                  <div key={detail.label} className="hero-copy__proof-item">
                    <dt>{detail.label}</dt>
                    <dd>{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </MotionReveal>

          <MotionReveal className="hero-copy__ledger" delay={0.18}>
            <p className="hero-copy__ledger-label">Engineering through-lines</p>
            <div className="hero-copy__ledger-items">
              <span>APIs</span>
              <span>Orchestration</span>
              <span>Auth</span>
              <span>RAG</span>
              <span>Realtime AI</span>
            </div>
          </MotionReveal>
        </motion.div>

        <motion.aside
          className="hero-artifact"
          style={reduceMotion ? undefined : { y: stageY, rotate: stageRotate }}
        >
          <MotionReveal className="hero-artifact__frame" delay={0.14}>
            <div className="hero-artifact__topline">
              <span>Flagship build</span>
              <span>{profile.availability}</span>
            </div>

            <div className="hero-artifact__header">
              <p className="hero-artifact__label">CaseFlow / system dossier</p>
              <h2 className="hero-artifact__title">{profile.heroArtifactTitle}</h2>
              <p className="hero-artifact__summary">{profile.heroArtifactSummary}</p>
            </div>

            <div className="hero-artifact__lanes">
              {profile.heroArtifactLanes.map((lane, index) => (
                <section key={lane.label} className="hero-artifact__lane">
                  <div className="hero-artifact__lane-top">
                    <span className="hero-artifact__lane-index">0{index + 1}</span>
                    <div>
                      <p className="hero-artifact__lane-label">{lane.label}</p>
                      <p className="hero-artifact__lane-summary">{lane.summary}</p>
                    </div>
                  </div>

                  <ul className="hero-artifact__lane-list">
                    {lane.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="hero-artifact__foot">
              <span>{profile.location}</span>
              <span>{profile.education}</span>
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
