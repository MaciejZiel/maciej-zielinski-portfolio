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
    <section
      id="projects"
      className="projects-section"
      data-section-word="Work"
    >
      <MotionReveal className="projects-section__intro">
        <div className="section-intro__eyebrow">
          <span className="section-index">02</span>
          <p className="section-kicker">Selected Work</p>
        </div>
        <div className="projects-section__intro-grid">
          <h2 className="section-heading">
            Projects that best show how I build backend-heavy products and
            practical AI tools.
          </h2>
          <div className="projects-section__intro-copy">
            <p className="section-copy">
              CaseFlow sits first because it says the most about how I think:
              clear boundaries, explicit workflow state, and predictable
              operational behavior.
            </p>
            <p className="projects-section__intro-note">
              The rest extends that same mindset into transcription, computer
              vision, and domain-heavy API work.
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
            >
              <span className="projects-rail__item-index">0{index + 1}</span>
              <span className="projects-rail__item-body">
                <span className="projects-rail__item-name">{item.name}</span>
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
