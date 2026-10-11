import { motion, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

import type { FeaturedProject } from '../../types/portfolio'
import { projectDisplayName } from '../../data/portfolio'
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
}

function FlowNodes({ project, activeLane, reduceMotion }: ProjectDiagramProps & { reduceMotion: boolean }) {
  const labels = project.artifactLanes.map((lane) => lane.label)
  const nodeX = [96, 320, 544]
  const activeNodeX = nodeX[activeLane] ?? nodeX[0]

  return (
    <svg viewBox="0 0 640 280" role="img" aria-label={`${projectDisplayName(project.name)} system flow diagram`}>
      <path className="caseflow-route-track" d="M48 140H592" />
      <motion.line
        className="caseflow-route-signal"
        x1="48"
        y1="140"
        x2={nodeX[0]}
        y2="140"
        initial={false}
        animate={{ x2: activeNodeX }}
        transition={reduceMotion
          ? { duration: 0 }
          : { duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      />
      {nodeX.map((x, index) => (
        <g key={x} className={index === activeLane ? 'caseflow-route-node caseflow-route-node--active' : 'caseflow-route-node'}>
          <circle cx={x} cy="140" r="7" />
          <text x={x} y="92" textAnchor="middle">0{index + 1} / {labels[index] ?? 'Stage'}</text>
        </g>
      ))}
      <motion.circle
        className="caseflow-route-traveler"
        cx={nodeX[0]}
        cy="140"
        r="12"
        initial={false}
        animate={{ cx: activeNodeX }}
        transition={reduceMotion
          ? { duration: 0 }
          : { duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      />
      <text x="42" y="248">{project.diagramCaption ?? ""}</text>
    </svg>
  )
}

function Waveform({ project, activeLane, reduceMotion, isVisible }: ProjectDiagramProps & { reduceMotion: boolean }) {
  return (
    <svg viewBox="0 0 720 220" role="img" aria-label={`${projectDisplayName(project.name)} audio processing visualization`}>
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
        animate={{ pathLength: activeLane === 2 ? 1 : 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.62,
          delay: !reduceMotion && activeLane === 2 ? 0.5 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
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
      <text x="2" y="216">INGEST</text><text x="332" y="216">RUNTIME</text><text x="718" y="216" textAnchor="end">EXPORT</text>
    </svg>
  )
}

function VisionFrame({ project, activeLane, reduceMotion }: ProjectDiagramProps & { reduceMotion: boolean }) {
  const targets = [
    { x: 132, y: 72, width: 110, height: 102 },
    { x: 340, y: 54, width: 126, height: 142 },
    { x: 495, y: 108, width: 94, height: 92 },
  ]
  const loopNodes = [['CAPTURE', 110], ['INFERENCE', 360], ['CONTROL', 610]] as const
  const activeNodeX = loopNodes[activeLane]?.[1] ?? loopNodes[0][1]

  return (
    <svg viewBox="0 0 720 270" role="img" aria-label={`${projectDisplayName(project.name)} live frame and detection bounds`}>
      {targets.map((box, index) => (
        <g key={box.x} className={index === activeLane ? 'vision-target vision-target--active' : 'vision-target'}>
          <path d={`M${box.x} ${box.y + 16}V${box.y}H${box.x + 16}M${box.x + box.width - 16} ${box.y}H${box.x + box.width}V${box.y + 16}M${box.x} ${box.y + box.height - 16}V${box.y + box.height}H${box.x + 16}M${box.x + box.width - 16} ${box.y + box.height}H${box.x + box.width}V${box.y + box.height - 16}`} />
          <text x={box.x} y={box.y - 8}>{index === activeLane ? `TRACK 0${index + 1} / LOCKED` : `FRAME 0${index + 1}`}</text>
        </g>
      ))}
      <path className="vision-loop-track" d="M70 230H650" />
      <motion.line
        className="vision-loop-signal"
        x1="70"
        y1="230"
        x2={loopNodes[0][1]}
        y2="230"
        initial={false}
        animate={{ x2: activeNodeX }}
        transition={reduceMotion
          ? { duration: 0 }
          : { duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      />
      {loopNodes.map(([label, x], index) => (
        <g className={index === activeLane ? 'vision-loop-node vision-loop-node--active' : 'vision-loop-node'} key={label}>
          <circle cx={x} cy="230" r="4" />
          <text x={x} y="218" textAnchor="middle">{label}</text>
        </g>
      ))}
      <motion.circle
        className="vision-loop-traveler"
        cx={loopNodes[0][1]}
        cy="230"
        r="6"
        initial={false}
        animate={{ cx: activeNodeX }}
        transition={reduceMotion
          ? { duration: 0 }
          : { duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      />
      <text x="20" y="265">FRAME BUFFER / CLOSED CONTROL LOOP</text>
    </svg>
  )
}

function DomainMap({ project, activeLane, reduceMotion }: ProjectDiagramProps & { reduceMotion: boolean }) {
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
    <svg viewBox="0 0 640 270" role="img" aria-label={`${projectDisplayName(project.name)} motorsport domain map`}>
      {paths.map((path, index) => {
        const linkActive =
          activeLane === 0 || (activeLane === 1 && index < 2) || (activeLane === 2 && index > 1)
        return (
          <motion.path
            key={path}
            className={linkActive ? 'domain-link domain-link--active' : 'domain-link'}
            d={path}
            initial={false}
            animate={{ pathLength: linkActive ? 1 : 0, opacity: linkActive ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.45 }}
          />
        )
      })}
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
          <text x={node.x} y={node.y + (node.y < 130 ? -16 : 24)} textAnchor="middle">{node.label}</text>
        </g>
      ))}
      <text x="24" y="258">{laneLabel.toUpperCase()} / RELATED RESOURCES</text>
    </svg>
  )
}

function FlightRoute({ project, activeLane, reduceMotion }: ProjectDiagramProps & { reduceMotion: boolean }) {
  const routes = [
    'M104 62 C188 62 222 132 304 132',
    'M104 202 C188 202 222 132 304 132',
    'M360 132 C442 132 470 62 548 62',
    'M360 132 C442 132 470 202 548 202',
  ]
  const routeVisible = (index: number) =>
    index < 2 || (activeLane >= 1 && index === 3) || (activeLane >= 2 && index === 2)
  return (
    <svg viewBox="0 0 720 270" role="img" aria-label={`${projectDisplayName(project.name)} live aircraft data route`}>
      {routes.map((path, index) => (
        <g key={path}>
          {routeVisible(index) ? <path className="flight-route-track" d={path} /> : null}
          <motion.path
            className={routeVisible(index) ? 'flight-route-signal flight-route-signal--active' : 'flight-route-signal'}
            d={path}
            initial={false}
            animate={{ pathLength: routeVisible(index) ? 1 : 0, opacity: routeVisible(index) ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.58, ease: [0.22, 1, 0.36, 1] }}
          />
        </g>
      ))}
      {[
        { x: 78, y: 62, label: 'OPENSKY', active: true },
        { x: 78, y: 202, label: 'ADSB.LOL', active: true },
        { x: 332, y: 132, label: 'FLASK API', active: true },
        { x: 576, y: 62, label: 'LIVE MAP', active: activeLane >= 2 },
        { x: 576, y: 202, label: 'SQLITE ARCHIVE', active: activeLane >= 1 },
      ].map((node) => (
        <g className={`flight-route-node${node.active ? ' flight-route-node--active' : ''}`} key={node.label}>
          <circle cx={node.x} cy={node.y} r="5" />
          <text x={node.x} y={node.y + (node.y < 132 ? -18 : 24)} textAnchor="middle">{node.label}</text>
        </g>
      ))}
      <text x="22" y="256">LIVE FEEDS / POSITION HISTORY / REPLAY</text>
    </svg>
  )
}

// A test's query log. The same rows stay on screen; the stage decides what they mean.
const queryRows = [
  { sql: 'SELECT … FROM orders', site: 'orders.py:11', repeat: false },
  ...[1, 2, 3, 4, 5].map((id) => ({
    sql: `SELECT … FROM customers WHERE id = ${id}`,
    site: 'orders.py:14',
    repeat: true,
  })),
  { sql: 'SELECT … FROM payments', site: 'billing.py:8', repeat: false },
]
const queryRowY = (index: number) => 42 + index * 19
const repeatedRows = queryRows.filter((row) => row.repeat).length

function QueryLog({ project, activeLane, reduceMotion }: ProjectDiagramProps & { reduceMotion: boolean }) {
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  const shown = (lane: number) => (activeLane === lane ? 1 : 0)

  return (
    <svg
      className="query-log"
      viewBox="0 0 460 256"
      role="img"
      aria-label={`${projectDisplayName(project.name)} query log and plan`}
    >
      <text x="14" y="16">TEST LOG / {queryRows.length} STATEMENTS</text>
      <path className="query-log-rule" d="M14 26H446M14 172H446" />
      {queryRows.map((row, index) => {
        const hot = activeLane === 1 && row.repeat
        const focus = activeLane === 2 && index === 0
        const dim = (activeLane === 1 && !row.repeat) || (activeLane === 2 && index !== 0)
        return (
          <motion.g
            key={row.sql}
            className={`query-row${hot ? ' query-row--hot' : ''}${focus ? ' query-row--focus' : ''}`}
            initial={reduceMotion ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: dim ? 0.6 : 1, x: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <text className="query-row__no" x="14" y={queryRowY(index)}>{String(index + 1).padStart(2, '0')}</text>
            <text x="44" y={queryRowY(index)}>{row.sql}</text>
            <text className="query-row__site" x="446" y={queryRowY(index)} textAnchor="end">{row.site}</text>
          </motion.g>
        )
      })}
      <motion.path
        className="query-bracket"
        d={`M7 ${queryRowY(1) - 12}H2V${queryRowY(repeatedRows) + 5}H7`}
        initial={false}
        animate={{ opacity: shown(1) }}
        transition={transition}
      />

      <motion.g initial={false} animate={{ opacity: shown(0) }} transition={transition}>
        <text className="query-big" x="14" y="224">{queryRows.length}</text>
        <text x="84" y="204">STATEMENTS IN ONE TEST</text>
        <text x="84" y="222">EACH WITH ITS CALL SITE</text>
      </motion.g>

      <motion.g initial={false} animate={{ opacity: shown(1) }} transition={transition}>
        <text className="query-big" x="14" y="224">{repeatedRows}×</text>
        <text x="110" y="204">SAME STATEMENT, SAME SITE</text>
        <text className="query-verdict" x="110" y="222">N+1: LOAD THEM TOGETHER</text>
      </motion.g>

      <motion.g initial={false} animate={{ opacity: shown(2) }} transition={transition}>
        <g className="query-plan-node query-plan-node--bad">
          <rect x="14" y="182" width="190" height="46" rx="2" />
          <text className="query-plan-title" x="26" y="202">Seq Scan on orders</text>
          <text className="query-plan-sub" x="26" y="219">customer_id = $1</text>
        </g>
        <motion.path
          className="query-plan-arrow"
          d="M210 205H250"
          initial={false}
          animate={{ pathLength: activeLane === 2 ? 1 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.25 }}
        />
        <motion.g
          className="query-plan-node query-plan-node--good"
          initial={false}
          animate={{ opacity: activeLane === 2 ? 1 : 0.25 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.5 }}
        >
          <rect x="256" y="182" width="190" height="46" rx="2" />
          <text className="query-plan-title" x="268" y="202">Index Scan on orders</text>
          <text className="query-plan-sub" x="268" y="219">orders_customer_id_idx</text>
        </motion.g>
        <text className="query-verdict" x="14" y="248">CREATE INDEX ON orders (customer_id)</text>
      </motion.g>
    </svg>
  )
}

export function ProjectDiagram({ project, activeLane }: ProjectDiagramProps) {
  const reduceMotion = useReducedMotion()
  const diagramRef = useRef<HTMLDivElement>(null)
  const isVisible = useAmbientActivity(diagramRef)

  return (
    <div ref={diagramRef} className={`project-diagram project-diagram--${project.theme}${project.visualization ? ` project-diagram--${project.visualization}` : ''}`} data-reduced={reduceMotion}>
      <div className="project-diagram__visual" aria-hidden="true">
      {project.visualization === 'flight-route' ? <FlightRoute project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      {project.visualization === 'query-log' ? <QueryLog project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      {project.theme === 'steel' && !project.visualization ? <FlowNodes project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      {project.theme === 'signal' ? <Waveform project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      {project.theme === 'vision' && project.visualization !== 'flight-route' ? <VisionFrame project={project} activeLane={activeLane} reduceMotion={reduceMotion ?? false} /> : null}
      {project.theme === 'track' ? <DomainMap project={project} activeLane={activeLane} reduceMotion={reduceMotion ?? false} /> : null}
      </div>
    </div>
  )
}
