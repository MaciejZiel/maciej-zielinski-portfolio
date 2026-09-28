import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

import type { Profile } from '../../types/portfolio'
import { Icon } from '../ui/Icon'
import '../../styles/hero.css'

const glyphStart = { y: '132%', rotateX: -96, rotateY: -18, skewX: -18 }
const glyphEnd = { x: 0, y: '0%', rotateX: 0, rotateY: 0, skewX: 0 }
const glyphEase = [0.2, 0.82, 0.2, 1] as const

interface HeroSectionProps {
  profile: Profile
}

export function HeroSection({ profile }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null)
  const [activeStage, setActiveStage] = useState(0)
  const reduceMotion = useReducedMotion()
  const [firstName, ...lastName] = profile.name.split(' ')
  const lane = profile.heroArtifactLanes[activeStage] ?? profile.heroArtifactLanes[0]
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const nameScrollY = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [0, -8, -92, -128])
  const nameScale = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [1, 0.99, 0.88, 0.82])
  const nameRotate = useTransform(scrollYProgress, [0, 0.45, 1], [0, -0.5, -2.1])

  return (
    <section
      ref={heroRef}
      id="top"
      className="engineering-hero"
      aria-labelledby="hero-name"
    >
      <svg className="hero-flow" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
        <motion.g data-pointer-proximity="route">
          <path className="hero-flow__track" d="M16 380 C210 380 88 70 342 128 C560 178 472 420 720 354 C856 318 830 620 982 702 C1004 802 884 874 914 1030" />
          <motion.path
            className="hero-flow__signal"
            d="M16 380 C210 380 88 70 342 128 C560 178 472 420 720 354 C856 318 830 620 982 702 C1004 802 884 874 914 1030"
            style={reduceMotion ? { pathLength: 1 } : { pathLength: scrollYProgress }}
          />
        </motion.g>
      </svg>
      <div className="hero-edition">
        <span>Backend systems / applied AI</span>
        <span>{profile.location}</span>
      </div>

      <motion.div className="hero-masthead" style={reduceMotion ? undefined : { y: nameScrollY, scale: nameScale, rotate: nameRotate }}>
        <h1 id="hero-name" className="hero-name" aria-label={profile.name}>
          {[firstName, lastName.join(' ')].map((word, index) => (
            <motion.span
              className="hero-name__mask"
              key={word}
              aria-hidden="true"
            >
              <span className="hero-name__line">
                {[...word].map((character, characterIndex) => (
                  <motion.span
                    className="hero-name__glyph"
                    key={`${character}-${characterIndex}`}
                    initial={reduceMotion ? false : { ...glyphStart, x: characterIndex % 2 ? 18 : -18 }}
                    animate={glyphEnd}
                    transition={{
                      duration: reduceMotion ? 0 : 0.86,
                      delay: reduceMotion ? 0 : 0.1 + index * 0.18 + characterIndex * 0.062,
                      ease: glyphEase,
                    }}
                    whileHover={reduceMotion ? undefined : { y: -5, rotateZ: characterIndex % 2 ? 2 : -2, transition: { duration: 0.18 } }}
                  >
                    {character}
                  </motion.span>
                ))}
                {index === 1 ? (
                  <motion.span
                    className="hero-name__glyph hero-name__period"
                    initial={reduceMotion ? false : glyphStart}
                    animate={glyphEnd}
                    transition={{
                      duration: reduceMotion ? 0 : 0.86,
                      delay: reduceMotion ? 0 : 0.1 + index * 0.18 + word.length * 0.055,
                      ease: glyphEase,
                    }}
                  >
                    .
                  </motion.span>
                ) : null}
              </span>
            </motion.span>
          ))}
        </h1>
        <div className="hero-position">
          <span className="hero-position__index">[ MZ / 01 ]</span>
          <p><span>Backend developer.</span><em>Systems thinker.</em></p>
          <span className="hero-position__stack">Python / Applied AI</span>
        </div>
      </motion.div>

      <div className="hero-workbench">
        <div className="hero-introduction">
          <p className="hero-introduction__label">The work behind the interface</p>
          <p className="hero-introduction__statement">I build the systems<br />that <em>hold it together.</em></p>
          <p className="hero-introduction__copy">{profile.summary}</p>
          <div className="hero-links">
            {profile.heroLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={link.variant === 'primary' ? 'hero-link hero-link--primary' : 'hero-link'}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                data-magnetic
                data-cursor={link.variant === 'primary' ? 'explore' : 'link'}
                data-cursor-label={link.label.toUpperCase()}
              >
                {link.label}<Icon name={link.icon ?? 'arrow-up-right'} />
              </a>
            ))}
          </div>
          <p className="hero-availability"><span aria-hidden="true" />{profile.availability}</p>
        </div>

        <div className="system-trace" aria-label="Explore the CaseFlow architecture">
          <div className="system-trace__heading">
            <div>
              <span className="system-trace__eyebrow">Case study / 01</span>
              <h2>CaseFlow</h2>
            </div>
            <span className="system-trace__status">Private backend<br />Architecture study</span>
          </div>
          <div className="system-trace__guide"><span>Follow a request</span><span>Select a layer ↓</span></div>
          <div className="system-trace__stages" role="group" aria-label="CaseFlow system layers">
            <motion.span
              className="system-trace__connection"
              aria-hidden="true"
              initial={false}
              animate={{ scaleX: activeStage / Math.max(profile.heroArtifactLanes.length - 1, 1) }}
              transition={{ duration: reduceMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
            />
            {profile.heroArtifactLanes.map((stage, index) => (
              <button
                key={stage.label}
                type="button"
                aria-pressed={activeStage === index}
                aria-controls="system-layer-detail"
                data-magnetic
                data-cursor-label={stage.label.toUpperCase()}
                onClick={() => setActiveStage(index)}
              >
                <span className="system-trace__node" aria-hidden="true">0{index + 1}</span>
                <span>{stage.label}</span>
              </button>
            ))}
          </div>
          <div id="system-layer-detail" className="system-trace__detail" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={lane.label}
                initial={reduceMotion ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.24 }}
              >
                <span className="system-trace__detail-number" aria-hidden="true">0{activeStage + 1}</span>
                <div className="system-trace__detail-copy">
                  <h3>{lane.label}</h3>
                  <p>{lane.summary}</p>
                  <ul>{lane.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="system-trace__foot">
            <span>CaseFlow / system map</span>
            <a href="#projects">Read the case study <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>

      <details className="hero-notes">
        <summary>
          <span>Build notes <span className="hero-notes__caption">/ Background &amp; approach</span></span>
          <span className="hero-notes__toggle" aria-hidden="true">+</span>
        </summary>
        <div className="hero-notes__body">
          <div>
            <p>{profile.intro}</p>
            <p>{profile.education} · {profile.location}</p>
            <ul>{profile.focusAreas.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <dl>
            {profile.details.map((detail) => (
              <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>
            ))}
          </dl>
          <div>
            <h3>{profile.heroArtifactTitle}</h3>
            <p>{profile.heroArtifactSummary}</p>
            <ul>{profile.heroRibbon.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </details>

      <a className="hero-next" href="#about" data-cursor="explore" data-cursor-label="FOLLOW THE ROUTE">
        <span>Keep exploring</span><span>Approach, selected work & more</span><span aria-hidden="true">↓</span>
      </a>
    </section>
  )
}
