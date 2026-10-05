import { projectHighlights } from '../../data/portfolio'
import { Icon } from '../ui/Icon'
import { MotionReveal } from '../ui/MotionReveal'

export function ProjectOverview() {
  return (
    <section id="project-overview" className="project-overview" aria-labelledby="project-overview-title">
      <MotionReveal className="project-overview__heading">
        <p className="project-overview__eyebrow">Selected work</p>
        <h2 id="project-overview-title">Five projects. Different problems. One way of thinking.</h2>
      </MotionReveal>

      <ol className="project-overview__list">
        {projectHighlights.map((project, index) => (
          <li key={project.name}>
            <a className="project-overview__link" href={`#${project.anchorId}`}>
              <span className="project-overview__index">0{index + 1}</span>
              <span className="project-overview__copy">
                <span className="project-overview__name">{project.name}</span>
                <span className="project-overview__description">{project.description}</span>
              </span>
              <Icon name="arrow-up-right" className="project-overview__arrow" />
            </a>
          </li>
        ))}
      </ol>

      <a className="project-overview__all" href="#projects">
        Read the full project stories <Icon name="arrow-up-right" />
      </a>
    </section>
  )
}
