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
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 28])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 16])

  const [firstName, ...lastNameParts] = profile.name.split(' ')
  const lastName = lastNameParts.join(' ')

  return (
    <section ref={sectionRef} id="top" className="hero-section">
      <div className="hero-section__grid">
        <motion.div
          className="hero-copy"
          style={reduceMotion ? undefined : { y: copyY }}
        >
          <MotionReveal className="hero-copy__body" distance={28}>
            <div className="hero-copy__eyebrow-row">
              <p className="hero-copy__eyebrow">
                Backend developer / AI systems / {profile.location}
              </p>
              <span className="hero-copy__availability">
                Open to internship / junior roles
              </span>
            </div>

            <div className="hero-copy__masthead">
              <h1 className="hero-copy__title">
                <span>{firstName}</span>
                <span>{lastName}</span>
              </h1>
              <p className="hero-copy__headline">{profile.headline}</p>
            </div>

            <div className="hero-copy__body-grid">
              <div className="hero-copy__narrative">
                <div className="hero-copy__lead">
                  <p className="hero-copy__summary">{profile.intro}</p>
                  <p className="hero-copy__support">{profile.summary}</p>
                </div>

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
            </div>
          </MotionReveal>

          <MotionReveal className="hero-copy__ledger" delay={0.12}>
            <p className="hero-copy__ledger-label">Core strengths</p>
            <div className="hero-copy__ledger-items">
              {profile.details.map((detail) => (
                <div key={detail.label} className="hero-copy__fact">
                  <span>{detail.label}</span>
                  <strong>{detail.value}</strong>
                </div>
              ))}
            </div>
          </MotionReveal>
        </motion.div>

        <motion.aside
          className="hero-artifact"
          style={reduceMotion ? undefined : { y: stageY }}
        >
          <MotionReveal className="hero-artifact__frame" delay={0.1}>
            <div className="hero-artifact__topline">
              <span>Flagship project</span>
              <span>System view</span>
            </div>

            <div className="hero-artifact__header">
              <p className="hero-artifact__label">CaseFlow / private backend</p>
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

      <MotionReveal className="hero-ribbon" delay={0.18}>
        <div className="hero-ribbon__label">Selected work signals</div>
        <div className="hero-ribbon__viewport">
          <div className="hero-ribbon__marquee">
            <div className="hero-ribbon__track">
              {profile.heroRibbon.map((item) => (
                <span key={item} className="hero-ribbon__item">
                  {item}
                </span>
              ))}
            </div>
            <div className="hero-ribbon__track hero-ribbon__track--duplicate" aria-hidden="true">
              {profile.heroRibbon.map((item) => (
                <span key={`${item}-duplicate`} className="hero-ribbon__item">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </MotionReveal>
    </section>
  )
}
