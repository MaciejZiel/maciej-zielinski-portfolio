import {
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import { useRef, useState } from 'react'

import type { FeaturedProject } from '../../types/portfolio'
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
  const scrollLaneIndex = useRef(-1)
  const hasCompactName = project.name.includes('_') || project.name.length > 16
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const stageY = useTransform(scrollYProgress, [0, 1], [16, -16])
  const railScale = useTransform(scrollYProgress, [0, 0.18, 0.5, 0.82, 1], [0.88, 1, 1.1, 1, 0.88])
  const railOpacity = useTransform(scrollYProgress, [0, 0.16, 0.5, 0.84, 1], [0.4, 0.75, 1, 0.75, 0.4])
  const activeLane = project.artifactLanes[activeLaneIndex] ?? project.artifactLanes[0]

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    // Touch exploration is manual; desktop only advances when a narrative gate changes.
    if (project.theme !== 'steel' || reduceMotion || window.innerWidth <= 760) return
    const stage = Math.min(
      project.artifactLanes.length - 1,
      Math.floor(progress * project.artifactLanes.length),
    )
    if (scrollLaneIndex.current === stage) return
    scrollLaneIndex.current = stage
    setActiveLaneIndex(stage)
  })

  return (
    <article
      ref={sectionRef}
      className={`project-showcase project-showcase--${project.theme}`}
      data-chapter={project.theme}
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
                className={`project-showcase__name${hasCompactName ? ' project-showcase__name--compact' : ''}`}
                aria-label={project.name}
              >
                {project.name.includes('_')
                  ? project.name.split('_').map((part, partIndex, parts) => (
                    <span className="project-showcase__name-part" key={`${part}-${partIndex}`}>
                      {part}{partIndex < parts.length - 1 ? '_' : ''}
                    </span>
                  ))
                  : project.name}
              </h3>
              <p className="project-showcase__headline">{project.headline}</p>
            </div>

            {project.theme === 'steel' ? (
              <div className="caseflow-story" role="group" aria-label="CaseFlow request journey">
                <p className="caseflow-story__prompt">A request has to pass three deliberate gates.</p>
                {project.artifactLanes.map((lane, laneIndex) => (
                  <button
                    className="caseflow-story__step"
                    data-active={activeLaneIndex === laneIndex}
                    key={lane.label}
                    type="button"
                    aria-pressed={activeLaneIndex === laneIndex}
                    data-magnetic
                    onClick={() => setActiveLaneIndex(laneIndex)}
                  >
                    <span className="caseflow-story__step-index">0{laneIndex + 1}</span>
                    <span className="caseflow-story__step-copy">
                      <span className="caseflow-story__step-title">{lane.label}</span>
                      <span className="caseflow-story__step-summary">{lane.summary}</span>
                      <span className="caseflow-story__step-details">{lane.items.join(' / ')}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="project-showcase__spotlight">
                <span className="project-showcase__spotlight-label">The through-line</span>
                <p className="project-showcase__spotlight-copy">{project.outcome}</p>
              </div>
            )}

            <details className="project-showcase__deep-dive">
              <summary><span>Open the engineering notes</span><span aria-hidden="true">+</span></summary>
              <div className="project-showcase__deep-dive-body">
                {project.theme === 'steel' ? <p>{project.outcome}</p> : null}
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
            </details>

            <div className="project-showcase__footer">
              <TagList items={project.technologies} />
              <div className="project-showcase__link-group">
                <a
                  className="project-showcase__link"
                  href={project.repositoryUrl}
                  rel="noreferrer"
                  target="_blank"
                  data-magnetic
                >
                  <span>{project.repositoryLabel}</span>
                  <Icon
                    name="arrow-up-right"
                    className="project-showcase__link-icon"
                  />
                </a>
                {project.repositoryNote ? (
                  <p className="project-showcase__note">{project.repositoryNote}</p>
                ) : null}
              </div>
            </div>
          </MotionReveal>

          <motion.div
            className={`project-showcase__artifact${project.theme === 'steel' ? ' project-showcase__artifact--pinned' : ''}`}
            style={reduceMotion || project.theme === 'steel' ? undefined : { y: stageY}}
          >
            <div className="project-showcase__artifact-frame">
              <div className="project-showcase__artifact-topline">
                <div className="project-showcase__stage-topline">
                  <span>{project.stageLabel}</span>
                  <span className="project-showcase__stage-sep">/</span>
                  <span>{project.year}</span>
                </div>
              </div>

              <ProjectDiagram project={project} activeLane={activeLaneIndex} onSelectLane={setActiveLaneIndex} />

              <div className="project-showcase__artifact-header">
                <span className="project-showcase__artifact-label">Explore the build</span>
                <h4 className="project-showcase__artifact-title">
                  {project.artifactTitle}
                </h4>
                <p className="project-showcase__artifact-summary">
                  {project.artifactSummary}
                </p>
              </div>

              {/* Interactive Layer Tabs */}
              <div className={`project-showcase__lane-tabs project-showcase__lane-tabs--${project.theme}`} role="group" aria-label={`${project.name} journey stages`}>
                {project.artifactLanes.map((lane, laneIdx) => (
                  <button
                    key={lane.label}
                    type="button"
                    aria-pressed={activeLaneIndex === laneIdx}
                    className={`project-showcase__lane-tab${activeLaneIndex === laneIdx ? ' project-showcase__lane-tab--active' : ''}`}
                    data-magnetic
                    onClick={() => setActiveLaneIndex(laneIdx)}
                  >
                    <span className="project-showcase__lane-tab-index">0{laneIdx + 1}</span>
                    <span className="project-showcase__lane-tab-label">{lane.label}</span>
                  </button>
                ))}
              </div>

              {/* Active Layer Blueprint Display */}
              <div className="project-showcase__lane-display" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLane.label}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
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
