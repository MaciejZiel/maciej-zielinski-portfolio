import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type SyntheticEvent,
  type TransitionEvent,
} from 'react'

import type { FeaturedProject } from '../../types/portfolio'
import { projectAccent, projectAnchorId, projectDisplayName } from '../../data/portfolio'
import { useReduceMotion } from '../../hooks/useMotionPreference'
import { Icon } from '../ui/Icon'
import { MotionReveal } from '../ui/MotionReveal'
import { ProjectDiagram } from './ProjectDiagram'
import { TagList } from '../ui/TagList'

interface ProjectShowcaseProps {
  index: number
  project: FeaturedProject
}

export function ProjectShowcase({ index, project }: ProjectShowcaseProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeLaneIndex, setActiveLaneIndex] = useState(0)
  const displayName = projectDisplayName(project.name)
  // A long unbreakable word (QUERYGUARD) overflows the wide display face at full size.
  const longestWord = Math.max(...displayName.split(/[\s-]+/).map((word) => word.length))
  const nameClass = longestWord > 9 ? 'project-showcase__name project-showcase__name--long' : 'project-showcase__name'
  const reduceMotion = useReduceMotion()
  const accent = projectAccent(project.name)
  const accentStyle = accent
    ? ({
        '--project-accent': accent,
        '--project-accent-soft': `color-mix(in srgb, ${accent} 8%, transparent)`,
      } as CSSProperties)
    : undefined
  const [notesOpen, setNotesOpen] = useState(false)
  const [notesExpanded, setNotesExpanded] = useState(false)

  useEffect(() => {
    if (!notesOpen || reduceMotion) return
    // Let the panel paint collapsed first, then grow it on the next frame.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setNotesExpanded(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [notesOpen, reduceMotion])

  const handleNotesClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    if (!notesExpanded) {
      // Reopen directly when the panel is still mid-collapse, otherwise mount it first.
      if (notesOpen || reduceMotion) setNotesExpanded(true)
      setNotesOpen(true)
      return
    }
    setNotesExpanded(false)
    if (reduceMotion) setNotesOpen(false)
  }

  const handleNotesToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    // Keeps state in sync when the browser opens the element itself (find-in-page).
    const isOpen = event.currentTarget.open
    if (isOpen !== notesOpen) {
      setNotesOpen(isOpen)
      if (!isOpen) setNotesExpanded(false)
    }
  }

  const handleNotesTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'grid-template-rows') return
    if (!notesExpanded) setNotesOpen(false)
  }
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const stageY = useTransform(scrollYProgress, [0, 1], [16, -16])
  const railScale = useTransform(scrollYProgress, [0, 0.18, 0.5, 0.82, 1], [0.88, 1, 1.1, 1, 0.88])
  const railOpacity = useTransform(scrollYProgress, [0, 0.16, 0.5, 0.84, 1], [0.8, 0.9, 1, 0.9, 0.8])
  const activeLane = project.artifactLanes[activeLaneIndex] ?? project.artifactLanes[0]

  return (
    <article
      ref={sectionRef}
      id={projectAnchorId(project.name)}
      className={`project-showcase project-showcase--${project.theme}`}
      data-chapter={project.theme}
      data-atmosphere={project.visualization === 'flight-route' ? 'flights' : undefined}
      style={accentStyle}
    >
      <div className="project-showcase__rail-wrap">
        <MotionReveal className="project-showcase__rail" delay={0.04}>
          <div className="project-showcase__rail-meter" aria-hidden="true">
            <span className="project-showcase__rail-meter-track" />
            <motion.span
              className="project-showcase__rail-meter-fill"
              style={
                reduceMotion
                  ? undefined
                  : { scaleY: scrollYProgress }
              }
            />
          </div>
          <motion.p
            className="project-showcase__rail-index"
            style={
                reduceMotion
                  ? undefined
                : { scale: railScale, opacity: railOpacity }
            }
          >
            0{index + 1}
          </motion.p>
          <motion.div
            className="project-showcase__rail-copy"
            style={reduceMotion ? undefined : { opacity: railOpacity }}
          >
            <span>{project.category}</span>
            <span>{project.year}</span>
          </motion.div>
        </MotionReveal>
      </div>

      <div className="project-showcase__main-wrap">
        <div className="project-showcase__body">
          <MotionReveal className="project-showcase__content">
            <div className="project-showcase__meta">
              <span className="project-showcase__status">{project.status}</span>
            </div>

            <div className="project-showcase__header-block">
              <h3
                className={nameClass}
                aria-label={displayName}
              >
                {displayName}
              </h3>
              <p className="project-showcase__headline">{project.headline}</p>
            </div>

            <div className="project-showcase__spotlight">
              <span className="project-showcase__spotlight-label">Outcome</span>
              <p className="project-showcase__spotlight-copy">{project.outcome}</p>
            </div>

            <details
              className="project-showcase__deep-dive"
              open={notesOpen}
              data-expanded={notesExpanded}
              onToggle={handleNotesToggle}
            >
              <summary onClick={handleNotesClick}>
                <span>Open the engineering notes</span>
                <span className="project-showcase__disclosure-mark" aria-hidden="true">+</span>
              </summary>
              <div className="project-showcase__deep-dive-panel" onTransitionEnd={handleNotesTransitionEnd}>
              <div className="project-showcase__deep-dive-clip">
              <div className="project-showcase__deep-dive-body">
                <p>{project.context}</p>
                <div className="project-showcase__narrative">
                  <div className="project-showcase__narrative-block">
                    <span className="project-showcase__narrative-label">Overview</span>
                    <p className="project-showcase__summary">{project.summary}</p>
                  </div>
                  <div className="project-showcase__narrative-block">
                    <span className="project-showcase__narrative-label">Challenge</span>
                    <p className="project-showcase__summary">{project.challenge}</p>
                  </div>
                </div>
                <dl className="project-showcase__metrics">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="project-showcase__metric">
                      <dt>{metric.label}</dt><dd>{metric.value}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="project-showcase__details">
                  {project.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
              </div>
              </div>
              </div>
            </details>

            <div className="project-showcase__footer">
              <TagList items={project.technologies} />
              <div className="project-showcase__link-group">
                <div className="project-showcase__actions">
                  {project.liveDemoUrl ? (
                    <a
                      className="project-showcase__live"
                      href={project.liveDemoUrl}
                      rel="noreferrer"
                      target="_blank"
                      aria-label={`Try ${project.name.replaceAll('_', ' ')} live (opens in a new tab)`}
                    >
                      <span className="project-showcase__live-dot" aria-hidden="true" />
                      <span>Try it live</span>
                      <Icon
                        name="arrow-up-right"
                        className="project-showcase__link-icon"
                      />
                    </a>
                  ) : null}
                  <a
                    className="project-showcase__link"
                    href={project.repositoryUrl}
                    rel="noreferrer"
                    target="_blank"
                    aria-label={`${project.repositoryLabel} for ${project.name.replaceAll('_', ' ')} (opens in a new tab)`}
                  >
                    <span>{project.repositoryLabel}</span>
                    <Icon
                      name="arrow-up-right"
                      className="project-showcase__link-icon"
                    />
                  </a>
                </div>
                {project.repositoryNote ? (
                  <p className="project-showcase__note">{project.repositoryNote}</p>
                ) : null}
              </div>
            </div>
          </MotionReveal>

          <motion.div
            className="project-showcase__artifact"
            style={reduceMotion ? undefined : { y: stageY }}
          >
            <div className="project-showcase__artifact-frame">
              <div className="project-showcase__artifact-topline">
                <div className="project-showcase__stage-topline">
                  <span>{project.stageLabel}</span>
                  <span className="project-showcase__stage-sep">/</span>
                  <span>{project.year}</span>
                </div>
              </div>

              <ProjectDiagram project={project} activeLane={activeLaneIndex} />

              <div className="project-showcase__artifact-header">
                <span className="project-showcase__artifact-label">Explore the build</span>
                <h4 className="project-showcase__artifact-title">
                  {project.artifactTitle}
                </h4>
                <p className="project-showcase__artifact-summary">
                  {project.artifactSummary}
                </p>
              </div>

              <div className={`project-showcase__lane-tabs project-showcase__lane-tabs--${project.theme}`} role="group" aria-label={`${displayName} journey stages`}>
                {project.artifactLanes.map((lane, laneIdx) => (
                  <button
                    key={lane.label}
                    type="button"
                    aria-pressed={activeLaneIndex === laneIdx}
                    className={`project-showcase__lane-tab${activeLaneIndex === laneIdx ? ' project-showcase__lane-tab--active' : ''}`}
                    onClick={() => setActiveLaneIndex(laneIdx)}
                  >
                    <span className="project-showcase__lane-tab-index">0{laneIdx + 1}</span>
                    <span className="project-showcase__lane-tab-label">{lane.label}</span>
                  </button>
                ))}
              </div>

              <div className="project-showcase__lane-display" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLane.label}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="project-showcase__active-lane-card"
                  >
                    <div className="project-showcase__active-lane-head">
                      <span className="project-showcase__active-lane-num">0{activeLaneIndex + 1}</span>
                      <div>
                        <h5 className="project-showcase__active-lane-title">{activeLane.label}</h5>
                        <p className="project-showcase__active-lane-summary">{activeLane.summary}</p>
                      </div>
                    </div>

                    <div className="project-showcase__active-lane-components">
                      <span className="project-showcase__active-lane-chips-title">In this layer:</span>
                      <ul className="project-showcase__active-lane-chips">
                        {activeLane.items.map((item) => (
                          <li key={item} className="project-showcase__active-lane-chip">
                            <span className="project-showcase__chip-dot" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </article>
  )
}
