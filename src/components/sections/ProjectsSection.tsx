import type { FeaturedProject, ProjectRailItem, SelfHostedDemos } from '../../types/portfolio'
import { projectDisplayName } from '../../data/portfolio'
import { Icon } from '../ui/Icon'
import { MotionReveal } from '../ui/MotionReveal'
import { ProjectShowcase } from './ProjectShowcase'

interface ProjectsSectionProps {
  featuredProjects: FeaturedProject[]
  projectRail: ProjectRailItem[]
  selfHostedDemos: SelfHostedDemos
}

export function ProjectsSection({
  featuredProjects,
  projectRail,
  selfHostedDemos,
}: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="projects-section"
    >
      <MotionReveal className="projects-section__intro">
        <div className="section-intro__eyebrow">
          <span>Selected work</span>
        </div>
        <h2 className="section-heading projects-section__heading">
          Five projects, each built around a different problem.
        </h2>
      </MotionReveal>

      <div className="projects-section__list">
        {featuredProjects.map((project, index) => (
          <ProjectShowcase key={project.name} index={index} project={project} />
        ))}
      </div>

      <MotionReveal className="projects-rail" delay={0.08}>
        <div className="projects-rail__intro">
          <p className="projects-rail__label">More from GitHub</p>
          <p className="projects-rail__copy">
            Smaller public projects and experiments that still feed into how I
            design backend and AI systems.
          </p>
        </div>

        <div className="projects-rail__items">
          {projectRail.map((item, index) => (
            <div key={item.name} className="projects-rail__entry">
              <a
                className="projects-rail__item"
                href={item.href}
                rel="noreferrer"
                target="_blank"
                data-magnetic
              >
                <span className="projects-rail__item-index">0{index + 1}</span>
                <span className="projects-rail__item-body">
                  <span className="projects-rail__item-name">{projectDisplayName(item.name)}</span>
                  <span className="projects-rail__item-description">
                    {item.description}
                  </span>
                </span>
              </a>
              {item.liveDemoUrl ? (
                <a
                  className="projects-rail__live"
                  href={item.liveDemoUrl}
                  rel="noreferrer"
                  target="_blank"
                  aria-label={`Try ${item.name.replaceAll('_', ' ')} live (opens in a new tab)`}
                >
                  <span className="project-showcase__live-dot" aria-hidden="true" />
                  <span>Try it live</span>
                  <Icon name="arrow-up-right" className="projects-rail__live-icon" />
                </a>
              ) : null}
            </div>
          ))}
        </div>

        <p className="projects-rail__demos">
          <span>{selfHostedDemos.label}</span>
          <span aria-hidden="true"> · </span>
          <a
            href={selfHostedDemos.statusUrl}
            rel="noreferrer"
            target="_blank"
            aria-label={`System status page for the self-hosted demos (opens in a new tab)`}
          >
            {selfHostedDemos.statusLabel}
          </a>
        </p>
      </MotionReveal>
    </section>
  )
}
