import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useRef } from 'react'

import type { FeaturedProject } from '../../types/portfolio'
import { Icon } from '../ui/Icon'
import { MotionReveal } from '../ui/MotionReveal'
import { TagList } from '../ui/TagList'

interface ProjectShowcaseProps {
  index: number
  project: FeaturedProject
}

export function ProjectShowcase({ index, project }: ProjectShowcaseProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const hasCompactName = project.name.length > 20
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const stageY = useTransform(scrollYProgress, [0, 1], [20, -20])
  const railScale = useTransform(scrollYProgress, [0, 0.18, 0.5, 0.82, 1], [0.88, 1, 1.12, 1, 0.88])
  const railOpacity = useTransform(scrollYProgress, [0, 0.16, 0.5, 0.84, 1], [0.36, 0.72, 1, 0.72, 0.36])
  const contentScale = useTransform(scrollYProgress, [0, 0.18, 0.5, 0.82, 1], [0.985, 1, 1.012, 1, 0.985])
  const artifactScale = useTransform(scrollYProgress, [0, 0.18, 0.5, 0.82, 1], [0.97, 1, 1.016, 1, 0.97])
  const artifactOpacity = useTransform(scrollYProgress, [0, 0.16, 0.5, 0.84, 1], [0.74, 0.92, 1, 0.92, 0.74])

  return (
    <article
      ref={sectionRef}
      className={`project-showcase project-showcase--${project.theme}`}
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

      <div className="project-showcase__body">
        <MotionReveal
          className="project-showcase__content"
          style={reduceMotion ? undefined : { scale: contentScale }}
        >
          <div className="project-showcase__meta">
            <p className="project-showcase__category">{project.category}</p>
            <p className="project-showcase__status">{project.status}</p>
          </div>

          <h3
            className={`project-showcase__name${hasCompactName ? ' project-showcase__name--compact' : ''}`}
          >
            {project.name}
          </h3>
          <p className="project-showcase__headline">{project.headline}</p>
          <div className="project-showcase__spotlight">
            <p className="project-showcase__spotlight-label">Why it matters</p>
            <p className="project-showcase__spotlight-copy">{project.outcome}</p>
          </div>
          <p className="project-showcase__context">{project.context}</p>

          <div className="project-showcase__narrative">
            <div className="project-showcase__narrative-block">
              <p className="project-showcase__narrative-label">Overview</p>
              <p className="project-showcase__summary">{project.summary}</p>
            </div>

            <div className="project-showcase__narrative-block">
              <p className="project-showcase__narrative-label">Challenge</p>
              <p className="project-showcase__summary">{project.challenge}</p>
            </div>
          </div>

          <div className="project-showcase__overview">
            <dl className="project-showcase__metrics">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="project-showcase__metric">
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="project-showcase__details">
              {project.details.map((detail) => (
                <li key={detail} className="project-showcase__detail">
                  <span className="project-showcase__detail-mark" aria-hidden="true" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

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
          style={
            reduceMotion
              ? undefined
              : { y: stageY, scale: artifactScale, opacity: artifactOpacity }
          }
        >
          <div className="project-showcase__artifact-frame">
            <div className="project-showcase__artifact-window" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <div className="project-showcase__stage-topline">
              <span>{project.stageLabel}</span>
              <span>{project.year}</span>
            </div>

            <div className="project-showcase__artifact-header">
              <p className="project-showcase__artifact-label">System snapshot</p>
              <h4 className="project-showcase__artifact-title">
                {project.artifactTitle}
              </h4>
              <p className="project-showcase__artifact-summary">
                {project.artifactSummary}
              </p>
            </div>

            <div className="project-showcase__artifact-lanes">
              {project.artifactLanes.map((lane, artifactIndex) => (
                <section
                  key={lane.label}
                  className="project-showcase__artifact-lane"
                >
                  <div className="project-showcase__artifact-lane-head">
                    <span className="project-showcase__artifact-lane-index">
                      0{artifactIndex + 1}
                    </span>
                    <div>
                      <p className="project-showcase__artifact-lane-label">
                        {lane.label}
                      </p>
                      <p className="project-showcase__artifact-lane-summary">
                        {lane.summary}
                      </p>
                    </div>
                  </div>

                  <ul className="project-showcase__artifact-lane-list">
                    {lane.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </article>
  )
}
