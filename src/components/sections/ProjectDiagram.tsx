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
      <span className="project-diagram__index">FIG. 0{activeLane + 1}</span>
    </div>
  )
}
