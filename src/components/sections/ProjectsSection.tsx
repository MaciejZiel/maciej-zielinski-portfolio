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
    >
      <MotionReveal className="projects-section__intro">
        <div className="section-intro__eyebrow">
          <span className="section-index">03 // SELECTED CASE STUDIES</span>
          <span className="section-bracket">[ PRODUCTION ARCHITECTURES ]</span>
        </div>
        <div className="projects-section__intro-grid">
          <h2 className="section-heading">
            Built closer to products than coursework.
          </h2>
          <div className="projects-section__intro-copy">
            <p className="section-copy">
              CaseFlow sits first because it reflects systems-level thinking:
              multi-tenant policy boundaries, deterministic state machines, and auditable event dispatching.
            </p>
            <p className="projects-section__intro-note">
              Followed by audio processing pipelines, live computer vision streaming, and strict domain API contracts.
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
              data-cursor-label="OPEN PROJECT"
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
