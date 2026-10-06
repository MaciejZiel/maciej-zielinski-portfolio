import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import { useRef, useState } from 'react'

import type { FeaturedProject } from '../../types/portfolio'
import { projectAnchorId, projectDisplayName } from '../../data/portfolio'
import { Icon } from '../ui/Icon'
import { MotionReveal } from '../ui/MotionReveal'
import { ProjectDiagram } from './ProjectDiagram'
import { TagList } from '../ui/TagList'

const disclosureMotions = new WeakMap<HTMLElement, Animation>()

interface ProjectShowcaseProps {
  index: number
  project: FeaturedProject
}

export function ProjectShowcase({ index, project }: ProjectShowcaseProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeLaneIndex, setActiveLaneIndex] = useState(0)
  const displayName = projectDisplayName(project.name)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const stageY = useTransform(scrollYProgress, [0, 1], [16, -16])
  const railScale = useTransform(scrollYProgress, [0, 0.18, 0.5, 0.82, 1], [0.88, 1, 1.1, 1, 0.88])
  const railOpacity = useTransform(scrollYProgress, [0, 0.16, 0.5, 0.84, 1], [0.4, 0.75, 1, 0.75, 0.4])
  const activeLane = project.artifactLanes[activeLaneIndex] ?? project.artifactLanes[0]

  return (
    <article
      ref={sectionRef}
      id={projectAnchorId(project.name)}
      className={`project-showcase project-showcase--${project.theme}`}
      data-chapter={project.theme}
      data-atmosphere={project.visualization === 'flight-route' ? 'flights' : undefined}
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
                className="project-showcase__name"
                aria-label={displayName}
              >
                {displayName}
              </h3>
              <p className="project-showcase__headline">{project.headline}</p>
            </div>

            <div className="project-showcase__spotlight">
              <span className="project-showcase__spotlight-label">The through-line</span>
              <p className="project-showcase__spotlight-copy">{project.outcome}</p>
            </div>

            <details
              className="project-showcase__deep-dive"
              onToggle={(event) => {
                const details = event.currentTarget
                const mark = details.querySelector<HTMLElement>('summary span:last-child')
                if (!mark) return
                disclosureMotions.get(mark)?.cancel()
                if (reduceMotion || typeof mark.animate !== 'function') return

                const animation = mark.animate(
                  details.open
                    ? [
                        { transform: 'rotate(0deg) scale(1)' },
                        { transform: 'rotate(228deg) scale(1.12)', offset: 0.68 },
                        { transform: 'rotate(405deg) scale(1)' },
                      ]
                    : [
                        { transform: 'rotate(45deg) scale(1)' },
                        { transform: 'rotate(-18deg) scale(.84)', offset: 0.56 },
                        { transform: 'rotate(0deg) scale(1)' },
                      ],
                  {
                    duration: details.open ? 560 : 390,
                    easing: 'cubic-bezier(.2,.8,.25,1)',
                  },
                )
                disclosureMotions.set(mark, animation)
                animation.onfinish = () => {
                  if (disclosureMotions.get(mark) === animation) disclosureMotions.delete(mark)
                }
              }}
            >
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
