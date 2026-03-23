import type { SkillLane } from '../../types/portfolio'
import { MotionReveal } from '../ui/MotionReveal'

interface SkillsSectionProps {
  skillLanes: SkillLane[]
}

export function SkillsSection({ skillLanes }: SkillsSectionProps) {
  return (
    <section id="skills" className="skills-section">
      <MotionReveal className="skills-section__intro">
        <p className="section-kicker">Stack</p>
        <div className="skills-section__intro-grid">
          <h2 className="section-heading">
            The tools are chosen for systems work, not for looking trendy on a
            portfolio.
          </h2>
          <p className="skills-section__intro-note">
            Grouped by the layers I reach for most often: backend foundations,
            applied AI, deployment tooling, and supporting engineering
            utilities.
          </p>
        </div>
      </MotionReveal>

      <div className="skills-section__lanes">
        {skillLanes.map((lane, index) => (
          <MotionReveal
            key={lane.label}
            className="skill-lane"
            delay={0.08 + index * 0.08}
          >
            <div className="skill-lane__header">
              <p className="skill-lane__label">{lane.label}</p>
              <p className="skill-lane__summary">{lane.summary}</p>
            </div>

            <div className="skill-lane__items">
              {lane.items.map((item) => (
                <span key={item} className="skill-lane__item">
                  {item}
                </span>
              ))}
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  )
}
