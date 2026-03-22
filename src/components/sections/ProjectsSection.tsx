import type { Project } from '../../types/portfolio'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { SectionIntro } from '../ui/SectionIntro'
import { TagList } from '../ui/TagList'

interface ProjectsSectionProps {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="section projects-section">
      <Reveal delay={40}>
        <SectionIntro
          eyebrow="Featured Projects"
          title="Projects that emphasize backend depth and applied AI."
          description="Each project is framed around real engineering concerns: architecture, auth, data flow, testing, operational edges, and the practical limits of AI systems in production-like workflows."
        />
      </Reveal>

      <div className="projects-grid projects-grid--editorial">
        {projects.map((project, index) => (
          <Reveal
            key={project.name}
            as="article"
            className={`project-card${project.featured ? ' project-card--featured' : ''}`}
            delay={120 + index * 90}
          >
            <div className="project-card__header">
              <div className="project-card__heading-group">
                <div className="project-card__topline">
                  <p className="project-card__category">{project.category}</p>
                  <p className="project-card__index">0{index + 1}</p>
                </div>
                <h3 className="project-card__title">{project.name}</h3>
              </div>

              <a
                className="project-card__link"
                href={project.repositoryUrl}
                rel="noreferrer"
                target="_blank"
              >
                <span>{project.repositoryLabel}</span>
                <Icon name="arrow-up-right" className="project-card__link-icon" />
              </a>
            </div>

            <p className="project-card__description">{project.description}</p>

            <ul className="project-card__highlights">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="project-card__highlight">
                  <span className="project-card__highlight-dot" aria-hidden="true" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="project-card__footer">
              <TagList items={project.technologies} />
              {project.repositoryNote ? (
                <p className="project-card__note">{project.repositoryNote}</p>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
