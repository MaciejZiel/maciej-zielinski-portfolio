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
  const stageY = useTransform(scrollYProgress, [0, 1], [68, -56])
  const stageRotate = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? -1.8 : 1.8, index % 2 === 0 ? 1.8 : -1.8],
  )
  const contentY = useTransform(scrollYProgress, [0, 1], [22, -18])

  return (
    <article
      ref={sectionRef}
      className={`project-showcase project-showcase--${project.theme}${index === 0 ? ' project-showcase--flagship' : ''}${index % 2 === 1 ? ' project-showcase--reverse' : ''}`}
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
              <p className="project-showcase__category">{project.category}</p>
              <p className="project-showcase__status">{project.status}</p>
            </div>

            <h3 className="project-showcase__name">{project.name}</h3>
            <p className="project-showcase__headline">{project.headline}</p>
            <p className="project-showcase__context">{project.context}</p>

            <div className="project-showcase__narrative">
              <div className="project-showcase__narrative-block">
                <p className="project-showcase__narrative-label">What it is</p>
                <p className="project-showcase__summary">{project.summary}</p>
              </div>

              <div className="project-showcase__narrative-block">
                <p className="project-showcase__narrative-label">
                  Engineering challenge
                </p>
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
        </motion.div>

        <motion.div
          className="project-showcase__artifact"
          style={
            reduceMotion
              ? undefined
              : { y: stageY, rotate: stageRotate }
          }
        >
          <div className="project-showcase__artifact-frame">
            <div className="project-showcase__stage-topline">
              <span>{project.stageLabel}</span>
              <span>{project.year}</span>
            </div>

            <div className="project-showcase__artifact-header">
              <p className="project-showcase__artifact-label">System map</p>
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

            <p className="project-showcase__artifact-outcome">{project.outcome}</p>
          </div>
        </motion.div>
      </div>
    </article>
  )
}
