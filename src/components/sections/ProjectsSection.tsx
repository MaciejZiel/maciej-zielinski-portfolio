import type { FeaturedProject, ProjectRailItem } from '../../types/portfolio'
import { MotionReveal } from '../ui/MotionReveal'
import { ProjectShowcase } from './ProjectShowcase'

interface ProjectsSectionProps {
  featuredProjects: FeaturedProject[]
  projectRail: ProjectRailItem[]
}

export function ProjectsSection({
  featuredProjects,
  projectRail,
}: ProjectsSectionProps) {
  return (
    <section id="projects" className="projects-section">
      <MotionReveal className="projects-section__intro">
        <p className="section-kicker">Selected Work</p>
        <h2 className="section-heading">
          A few projects that best show how I think about systems, not just
          screens.
        </h2>
        <p className="section-copy">
          The strongest work here is not arranged as small cards. It is shown as
          systems with architecture, runtime behavior, and engineering tradeoffs.
        </p>
      </MotionReveal>

      <div className="projects-section__list">
        {featuredProjects.map((project, index) => (
          <ProjectShowcase key={project.name} index={index} project={project} />
        ))}
      </div>

      <MotionReveal className="projects-rail" delay={0.08}>
        <div className="projects-rail__intro">
          <p className="projects-rail__label">Additional public builds</p>
          <p className="projects-rail__copy">
            More recent experiments and side systems from GitHub that still feed
            into how I build backend and AI products.
          </p>
        </div>

        <div className="projects-rail__items">
          {projectRail.map((item) => (
            <a
              key={item.name}
              className="projects-rail__item"
              href={item.href}
              rel="noreferrer"
              target="_blank"
            >
              <span className="projects-rail__item-name">{item.name}</span>
              <span className="projects-rail__item-description">
                {item.description}
              </span>
            </a>
          ))}
        </div>
      </MotionReveal>
    </section>
  )
}
