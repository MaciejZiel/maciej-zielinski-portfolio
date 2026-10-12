import { motion } from 'framer-motion'
import { useRef } from 'react'

import type { FeaturedProject } from '../../types/portfolio'
import { projectDisplayName } from '../../data/portfolio'
import { useAmbientActivity } from '../../hooks/useAmbientActivity'
import { useReduceMotion } from '../../hooks/useMotionPreference'

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
    <svg viewBox="0 0 640 104" role="img" aria-label={`${projectDisplayName(project.name)} system flow diagram`}>
      <path className="caseflow-route-track" d="M48 72H592" />
      <motion.line
        className="caseflow-route-signal"
        x1="48"
        y1="72"
        x2={nodeX[0]}
        y2="72"
        initial={false}
        animate={{ x2: activeNodeX }}
        transition={reduceMotion
          ? { duration: 0 }
          : { duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      />
      {nodeX.map((x, index) => (
        <g key={x} className={index === activeLane ? 'caseflow-route-node caseflow-route-node--active' : 'caseflow-route-node'}>
          <circle cx={x} cy="72" r="7" />
          <text x={x} y="40" textAnchor="middle">0{index + 1} / {labels[index] ?? 'Stage'}</text>
        </g>
      ))}
      <motion.circle
        className="caseflow-route-traveler"
        cx={nodeX[0]}
        cy="72"
        r="12"
        initial={false}
        animate={{ cx: activeNodeX }}
        transition={reduceMotion
          ? { duration: 0 }
          : { duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

function Waveform({ project, activeLane, reduceMotion, isVisible }: ProjectDiagramProps & { reduceMotion: boolean }) {
  return (
    <svg viewBox="0 36 720 168" role="img" aria-label={`${projectDisplayName(project.name)} audio processing visualization`}>
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

  return (
    <svg viewBox="0 30 640 206" role="img" aria-label={`${projectDisplayName(project.name)} motorsport domain map`}>
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
    <svg viewBox="0 24 720 218" role="img" aria-label={`${projectDisplayName(project.name)} live aircraft data route`}>
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
    </svg>
  )
}

// A test's query log. The same rows stay on screen; the stage decides what they mean.
const queryRows = [
  { sql: 'SELECT … FROM orders', repeat: false },
  ...[1, 2, 3, 4].map((id) => ({ sql: `SELECT … FROM customers WHERE id = ${id}`, repeat: true })),
  { sql: 'SELECT … FROM payments', repeat: false },
]
const queryRowY = (index: number) => 40 + index * 19
const repeatedRows = queryRows.filter((row) => row.repeat).length

// Fixing each label's length keeps the layout stable when a visitor widens letter spacing (WCAG 1.4.12).
const fit = (text: string, perChar: number) => ({ textLength: text.length * perChar, lengthAdjust: 'spacingAndGlyphs' as const })
const MONO = 7.2 // advance of 12px mono text
const NOTE = 7.68 // the same with the 0.04em letter spacing used by notes

function QueryLog({ project, activeLane, reduceMotion }: ProjectDiagramProps & { reduceMotion: boolean }) {
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  const shown = (lane: number) => (activeLane === lane ? 1 : 0)

  return (
    <svg
      className="query-log"
      viewBox="0 0 460 162"
      role="img"
      aria-label={`${projectDisplayName(project.name)} query log and plan`}
    >
      <text className="query-note" x="14" y="14" {...fit(`TEST LOG / ${queryRows.length} STATEMENTS`, NOTE)}>TEST LOG / {queryRows.length} STATEMENTS</text>
      <path className="query-log-rule" d="M14 22H294M306 8V150" />
      {queryRows.map((row, index) => {
        const hot = activeLane === 1 && row.repeat
        const focus = activeLane === 2 && index === 0
        const dim = (activeLane === 1 && !row.repeat) || (activeLane === 2 && index !== 0)
        return (
          <motion.g
            key={row.sql}
            className={`query-row${hot ? ' query-row--hot' : ''}${focus ? ' query-row--focus' : ''}`}
            initial={reduceMotion ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: dim ? 0.8 : 1, x: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <text className="query-row__no" x="14" y={queryRowY(index)}>{String(index + 1).padStart(2, '0')}</text>
            <text x="36" y={queryRowY(index)} {...fit(row.sql, MONO)}>{row.sql}</text>
          </motion.g>
        )
      })}
      <motion.path
        className="query-bracket"
        d={`M7 ${queryRowY(1) - 11}H2V${queryRowY(repeatedRows) + 5}H7`}
        initial={false}
        animate={{ opacity: shown(1) }}
        transition={transition}
      />

      <motion.g initial={false} animate={{ opacity: shown(0) }} transition={transition}>
        <text className="query-big" x="318" y="80">{queryRows.length}</text>
        <text className="query-note" x="318" y="102" {...fit('STATEMENTS', NOTE)}>STATEMENTS</text>
        <text className="query-note" x="318" y="118" {...fit('IN ONE TEST', NOTE)}>IN ONE TEST</text>
      </motion.g>

      <motion.g initial={false} animate={{ opacity: shown(1) }} transition={transition}>
        <text className="query-big" x="318" y="80">{repeatedRows}×</text>
        <text className="query-note" x="318" y="102" {...fit('SAME STATEMENT', NOTE)}>SAME STATEMENT</text>
        <text className="query-note" x="318" y="118" {...fit('SAME CALL SITE', NOTE)}>SAME CALL SITE</text>
        <text className="query-note query-verdict" x="318" y="138" {...fit('N+1 FOUND', NOTE)}>N+1 FOUND</text>
      </motion.g>

      <motion.g initial={false} animate={{ opacity: shown(2) }} transition={transition}>
        <g className="query-plan-node query-plan-node--bad">
          <rect x="318" y="22" width="134" height="42" rx="2" />
          <text className="query-plan-title" x="328" y="39" {...fit('Seq Scan', MONO)}>Seq Scan</text>
          <text className="query-plan-sub" x="328" y="55" {...fit('on orders', MONO)}>on orders</text>
        </g>
        <motion.path
          className="query-plan-arrow"
          d="M385 68V84"
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
          <rect x="318" y="88" width="134" height="42" rx="2" />
          <text className="query-plan-title" x="328" y="105" {...fit('Index Scan', MONO)}>Index Scan</text>
          <text className="query-plan-sub" x="328" y="121" {...fit('customer_id_idx', MONO)}>customer_id_idx</text>
        </motion.g>
        <text className="query-note query-verdict" x="14" y="154" {...fit('FIX: CREATE INDEX ON orders (customer_id)', NOTE)}>FIX: CREATE INDEX ON orders (customer_id)</text>
      </motion.g>
    </svg>
  )
}

export function ProjectDiagram({ project, activeLane }: ProjectDiagramProps) {
  const reduceMotion = useReduceMotion()
  const diagramRef = useRef<HTMLDivElement>(null)
  const isVisible = useAmbientActivity(diagramRef)

  return (
    <div ref={diagramRef} className={`project-diagram project-diagram--${project.theme}${project.visualization ? ` project-diagram--${project.visualization}` : ''}`} data-reduced={reduceMotion}>
      <div className="project-diagram__visual" aria-hidden="true">
      {project.visualization === 'flight-route' ? <FlightRoute project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      {project.visualization === 'query-log' ? <QueryLog project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      {project.theme === 'steel' && !project.visualization ? <FlowNodes project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      {project.theme === 'signal' ? <Waveform project={project} activeLane={activeLane} isVisible={isVisible} reduceMotion={reduceMotion ?? false} /> : null}
      {project.theme === 'track' ? <DomainMap project={project} activeLane={activeLane} reduceMotion={reduceMotion ?? false} /> : null}
      </div>
    </div>
  )
}
