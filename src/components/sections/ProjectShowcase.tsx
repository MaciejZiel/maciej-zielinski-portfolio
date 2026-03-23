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
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const stageY = useTransform(scrollYProgress, [0, 1], [80, -90])
  const stageRotate = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? -5 : 5, index % 2 === 0 ? 3 : -3],
  )
  const contentY = useTransform(scrollYProgress, [0, 1], [34, -24])
  const auraScale = useTransform(scrollYProgress, [0, 1], [0.92, 1.08])

  return (
    <article
      ref={sectionRef}
      className={`project-showcase project-showcase--${project.theme}${index % 2 === 1 ? ' project-showcase--reverse' : ''}`}
    >
      <MotionReveal className="project-showcase__rail" delay={0.04}>
        <p className="project-showcase__rail-index">0{index + 1}</p>
        <div className="project-showcase__rail-copy">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
      </MotionReveal>

      <div className="project-showcase__body">
        <motion.div
          className="project-showcase__content-wrap"
          style={reduceMotion ? undefined : { y: contentY }}
        >
          <MotionReveal className="project-showcase__content">
            <div className="project-showcase__heading-backdrop" aria-hidden="true">
              {project.name}
            </div>
            <div className="project-showcase__meta">
              <p className="project-showcase__category">{project.stageLabel}</p>
              <p className="project-showcase__status">{project.status}</p>
            </div>

            <h3 className="project-showcase__name">{project.name}</h3>
            <p className="project-showcase__headline">{project.headline}</p>

            <div className="project-showcase__overview">
              <p className="project-showcase__summary">{project.summary}</p>

              <dl className="project-showcase__metrics">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="project-showcase__metric">
                    <dt>{metric.label}</dt>
                    <dd>{metric.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <ul className="project-showcase__details">
              {project.details.map((detail) => (
                <li key={detail} className="project-showcase__detail">
                  <span className="project-showcase__detail-mark" aria-hidden="true" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>

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
        </motion.div>

        <motion.div
          className="project-showcase__stage"
          style={
            reduceMotion
              ? undefined
              : { y: stageY, rotate: stageRotate }
          }
        >
          <motion.div
            aria-hidden="true"
            className="project-showcase__aura"
            style={reduceMotion ? undefined : { scale: auraScale }}
          />
          <div className="project-showcase__stage-frame">
            <div className="project-showcase__stage-topline">
              <span>{project.stageLabel}</span>
              <span>{project.year}</span>
            </div>

            <div className="project-showcase__stage-word" aria-hidden="true">
              {project.name}
            </div>

            <div className="project-showcase__stage-core">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="project-showcase__stage-metric">
                  <p>{metric.label}</p>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>

            <div className="project-showcase__stage-stack">
              {project.technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>

            <div className="project-showcase__stage-grid" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </motion.div>
      </div>
    </article>
  )
}
