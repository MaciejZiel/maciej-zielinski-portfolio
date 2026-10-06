import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState, type MouseEvent } from 'react'

import type { Profile } from '../../types/portfolio'
import { ProjectOverview } from './ProjectOverview'
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
  const [nameBurst, setNameBurst] = useState<NameBurst | null>(null)
  const [nameRevealComplete, setNameRevealComplete] = useState(false)
  const reduceMotion = useReducedMotion()
  const [firstName, ...lastName] = profile.name.split(' ')
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const nameScrollY = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [0, -8, -92, -128])
  const nameScale = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [1, 0.99, 0.88, 0.82])
  const nameRotate = useTransform(scrollYProgress, [0, 0.45, 1], [0, -0.5, -2.1])

  useEffect(() => {
    if (reduceMotion) setNameRevealComplete(true)
  }, [reduceMotion])

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
    window.dispatchEvent(new CustomEvent('hero-name-burst', { detail: { active: true } }))
    setNameBurst({ impulses, duration })
    burstTimer.current = window.setTimeout(() => {
      burstActive.current = false
      burstTimer.current = null
      setNameBurst(null)
      window.dispatchEvent(new CustomEvent('hero-name-burst', { detail: { active: false } }))
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
      <motion.div className="hero-masthead" data-name-bursting={nameBurst ? 'true' : undefined} data-name-revealed={nameRevealComplete ? 'true' : undefined} style={reduceMotion ? undefined : { y: nameScrollY, scale: nameScale, rotate: nameRotate }}>
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
                    <span className="hero-name__proximity" key={`${character}-${characterIndex}`}>
                      <motion.span
                        className="hero-name__glyph"
                        initial={reduceMotion ? false : { ...glyphStart, x: characterIndex % 2 ? 18 : -18 }}
                        animate={burstAnimation(impulse)}
                        onAnimationComplete={index === 1 && characterIndex === word.length - 1 ? () => setNameRevealComplete(true) : undefined}
                        transition={impulse ? { ...burstTransition, duration: nameBurst?.duration ?? burstTransition.duration } : {
                          duration: reduceMotion ? 0 : 0.86,
                          delay: reduceMotion ? 0 : 0.1 + index * 0.18 + characterIndex * 0.062,
                          ease: glyphEase,
                        }}
                      >
                        {character}
                      </motion.span>
                    </span>
                  )
                })}
                {index === 1 ? (
                  <span className="hero-name__proximity" key="period">
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
                  </span>
                ) : null}
              </span>
            </motion.span>
          ))}
          </button>
        </h1>
        <div className="hero-position">
          <p><span>Software engineer.</span></p>
          <span className="hero-position__stack">Python / Applied AI</span>
        </div>
      </motion.div>

      <ProjectOverview />
    </section>
  )
}
