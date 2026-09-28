import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import type { FeaturedProject } from '../../types/portfolio'

interface ProjectDiagramProps {
  project: FeaturedProject
  activeLane: number
  isVisible?: boolean
}

function FlowNodes({ project, activeLane, reduceMotion, isVisible }: ProjectDiagramProps & { reduceMotion: boolean }) {
  const labels = project.artifactLanes.map((lane) => lane.label)
  const nodeX = [96, 320, 544]
  const progress = [0.09, 0.5, 1][activeLane] ?? 0.09

  return (
    <svg viewBox="0 0 640 280" role="img" aria-label={`${project.name} system flow diagram`}>
      <path className="diagram-grid" d="M0 40H640M0 240H640M40 0V280M120 0V280M200 0V280M280 0V280M360 0V280M440 0V280M520 0V280M600 0V280" />
      <path className="caseflow-route-track" d="M48 140H592" />
      <motion.path
        className="caseflow-route-signal"
        d="M48 140H592"
        initial={false}
        animate={{ pathLength: progress }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      {nodeX.map((x, index) => (
        <g key={x} className={index === activeLane ? 'caseflow-route-node caseflow-route-node--active' : 'caseflow-route-node'}>
          <circle cx={x} cy="140" r={index === activeLane ? 11 : 7} />
          <text x={x} y="92" textAnchor="middle">0{index + 1} / {labels[index] ?? 'Stage'}</text>
        </g>
      ))}
      <motion.circle
        className="caseflow-route-token"
        cx={nodeX[0]}
        cy="140"
        r="4"
        initial={false}
        animate={{ cx: nodeX[activeLane] ?? nodeX[0] }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      />
      {!reduceMotion && isVisible ? (
        <motion.circle
          className="caseflow-route-packet"
          cy="140"
          r="3"
          initial={{ cx: 48 }}
          animate={{ cx: [48, 592] }}
          transition={{ duration: 3.4, ease: 'linear', repeat: Infinity, repeatDelay: 0.65 }}
        />
      ) : null}
      <text x="42" y="248">REQUEST / POLICY → STATE → DELIVERY</text>
    </svg>
  )
}

function Waveform({ project, activeLane, reduceMotion, isVisible }: ProjectDiagramProps & { reduceMotion: boolean }) {
  const bars = Array.from({ length: 72 }, (_, index) => {
    const envelope = 0.2 + 0.8 * Math.sin((index / 71) * Math.PI) ** 0.7
    const wave = 0.28 + Math.abs(Math.sin(index * 1.93) * Math.cos(index * 0.37))
    return 18 + envelope * wave * 108
  })

  return (
    <svg viewBox="0 0 720 220" role="img" aria-label={`${project.name} audio processing visualization`}>
      <path className="diagram-grid" d="M0 45H720M0 110H720M0 175H720M36 0V220M108 0V220M180 0V220M252 0V220M324 0V220M396 0V220M468 0V220M540 0V220M612 0V220M684 0V220" />
      <path className="diagram-wave-mid" d="M0 110H720" />
      <motion.g
        className="diagram-waveform"
        initial={false}
        animate={{ scaleX: activeLane === 2 ? 0.58 : 1 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '0px 110px' }}
      >
        {bars.map((height, index) => (
          <motion.rect
            key={index}
            x={index * 10 + 1}
            y={110 - height / 2}
            width="4"
            height={height}
            rx="2"
            className={Math.floor(index / 24) === activeLane ? 'diagram-wave-bar diagram-wave-bar--active' : 'diagram-wave-bar'}
            animate={reduceMotion || !isVisible ? undefined : { scaleY: [0.84, 1, 0.9] }}
            transition={reduceMotion || !isVisible ? undefined : { duration: 1.8 + (index % 5) * 0.15, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: (index % 12) * 0.04 }}
            style={{ transformOrigin: '50% 50%' }}
          />
        ))}
      </motion.g>
      <motion.path
        className="diagram-conversion-route"
        d="M412 110 C440 110 430 74 466 74"
        initial={false}
        animate={{ pathLength: activeLane === 2 ? 1 : activeLane === 1 ? 0.38 : 0 }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.g
        className="diagram-transcript"
        initial={false}
        animate={{ opacity: activeLane === 2 ? 1 : 0, x: activeLane === 2 ? 0 : 14 }}
        transition={{ duration: 0.42, delay: activeLane === 2 ? 0.2 : 0 }}
      >
        <text x="475" y="68">TRANSCRIPT / READY</text>
        <path d="M475 90H674M475 108H638M475 126H665M475 144H617M475 162H650" />
        <text x="475" y="190">SRT / EXPORT</text>
      </motion.g>
      <motion.path
        className="diagram-playhead"
        d="M0 18V202"
        initial={false}
        animate={reduceMotion || !isVisible ? { x: [0, 480, 700][activeLane] } : { x: [0, 700] }}
        transition={reduceMotion || !isVisible ? { duration: 0.25 } : { duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      <text x="0" y="216">INGEST</text><text x="332" y="216">RUNTIME</text><text x="652" y="216">EXPORT</text>
    </svg>
  )
}

function VisionFrame({ project, activeLane, reduceMotion, isVisible }: ProjectDiagramProps & { reduceMotion: boolean }) {
  const targets = [
    { x: 132, y: 72, width: 110, height: 102 },
    { x: 340, y: 54, width: 126, height: 142 },
    { x: 495, y: 108, width: 94, height: 92 },
  ]
  const target = targets[activeLane] ?? targets[0]

  return (
    <svg viewBox="0 0 720 270" role="img" aria-label={`${project.name} live frame and detection bounds`}>
      <path className="diagram-grid" d="M0 45H720M0 90H720M0 135H720M0 180H720M0 225H720M45 0V270M90 0V270M135 0V270M180 0V270M225 0V270M270 0V270M315 0V270M360 0V270M405 0V270M450 0V270M495 0V270M540 0V270M585 0V270M630 0V270M675 0V270" />
      <motion.path className="vision-scan" d="M0 0H720" animate={reduceMotion || !isVisible ? undefined : { y: [18, 250, 18] }} transition={reduceMotion || !isVisible ? undefined : { duration: 5, repeat: Infinity, ease: 'linear' }} />
      {targets.map((box, index) => (
        <g key={box.x} className={index === activeLane ? 'vision-target vision-target--active' : 'vision-target'}>
          <path d={`M${box.x} ${box.y + 16}V${box.y}H${box.x + 16}M${box.x + box.width - 16} ${box.y}H${box.x + box.width}V${box.y + 16}M${box.x} ${box.y + box.height - 16}V${box.y + box.height}H${box.x + 16}M${box.x + box.width - 16} ${box.y + box.height}H${box.x + box.width}V${box.y + box.height - 16}`} />
          {index === activeLane ? <motion.rect x={box.x} y={box.y} width={box.width} height={box.height} initial={false} animate={{ x: box.x, y: box.y }} /> : null}
          <text x={box.x} y={box.y - 8}>{index === activeLane ? `TRACK 0${index + 1} / LOCKED` : `FRAME 0${index + 1}`}</text>
        </g>
      ))}
      <path className="vision-loop-track" d="M70 230H650" />
      <motion.path
        className="vision-loop-signal"
        d="M70 230H650"
        initial={false}
        animate={{ pathLength: [0.33, 0.66, 1][activeLane] ?? 0.33 }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      />
      {[['CAPTURE', 110], ['INFERENCE', 360], ['CONTROL', 610]].map(([label, x], index) => (
        <g className={index === activeLane ? 'vision-loop-node vision-loop-node--active' : 'vision-loop-node'} key={label}>
          <circle cx={x} cy="230" r="4" />
          <text x={x} y="218" textAnchor="middle">{label}</text>
        </g>
      ))}
      <text x="20" y="265">FRAME BUFFER / CLOSED CONTROL LOOP</text>
      <motion.circle
        className="vision-reticle"
        cx={target.x + target.width / 2}
        cy={target.y + target.height / 2}
        r="3"
        initial={false}
        animate={reduceMotion || !isVisible ? { cx: target.x + target.width / 2, cy: target.y + target.height / 2 } : {
          cx: [187, 403, 542, 187],
          cy: [123, 125, 154, 123],
        }}
        transition={reduceMotion || !isVisible ? { duration: 0.2 } : { duration: 5.4, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  )
}

export function ProjectDiagram({ project, activeLane }: ProjectDiagramProps) {
  const reduceMotion = useReducedMotion()
  const diagramRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = diagramRef.current
    if (!element || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin: '120px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={diagramRef} className={`project-diagram project-diagram--${project.theme}`} aria-hidden="true">
      {project.theme === 'steel' ? <FlowNodes project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      {project.theme === 'signal' ? <Waveform project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      {project.theme === 'vision' ? <VisionFrame project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      <span className="project-diagram__index">FIG. 0{activeLane + 1}</span>
    </div>
  )
}
