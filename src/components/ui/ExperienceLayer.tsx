import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { usePageVisible } from '../../hooks/usePageVisible'
import { SpatialField } from './SpatialField'

interface ProximityTarget {
  element: HTMLElement
  left: number
  top: number
  width: number
  height: number
  radius: number
  strength: number
  x: number
  y: number
}

const chapterAccents: Record<string, string> = {
  top: '#c8f958',
  about: '#c8f958',
  steel: '#7be4b8',
  signal: '#ffb86c',
  vision: '#82b1ff',
  track: '#d4a5e0',
  skills: '#c8f958',
  contact: '#c8f958',
}

const projectChapters = new Set(['steel', 'signal', 'vision', 'track'])
const chapterTransitionPaths: Record<string, string[]> = {
  steel: [
    'M-40 350H175C250 350 252 210 326 210H610C685 210 682 490 758 490H1040',
    'M-40 380H160C232 380 236 240 310 240H594C668 240 666 520 742 520H1040',
  ],
  signal: [
    'M-20 350H48C102 350 100 174 164 174S226 526 292 526 360 174 426 174 494 526 560 526 628 174 694 174 760 526 826 526 892 350 952 350H1020',
  ],
  vision: [
    'M-20 165L1020 70M-20 350H1020M-20 535L1020 630',
    'M120 -20L286 720M320 -20L414 720M520 -20V720M720 -20L626 720M920 -20L754 720',
    'M175 250H825V450H175Z',
  ],
  track: [
    'M110 220L330 350L550 220L770 350L940 220',
    'M110 480L330 350L550 480L770 350L940 480',
    'M330 350H550',
  ],
}

const chapterTransitionNodes = [
  { x: 110, y: 220 }, { x: 330, y: 350 }, { x: 550, y: 220 },
  { x: 770, y: 350 }, { x: 940, y: 220 }, { x: 110, y: 480 },
  { x: 550, y: 480 }, { x: 940, y: 480 },
]

export function ExperienceLayer({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const reduceMotion = useReducedMotion()
  const pageVisible = usePageVisible()
  const pointerX = useMotionValue(-100)
  const pointerY = useMotionValue(-100)
  const springX = useSpring(pointerX, { stiffness: 820, damping: 48, mass: 0.2 })
  const springY = useSpring(pointerY, { stiffness: 820, damping: 48, mass: 0.2 })
  const [visible, setVisible] = useState(false)
  const [chapter, setChapter] = useState('top')
  const [projectTransition, setProjectTransition] = useState<{ chapter: string; id: number } | null>(null)
  const pointerTarget = useRef({ x: -1000, y: -1000, active: false })
  const previousMagnet = useRef<HTMLElement | null>(null)
  const activeChapter = useRef('top')
  const transitionSequence = useRef(0)
  const chapterAccent = chapterAccents[chapter] ?? chapterAccents.top

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    let frame = 0
    let pending: PointerEvent | null = null
    let cursorVisible = false
    let magnetBounds: DOMRect | null = null
    let proximityTargets: ProximityTarget[] = []
    let proximityBoundsInvalid = true
    const clearProximity = () => {
      proximityTargets.forEach((target) => {
        if (target.x === 0 && target.y === 0) return
        target.x = 0
        target.y = 0
        target.element.style.translate = '0px 0px'
      })
    }
    const refreshProximityBounds = () => {
      const targets: ProximityTarget[] = []
      const addTargets = (selector: string, radius: number, strength: number) => {
        document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
          const bounds = element.getBoundingClientRect()
          const [translateX = '0', translateY = '0'] = element.style.translate.split(/\s+/)
          targets.push({
            element,
            left: bounds.left - (Number.parseFloat(translateX) || 0),
            top: bounds.top - (Number.parseFloat(translateY) || 0),
            width: bounds.width,
            height: bounds.height,
            radius,
            strength,
            x: Number.parseFloat(translateX) || 0,
            y: Number.parseFloat(translateY) || 0,
          })
        })
      }
      addTargets('.hero-masthead', 460, 10)
      addTargets('.hero-name__glyph', 360, 21)
      addTargets('.hero-position', 440, 7)
      addTargets('.hero-introduction', 520, 5)
      addTargets('.project-diagram__visual', 330, 7)
      addTargets('.contact-heading', 390, 9)
      proximityTargets = targets
      proximityBoundsInvalid = false
    }
    const applyProximity = (x: number, y: number) => {
      if (reduceMotion) return
      if (proximityBoundsInvalid) refreshProximityBounds()
      proximityTargets.forEach((target) => {
        const offsetX = target.left + target.width / 2 - x
        const offsetY = target.top + target.height / 2 - y
        const distance = Math.hypot(offsetX, offsetY)
        const falloff = Math.pow(Math.max(0, 1 - distance / target.radius), 2)
        const inverseDistance = 1 / Math.max(distance, 1)
        const shiftX = falloff < 0.008 ? 0 : offsetX * inverseDistance * target.strength * falloff
        const shiftY = falloff < 0.008 ? 0 : offsetY * inverseDistance * target.strength * falloff
        if (Math.abs(shiftX - target.x) < 0.12 && Math.abs(shiftY - target.y) < 0.12) return
        target.x = shiftX
        target.y = shiftY
        target.element.style.translate = `${shiftX.toFixed(2)}px ${shiftY.toFixed(2)}px`
      })
    }
    const setMagnet = (element: HTMLElement | null, x = 0, y = 0) => {
      element?.style.setProperty('--magnetic-x', `${x}px`)
      element?.style.setProperty('--magnetic-y', `${y}px`)
    }

    const flushMove = () => {
      frame = 0
      const event = pending
      if (!event) return
      pointerX.set(Math.min(event.clientX, window.innerWidth - 44))
      pointerY.set(Math.min(event.clientY, window.innerHeight - 44))
      pointerTarget.current.x = event.clientX
      pointerTarget.current.y = event.clientY
      pointerTarget.current.active = true
      applyProximity(event.clientX, event.clientY)
      document.documentElement.dataset.pointerInput = 'mouse'
      if (!cursorVisible) { cursorVisible = true; setVisible(true) }

      const target = event.target instanceof Element ? event.target : null
      const magnet = reduceMotion ? null : target?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (magnet) {
        // Read once per target/layout change, before any style writes.
        if (previousMagnet.current !== magnet || !magnetBounds) magnetBounds = magnet.getBoundingClientRect()
        const bounds = magnetBounds
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12
        if (previousMagnet.current !== magnet) setMagnet(previousMagnet.current)
        previousMagnet.current = magnet
        setMagnet(magnet, x, y)
      } else if (previousMagnet.current) {
        setMagnet(previousMagnet.current)
        previousMagnet.current = null
        magnetBounds = null
      }
    }

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || coarsePointer.matches || window.innerWidth <= 760) return
      pending = event
      if (!frame) frame = requestAnimationFrame(flushMove)
    }

    const invalidateBounds = () => {
      magnetBounds = null
      proximityBoundsInvalid = true
    }
    const hideCursor = () => {
      cancelAnimationFrame(frame)
      frame = 0
      pending = null
      cursorVisible = false
      pointerTarget.current.active = false
      setVisible(false)
      delete document.documentElement.dataset.pointerInput
      clearProximity()
      setMagnet(previousMagnet.current)
      previousMagnet.current = null
      magnetBounds = null
    }
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Tab') hideCursor() }

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget) return
      hideCursor()
    }

    document.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('pointerout', handlePointerOut)
    document.addEventListener('keydown', handleKey)
    window.addEventListener('scroll', invalidateBounds, { passive: true })
    window.addEventListener('resize', invalidateBounds)
    window.addEventListener('blur', hideCursor)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerout', handlePointerOut)
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('scroll', invalidateBounds)
      window.removeEventListener('resize', invalidateBounds)
      window.removeEventListener('blur', hideCursor)
      delete document.documentElement.dataset.pointerInput
      setMagnet(previousMagnet.current)
      clearProximity()
    }
  }, [pointerX, pointerY, reduceMotion])

  useEffect(() => {
    const chapters = document.querySelectorAll<HTMLElement>(
      '.main-content > section[id], .project-showcase',
    )
    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (!current) return
      const target = current.target as HTMLElement
      const project = target.className.match(/project-showcase--(steel|signal|vision|track)/)
      const nextChapter = project?.[1] ?? target.id ?? 'top'
      if (activeChapter.current === nextChapter) return
      const touchSizedViewport = window.innerWidth <= 760 || window.matchMedia('(pointer: coarse)').matches
      if (projectChapters.has(activeChapter.current) && projectChapters.has(nextChapter) && !reduceMotion && !touchSizedViewport) {
        setProjectTransition({ chapter: nextChapter, id: ++transitionSequence.current })
      }
      activeChapter.current = nextChapter
      setChapter(nextChapter)
    }, { rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.1, 0.35, 0.65] })

    chapters.forEach((chapterElement) => observer.observe(chapterElement))
    return () => observer.disconnect()
  }, [reduceMotion])

  const cursorPosition = reduceMotion ? { x: pointerX, y: pointerY } : { x: springX, y: springY }

  return (
    <>
      <div
        className="experience-atmosphere"
        data-chapter={chapter}
        data-reduced={reduceMotion}
        data-page-visible={pageVisible}
        style={{ '--experience-accent': chapterAccent } as CSSProperties}
        aria-hidden="true"
      >
        <SpatialField
          chapter={chapter}
          pointerTarget={pointerTarget}
          reduceMotion={Boolean(reduceMotion)}
          pageVisible={pageVisible}
          scrollYProgress={scrollYProgress}
        />
      </div>

      {projectTransition ? (
        <motion.div
          key={projectTransition.id}
          className="chapter-transition"
          data-chapter={projectTransition.chapter}
          style={{ '--transition-accent': chapterAccents[projectTransition.chapter] } as CSSProperties}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.96, 0.84, 0] }}
          transition={{ duration: 0.72, times: [0, 0.16, 0.62, 1], ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => setProjectTransition((current) => current?.id === projectTransition.id ? null : current)}
          aria-hidden="true"
        >
          <svg className="chapter-transition__drawing" viewBox="0 0 1000 700" preserveAspectRatio="none">
            {(chapterTransitionPaths[projectTransition.chapter] ?? []).map((path, index) => (
              <motion.path
                key={`${projectTransition.chapter}-${index}`}
                d={path}
                className={index === 0 ? 'chapter-transition__path chapter-transition__path--lead' : 'chapter-transition__path'}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: index === 0 ? 0.92 : 0.42 }}
                transition={{ duration: 0.56, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
            {projectTransition.chapter === 'track' ? chapterTransitionNodes.map((node, index) => (
              <motion.circle
                key={`track-${index}`}
                className="chapter-transition__node"
                cx={node.x}
                cy={node.y}
                r={index === 1 || index === 3 ? 6 : 4}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.7 }}
                transition={{ duration: 0.24, delay: 0.18 + index * 0.018 }}
              />
            )) : null}
          </svg>
        </motion.div>
      ) : null}

      <motion.div
        className="site-cursor"
        data-visible={visible}
        data-reduced={reduceMotion}
        style={cursorPosition}
        aria-hidden="true"
      >
        <svg className="site-cursor__probe" viewBox="0 0 24 24">
          <path d="M2 2L21 12L13 14L10 22L2 2Z" />
        </svg>
      </motion.div>
    </>
  )
}
