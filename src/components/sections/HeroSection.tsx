import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

import type { Profile } from '../../types/portfolio'
import { Icon } from '../ui/Icon'
import '../../styles/hero.css'

interface HeroSectionProps {
  profile: Profile
}

export function HeroSection({ profile }: HeroSectionProps) {
  const [activeStage, setActiveStage] = useState(0)
  const reduceMotion = useReducedMotion()
  const lane = profile.heroArtifactLanes[activeStage]
  const [firstName, ...lastName] = profile.name.split(' ')

  return (
    <section id="top" className="engineering-hero" aria-labelledby="hero-name">
      <div className="hero-edition">
        <span>Independent thinking. Connected systems.</span>
        <span>
          {profile.location} <span aria-hidden="true">↗</span>
        </span>
      </div>

      <div className="hero-masthead">
        <h1 id="hero-name" className="hero-name" aria-label={profile.name}>
          {[firstName, lastName.join(' ')].map((word, index) => (
            <span className="hero-name__mask" key={word} aria-hidden="true">
              <motion.span
                initial={reduceMotion ? false : { y: '105%', rotate: 3 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{
                  duration: 0.85,
                  delay: index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
                <span className="hero-name__period">.</span>
              </motion.span>
            </span>
          ))}
        </h1>
        <div className="hero-position">
          <span className="hero-position__index" aria-hidden="true">
            [ MZ / 01 ]
          </span>
          <p>
            <span>Backend developer.</span>
            <em>Systems thinker.</em>
          </p>
          <span className="hero-position__stack">Python / Applied AI</span>
          <a className="hero-position__work" href="#projects">
            Explore selected work <span aria-hidden="true">↘</span>
          </a>
        </div>
      </div>

      <div className="hero-workbench">
        <div className="hero-introduction">
          <p className="hero-introduction__label">
            The work behind the interface
          </p>
          <p className="hero-introduction__statement">
            I build the systems
            <br />
            that <em>hold it together.</em>
          </p>
          <p className="hero-introduction__copy">{profile.summary}</p>
          <div className="hero-links">
            {profile.heroLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={
                  link.variant === 'primary'
                    ? 'hero-link hero-link--primary'
                    : 'hero-link'
                }
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
              >
                {link.label}
                <Icon name={link.icon ?? 'arrow-up-right'} />
              </a>
            ))}
          </div>
          <p className="hero-availability">
            <span aria-hidden="true" />
            {profile.availability}
          </p>
        </div>

        <div
          className="system-trace"
          aria-label="Explore the CaseFlow architecture"
        >
          <div className="system-trace__heading">
            <div>
              <span className="system-trace__eyebrow">
                Case study / 01
              </span>
              <h2>CaseFlow</h2>
            </div>
            <span className="system-trace__status">
              Private backend
              <br />
              Architecture study
            </span>
          </div>
          <div className="system-trace__guide">
            <span>Explore the system</span>
            <span>Select a layer ↓</span>
          </div>
          <div
            className="system-trace__stages"
            role="group"
            aria-label="System layers"
          >
            <motion.span
              className="system-trace__connection"
              aria-hidden="true"
              initial={false}
              animate={{
                scaleX: activeStage / (profile.heroArtifactLanes.length - 1),
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            {profile.heroArtifactLanes.map((stage, index) => (
              <button
                key={stage.label}
                type="button"
                aria-pressed={activeStage === index}
                aria-controls="system-layer-detail"
                onClick={() => setActiveStage(index)}
              >
                <span className="system-trace__node" aria-hidden="true">
                  0{index + 1}
                </span>
                <span>{stage.label}</span>
              </button>
            ))}
          </div>
          <div
            id="system-layer-detail"
            className="system-trace__detail"
            aria-live="polite"
            aria-atomic="true"
          >
            <motion.div
              key={lane.label}
              initial={reduceMotion ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28 }}
            >
              <span className="system-trace__detail-number" aria-hidden="true">
                0{activeStage + 1}
              </span>
              <div className="system-trace__detail-copy">
                <h3>{lane.label}</h3>
                <p>{lane.summary}</p>
                <ul>
                  {lane.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
          <div className="system-trace__foot">
            <span>Illustrative system map</span>
            <a href="#projects">
              Read the case study <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      <details className="hero-notes">
        <summary>
          <span>
            Build notes{' '}
            <span className="hero-notes__caption">/ Background & approach</span>
          </span>
          <span className="hero-notes__toggle" aria-hidden="true">
            +
          </span>
        </summary>
        <div className="hero-notes__body">
          <div>
            <p>{profile.intro}</p>
            <p>
              {profile.education} · {profile.location}
            </p>
            <ul>
              {profile.focusAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <dl>
            {profile.details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h3>{profile.heroArtifactTitle}</h3>
            <p>{profile.heroArtifactSummary}</p>
            <ul>
              {profile.heroRibbon.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>
      <a className="hero-next" href="#about">
        <span>Keep exploring</span>
        <span>Approach, selected work & more</span>
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  )
}
