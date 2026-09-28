import { motion, useReducedMotion, type MotionStyle } from 'framer-motion'
import { useRef } from 'react'

import type { FeaturedProject } from '../../types/portfolio'
import { useAmbientActivity } from '../../hooks/useAmbientActivity'

// Static geometry is computed once. Six phased groups retain the full 72-bar waveform.
const waveformGroups = Array.from({ length: 6 }, (_, group) =>
  Array.from({ length: 12 }, (_, offset) => {
    const index = offset * 6 + group
    const envelope = 0.2 + 0.8 * Math.sin((index / 71) * Math.PI) ** 0.7
    const wave = 0.28 + Math.abs(Math.sin(index * 1.93) * Math.cos(index * 0.37))
    return { index, height: 18 + envelope * wave * 108 }
  }),
)

interface ProjectDiagramProps {
  project: FeaturedProject
  activeLane: number
  isVisible?: boolean
  onSelectLane?: (lane: number) => void
  visualFocusStyle?: MotionStyle
}

function FlowNodes({ project, activeLane, reduceMotion, isVisible }: ProjectDiagramProps & { reduceMotion: boolean }) {
  const labels = project.artifactLanes.map((lane) => lane.label)
  const nodeX = [96, 320, 544]
  const progress = [0.09, 0.5, 1][activeLane] ?? 0.09

  return (
    <svg viewBox="0 0 640 280" role="img" aria-label={`${project.name} system flow diagram`}>
      <path className="caseflow-route-track" d="M48 140H592" />
      <motion.path
        className="caseflow-route-signal"
        d="M48 140H592"
        initial={false}
        animate={{ pathLength: progress }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
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
        animate={{ x: (nodeX[activeLane] ?? nodeX[0]) - nodeX[0] }}
        transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
      />
      {!reduceMotion && isVisible ? (
        <motion.circle
          className="caseflow-route-packet"
          cy="140"
          r="3"
          cx="48"
          initial={{ x: 0 }}
          animate={{ x: [0, 544] }}
          transition={{ duration: 3.4, ease: 'linear', repeat: Infinity, repeatDelay: 0.65 }}
        />
      ) : null}
      <text x="42" y="248">REQUEST / POLICY → STATE → DELIVERY</text>
    </svg>
  )
}

function Waveform({ project, activeLane, reduceMotion, isVisible }: ProjectDiagramProps & { reduceMotion: boolean }) {
  return (
    <svg viewBox="0 0 720 220" role="img" aria-label={`${project.name} audio processing visualization`}>
      <path className="diagram-wave-mid" d="M0 110H720" />
      <motion.g
        className="diagram-waveform"
        initial={false}
        animate={{ scaleX: activeLane === 2 ? 0.58 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '0px 110px' }}
        data-running={!reduceMotion && isVisible}
      >
        {waveformGroups.map((bars, group) => (
          <g className={`diagram-wave-cluster diagram-wave-cluster--${group}`} key={group}>
            {bars.map(({ height, index }) => (
              <rect key={index} x={index * 10 + 1} y={110 - height / 2} width="4" height={height} rx="2"
                className={Math.floor(index / 24) === activeLane ? 'diagram-wave-bar diagram-wave-bar--active' : 'diagram-wave-bar'} />
            ))}
          </g>
        ))}
      </motion.g>
      <motion.path
        className="diagram-conversion-route"
        d="M412 110 C440 110 430 74 466 74"
        initial={false}
        animate={{ pathLength: activeLane === 2 ? 1 : activeLane === 1 ? 0.38 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.g
        className="diagram-transcript"
        initial={false}
        animate={{ opacity: activeLane === 2 ? 1 : 0, x: activeLane === 2 ? 0 : 14 }}
        transition={{ duration: reduceMotion ? 0 : 0.42, delay: !reduceMotion && activeLane === 2 ? 0.2 : 0 }}
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
        transition={reduceMotion || !isVisible ? { duration: 0 } : { duration: 6, repeat: Infinity, ease: 'linear' }}
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
      <motion.path className="vision-scan" d="M0 0H720" animate={reduceMotion || !isVisible ? { y: 18 } : { y: [18, 250, 18] }} transition={reduceMotion || !isVisible ? { duration: 0 } : { duration: 5, repeat: Infinity, ease: 'linear' }} />
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
        transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
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
        cx="0"
        cy="0"
        r="3"
        initial={false}
        animate={reduceMotion || !isVisible ? { x: target.x + target.width / 2, y: target.y + target.height / 2 } : {
          x: [187, 403, 542, 187],
          y: [123, 125, 154, 123],
        }}
        transition={reduceMotion || !isVisible ? { duration: 0 } : { duration: 5.4, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  )
}

function DomainMap({ project, activeLane, reduceMotion, isVisible }: ProjectDiagramProps & { reduceMotion: boolean }) {
  const nodes = [
    { x: 100, y: 70, label: 'SEASON' },
    { x: 320, y: 70, label: 'RACE' },
    { x: 540, y: 70, label: 'RESULT' },
    { x: 210, y: 200, label: 'TEAM' },
    { x: 430, y: 200, label: 'DRIVER' },
  ]
  const paths = ['M100 70H320', 'M320 70H540', 'M100 70L210 200', 'M320 70L210 200', 'M320 70L430 200', 'M540 70L430 200']
  const laneLabel = project.artifactLanes[activeLane]?.label ?? 'Domain'

  return (
    <svg viewBox="0 0 640 270" role="img" aria-label={`${project.name} motorsport domain map`}>
      {paths.map((path, index) => (
        <motion.path
          key={path}
          className={
            activeLane === 0 || (activeLane === 1 && index < 2) || (activeLane === 2 && index > 1)
              ? 'domain-link domain-link--active'
              : 'domain-link'
          }
          d={path}
          initial={false}
          animate={{
            pathLength: activeLane === 0 || (activeLane === 1 && index < 2) || (activeLane === 2 && index > 1) ? 1 : 0.16,
            opacity: activeLane === 0 || (activeLane === 1 && index < 2) || (activeLane === 2 && index > 1) ? 1 : 0.35,
          }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
        />
      ))}
      <motion.path
        className="domain-api-flow"
        d="M28 70H612"
        initial={false}
        animate={{ pathLength: activeLane === 1 ? 1 : activeLane === 2 ? 0.4 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      {nodes.map((node, index) => (
        <g key={node.label} className={activeLane === 0 || (activeLane === 1 && index < 3) || (activeLane === 2 && index >= 3) ? 'domain-node domain-node--active' : 'domain-node'}>
          <circle cx={node.x} cy={node.y} r="6" />
          <text x={node.x} y={node.y + 24} textAnchor="middle">{node.label}</text>
        </g>
      ))}
      <motion.circle className="domain-pulse" cx={nodes[activeLane === 2 ? 2 : activeLane === 1 ? 4 : 0].x} cy={nodes[activeLane === 2 ? 2 : activeLane === 1 ? 4 : 0].y} r="15" animate={reduceMotion || !isVisible ? { opacity: 0.28, scale: 1 } : { opacity: [0.15, 0.45, 0.15], scale: [0.9, 1.1, 0.9] }} transition={reduceMotion || !isVisible ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.circle
        className="domain-packet"
        r="4"
        initial={false}
        animate={reduceMotion || !isVisible ? { x: nodes[0].x, y: nodes[0].y } : {
          x: [100, 320, 540, 430, 320, 210, 100],
          y: [70, 70, 70, 200, 70, 200, 70],
        }}
        transition={reduceMotion || !isVisible ? { duration: 0 } : { duration: 7.2, repeat: Infinity, ease: 'linear' }}
      />
      <text x="24" y="258">{laneLabel.toUpperCase()} / RELATED RESOURCES</text>
    </svg>
  )
}

export function ProjectDiagram({ project, activeLane, onSelectLane, visualFocusStyle }: ProjectDiagramProps) {
  const reduceMotion = useReducedMotion()
  const diagramRef = useRef<HTMLDivElement>(null)
  const isVisible = useAmbientActivity(diagramRef)

  return (
    <div ref={diagramRef} className={`project-diagram project-diagram--${project.theme}`} data-reduced={reduceMotion}>
      <motion.div className="project-diagram__visual" style={visualFocusStyle} aria-hidden="true">
      {project.theme === 'steel' ? <FlowNodes project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      {project.theme === 'signal' ? <Waveform project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      {project.theme === 'vision' ? <VisionFrame project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      {project.theme === 'track' ? <DomainMap project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      </motion.div>
      {project.theme === 'signal' && onSelectLane ? (
        <label className="audio-journey">
          <span className="audio-journey__caption">Trace audio → text <span aria-hidden="true">↔</span></span>
          <input className="audio-journey__scrubber" type="range" min="0" max={project.artifactLanes.length - 1} step="1"
            value={activeLane} aria-label="Audio processing stage" aria-valuetext={project.artifactLanes[activeLane]?.label}
            onChange={event => onSelectLane(Number(event.currentTarget.value))} />
          <span className="audio-journey__stops" aria-hidden="true">
            {project.artifactLanes.map((lane, index) => <span key={lane.label} data-active={index === activeLane}>{lane.label}</span>)}
          </span>
        </label>
      ) : null}
    </div>
  )
}
