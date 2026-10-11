import type { FeaturedProject, ProjectRailItem } from '../../types/portfolio'
import { projectDisplayName } from '../../data/portfolio'
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
    <section
      id="projects"
      className="projects-section"
    >
      <MotionReveal className="projects-section__intro">
        <div className="section-intro__eyebrow">
          <span>Selected work</span>
        </div>
        <div className="projects-section__intro-grid">
          <h2 className="section-heading">
            Five projects, each built around a different problem.
          </h2>
          <div className="projects-section__intro-copy">
            <p className="section-copy">
              A closer look at the decisions, engineering, and details behind each one.
            </p>
          </div>
        </div>
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
            <a
              key={item.name}
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
          ))}
        </div>
      </MotionReveal>
    </section>
  )
}
