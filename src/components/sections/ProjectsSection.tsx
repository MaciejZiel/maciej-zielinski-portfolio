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
        <p className="section-kicker">Selected Systems</p>
        <div className="projects-section__intro-grid">
          <h2 className="section-heading">
            Three builds that best show how I handle backend architecture, AI
            orchestration, and production-minded API design.
          </h2>
          <div className="projects-section__intro-copy">
            <p className="section-copy">
              CaseFlow sits first because it is the strongest signal of how I
              think about system boundaries, workflow state, and operational
              behavior.
            </p>
            <p className="projects-section__intro-note">
              The rest extends that pattern into applied AI, realtime
              inference, and domain-heavy API work.
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
          <p className="projects-rail__label">Additional public builds</p>
          <p className="projects-rail__copy">
            More recent experiments and side systems from GitHub that still feed
            into how I build backend and AI products.
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
