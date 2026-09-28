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

type CursorMode = 'default' | 'project' | 'link' | 'explore' | 'architecture' | 'contact'
const probePaths: Record<CursorMode, string> = {
  default: 'M3 3L23 23M3 3V11M3 3H11',
  project: 'M3 9V3H9 M18 3H24V9 M24 18V24H18 M9 24H3V18 M11 14H23M19 10L23 14L19 18',
  link: 'M5 23L23 5M12 5H23V16',
  explore: 'M4 3V18M4 18H22M16 12L22 18L16 24',
  architecture: 'M3 14H11M11 14V5H24M11 14V23H24M20 2L24 5L20 8M20 20L24 23L20 26',
  contact: 'M3 5H24V20H3ZM3 5L13.5 13L24 5M18 24H29M25 20L29 24L25 28',
}

export function ExperienceLayer({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const reduceMotion = useReducedMotion()
  const pageVisible = usePageVisible()
  const pointerX = useMotionValue(-100)
  const pointerY = useMotionValue(-100)
  const springX = useSpring(pointerX, { stiffness: 420, damping: 34, mass: 0.35 })
  const springY = useSpring(pointerY, { stiffness: 420, damping: 34, mass: 0.35 })
  const [visible, setVisible] = useState(false)
  const [cursor, setCursor] = useState<{ mode: CursorMode; label: string; edge: boolean }>({ mode: 'default', label: '', edge: false })
  const [chapter, setChapter] = useState('top')
  const pointerTarget = useRef({ x: -1000, y: -1000, active: false })
  const previousLabel = useRef('')
  const previousMagnet = useRef<HTMLElement | null>(null)
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
      addTargets('.hero-name__glyph', 255, 13)
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
      if (!cursorVisible) { cursorVisible = true; setVisible(true) }

      const target = event.target instanceof Element ? event.target : null
      const context = target?.closest<HTMLElement>('[data-cursor], a, button, summary') ?? null
      const mode = (context?.dataset.cursor ?? (context?.matches('a') ? 'link' : context?.matches('button') ? 'architecture' : context?.matches('summary') ? 'explore' : 'default')) as CursorMode
      const candidateLabel = context?.dataset.cursorLabel ?? (context?.matches('summary') ? 'OPEN NOTES' : '')
      const label = mode === 'contact' || mode === 'project' || context?.matches('summary') ? candidateLabel : ''
      const edge = event.clientX > window.innerWidth - 250
      const identity = `${mode}:${label}:${edge}`
      if (identity !== previousLabel.current) {
        previousLabel.current = identity
        setCursor({ mode, label, edge })
      }

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
      clearProximity()
      setMagnet(previousMagnet.current)
      previousMagnet.current = null
      magnetBounds = null
    }
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Tab') hideCursor() }

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget) return
      hideCursor()
      if (previousLabel.current) {
        previousLabel.current = ''
        setCursor({ mode: 'default', label: '', edge: false })
      }
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
      setChapter((currentChapter) => currentChapter === nextChapter ? currentChapter : nextChapter)
    }, { rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.1, 0.35, 0.65] })

    chapters.forEach((chapterElement) => observer.observe(chapterElement))
    return () => observer.disconnect()
  }, [])

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

      <motion.div
        className="site-cursor"
        data-visible={visible}
        data-mode={cursor.mode}
        data-edge={cursor.edge}
        data-active={Boolean(cursor.label)}
        data-reduced={reduceMotion}
        style={{ ...cursorPosition, ...({ '--cursor-accent': chapterAccent } as CSSProperties) }}
        aria-hidden="true"
      >
        <svg className="site-cursor__probe" viewBox="0 0 32 32">
          <motion.path d={probePaths[cursor.mode] ?? probePaths.default}
            initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} key={cursor.mode}
            transition={{ duration: reduceMotion ? 0 : 0.26 }} />
        </svg>
        <span className="site-cursor__label" key={cursor.label}>{cursor.label}</span>
      </motion.div>
    </>
  )
}
