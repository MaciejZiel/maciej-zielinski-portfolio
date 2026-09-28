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

type CursorMode = 'default' | 'project' | 'link' | 'explore' | 'architecture' | 'contact' | 'signature'
const probePaths: Record<CursorMode, string> = {
  default: 'M3 18V5H16 M3 11H10',
  project: 'M3 9V3H9 M19 3H25V9 M25 19V25H19 M9 25H3V19 M10 14H18M15 11L18 14L15 17',
  link: 'M5 23L23 5M12 5H23V16',
  explore: 'M5 3V16Q5 23 12 23H24M18 17L24 23L18 29',
  architecture: 'M3 14H12M12 14V5H25M12 14V23H25M22 2L25 5L22 8M22 20L25 23L22 26',
  contact: 'M3 6H25V23H3ZM3 6L14 16L25 6M19 23H29M25 19L29 23L25 27',
  signature: 'M3 23V5L10 15L17 5V23M21 5H29L21 23H29',
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
      proximityTargets.forEach(({ element }) => { element.style.translate = '0px 0px' })
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
          })
        })
      }
      addTargets('.hero-name__glyph', 255, 13)
      addTargets('[data-pointer-proximity="route"]', 420, 10)
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
        const shiftX = offsetX * inverseDistance * target.strength * falloff
        const shiftY = offsetY * inverseDistance * target.strength * falloff
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
      const label = context?.dataset.cursorLabel ?? (context?.matches('summary') ? 'OPEN NOTES' : '')
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
