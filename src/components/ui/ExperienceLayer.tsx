import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

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

export function ExperienceLayer() {
  const { scrollYProgress } = useScroll()
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(-100)
  const pointerY = useMotionValue(-100)
  const springX = useSpring(pointerX, { stiffness: 420, damping: 34, mass: 0.35 })
  const springY = useSpring(pointerY, { stiffness: 420, damping: 34, mass: 0.35 })
  const [visible, setVisible] = useState(false)
  const [cursorLabel, setCursorLabel] = useState('')
  const [chapter, setChapter] = useState('top')
  const previousLabel = useRef('')
  const previousMagnet = useRef<HTMLElement | null>(null)
  const chapterAccent = chapterAccents[chapter] ?? chapterAccents.top

  useEffect(() => {
    const setMagnet = (element: HTMLElement | null, x = 0, y = 0) => {
      element?.style.setProperty('--magnetic-x', `${x}px`)
      element?.style.setProperty('--magnetic-y', `${y}px`)
    }

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)
      setVisible(true)

      const target = event.target instanceof Element ? event.target : null
      const labeled = target?.closest<HTMLElement>('[data-cursor-label]') ?? null
      const label = labeled?.dataset.cursorLabel ?? ''
      if (label !== previousLabel.current) {
        previousLabel.current = label
        setCursorLabel(label)
      }

      const magnet = reduceMotion ? null : target?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (magnet) {
        const bounds = magnet.getBoundingClientRect()
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12
        if (previousMagnet.current !== magnet) setMagnet(previousMagnet.current)
        previousMagnet.current = magnet
        setMagnet(magnet, x, y)
      } else if (previousMagnet.current) {
        setMagnet(previousMagnet.current)
        previousMagnet.current = null
      }
    }

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget) return
      setVisible(false)
      setMagnet(previousMagnet.current)
      previousMagnet.current = null
      if (previousLabel.current) {
        previousLabel.current = ''
        setCursorLabel('')
      }
    }

    document.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('pointerout', handlePointerOut)
    return () => {
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerout', handlePointerOut)
      setMagnet(previousMagnet.current)
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
        style={{ '--experience-accent': chapterAccent } as CSSProperties}
        aria-hidden="true"
      >
        <div className="experience-atmosphere__haze" />
        <div className="experience-atmosphere__orbit experience-atmosphere__orbit--one" />
        <div className="experience-atmosphere__orbit experience-atmosphere__orbit--two" />
        <svg className="experience-route" viewBox="0 0 88 1000" preserveAspectRatio="none">
          <path className="experience-route__track" d="M46 -20 C4 94 80 154 39 270 S75 450 36 570 S74 730 38 838 S20 946 46 1020" />
          <motion.path
            className="experience-route__signal"
            d="M46 -20 C4 94 80 154 39 270 S75 450 36 570 S74 730 38 838 S20 946 46 1020"
            style={{ pathLength: reduceMotion ? 1 : scrollYProgress }}
          />
          <motion.path
            className="experience-route__runner"
            d="M46 -20 C4 94 80 154 39 270 S75 450 36 570 S74 730 38 838 S20 946 46 1020"
            pathLength="1"
            strokeDasharray="0.008 0.992"
            animate={reduceMotion ? undefined : { strokeDashoffset: [0, -1] }}
            transition={reduceMotion ? undefined : { duration: 14, ease: 'linear', repeat: Infinity }}
          />
        </svg>
      </div>

      <motion.div
        className="site-cursor"
        data-visible={visible}
        data-active={Boolean(cursorLabel)}
        style={cursorPosition}
        aria-hidden="true"
      >
        <span className="site-cursor__ring" />
        <span className="site-cursor__label">{cursorLabel}</span>
      </motion.div>
    </>
  )
}
