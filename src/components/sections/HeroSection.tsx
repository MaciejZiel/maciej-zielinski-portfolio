import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState, type MouseEvent } from 'react'

import type { Profile } from '../../types/portfolio'
import { Icon } from '../ui/Icon'
import '../../styles/hero.css'

const glyphStart = { y: '132%', rotateX: -96, rotateY: -18, skewX: -18 }
const glyphEnd = { x: 0, y: '0%', rotateX: 0, rotateY: 0, skewX: 0 }
const glyphEase = [0.2, 0.82, 0.2, 1] as const

interface NameBurst {
  impulses: Array<NameImpulse>
  duration: number
}

interface NameImpulse {
  x: number
  y: number
  rotate: number
  scale: number
}

function burstAnimation(impulse?: NameImpulse) {
  return impulse ? {
    ...glyphEnd,
    x: [0, impulse.x * 0.82, impulse.x, 0],
    y: [0, impulse.y * 0.82, impulse.y, 0],
    rotateZ: [0, impulse.rotate, impulse.rotate * 0.92, 0],
    scale: [1, impulse.scale, impulse.scale * 0.98, 1],
  } : glyphEnd
}

const burstTransition = {
  duration: 0.94,
  times: [0, 0.2, 0.38, 1] as number[],
  ease: ['easeOut', 'linear', 'backInOut'] as ('easeOut' | 'linear' | 'backInOut')[],
}

interface HeroSectionProps {
  profile: Profile
}

export function HeroSection({ profile }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null)
  const nameRef = useRef<HTMLHeadingElement | null>(null)
  const burstTimer = useRef<number | null>(null)
  const burstActive = useRef(false)
  const [activeStage, setActiveStage] = useState(0)
  const [nameBurst, setNameBurst] = useState<NameBurst | null>(null)
  const reduceMotion = useReducedMotion()
  const [firstName, ...lastName] = profile.name.split(' ')
  const lane = profile.heroArtifactLanes[activeStage] ?? profile.heroArtifactLanes[0]
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const nameScrollY = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [0, -8, -92, -128])
  const nameScale = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [1, 0.99, 0.88, 0.82])
  const nameRotate = useTransform(scrollYProgress, [0, 0.45, 1], [0, -0.5, -2.1])

  useEffect(() => () => {
    if (burstTimer.current !== null) window.clearTimeout(burstTimer.current)
  }, [])

  const handleNameClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (burstActive.current || !nameRef.current) return

    const nameBounds = nameRef.current.getBoundingClientRect()
    const keyboardActivation = event.detail === 0
    const originX = keyboardActivation ? nameBounds.left + nameBounds.width / 2 : event.clientX
    const originY = keyboardActivation ? nameBounds.top + nameBounds.height / 2 : event.clientY
    const radius = Math.hypot(nameBounds.width * 0.52, nameBounds.height * 0.72)
    const glyphs = [...nameRef.current.querySelectorAll<HTMLElement>('.hero-name__glyph')]
    const reduced = Boolean(reduceMotion)
    const impulses = glyphs.map((glyph, index) => {
      const bounds = glyph.getBoundingClientRect()
      const deltaX = bounds.left + bounds.width / 2 - originX
      const deltaY = bounds.top + bounds.height / 2 - originY
      const distance = Math.hypot(deltaX, deltaY)
      const angle = distance < 1 ? index * 2.399 : Math.atan2(deltaY, deltaX)
      const strength = reduced ? 9 : 80 + 140 * Math.max(0, 1 - distance / radius)
      const variationX = reduced ? 0 : Math.sin(index * 1.83) * 9
      const variationY = reduced ? 0 : Math.cos(index * 1.31) * 12

      return {
        x: Math.cos(angle) * strength + variationX,
        y: Math.sin(angle) * strength + variationY,
        rotate: reduced ? (index % 2 ? 1.5 : -1.5) : (index % 2 ? 1 : -1) * (5 + (index % 4) * 2.5),
        scale: reduced ? 1 : 0.92 + (index % 4) * 0.055,
      }
    })
    const duration = reduced ? 0.22 : 0.94

    burstActive.current = true
    setNameBurst({ impulses, duration })
    burstTimer.current = window.setTimeout(() => {
      burstActive.current = false
      burstTimer.current = null
      setNameBurst(null)
    }, duration * 1000 + 80)
  }

  let nextGlyphIndex = 0

  return (
    <section
      ref={heroRef}
      id="top"
      className="engineering-hero"
      aria-labelledby="hero-name"
    >
      <motion.div className="hero-masthead" data-name-bursting={nameBurst ? 'true' : undefined} style={reduceMotion ? undefined : { y: nameScrollY, scale: nameScale, rotate: nameRotate }}>
        <h1 ref={nameRef} id="hero-name" className="hero-name" aria-label={profile.name}>
          <button className="hero-name__button" type="button" aria-label={`Burst the lettering of ${profile.name}`} onClick={handleNameClick}>
          {[firstName, lastName.join(' ')].map((word, index) => (
            <motion.span
              className="hero-name__mask"
              key={word}
              aria-hidden="true"
            >
              <span className="hero-name__line">
                {[...word].map((character, characterIndex) => {
                  const impulse = nameBurst?.impulses[nextGlyphIndex++]
                  return (
                    <motion.span
                      className="hero-name__glyph"
                      key={`${character}-${characterIndex}`}
                      initial={reduceMotion ? false : { ...glyphStart, x: characterIndex % 2 ? 18 : -18 }}
                      animate={burstAnimation(impulse)}
                      transition={impulse ? { ...burstTransition, duration: nameBurst?.duration ?? burstTransition.duration } : {
                        duration: reduceMotion ? 0 : 0.86,
                        delay: reduceMotion ? 0 : 0.1 + index * 0.18 + characterIndex * 0.062,
                        ease: glyphEase,
                      }}
                    >
                      {character}
                    </motion.span>
                  )
                })}
                {index === 1 ? (
                  <motion.span
                    className="hero-name__glyph hero-name__period"
                    initial={reduceMotion ? false : glyphStart}
                    animate={burstAnimation(nameBurst?.impulses[nextGlyphIndex++])}
                    transition={nameBurst ? { ...burstTransition, duration: nameBurst.duration } : {
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
          </button>
        </h1>
        <div className="hero-position">
          <p><span>Backend developer.</span><em>Systems thinker.</em></p>
          <span className="hero-position__stack">Python / Applied AI</span>
        </div>
      </motion.div>

      <div className="hero-workbench">
        <div className="hero-introduction">
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
              <h2>CaseFlow</h2>
            </div>
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

      <a className="hero-next" href="#about">
        <span>Keep exploring</span><span aria-hidden="true">↓</span>
      </a>
    </section>
  )
}
