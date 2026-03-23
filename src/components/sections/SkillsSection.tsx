import type { SkillLane } from '../../types/portfolio'
import { MotionReveal } from '../ui/MotionReveal'

interface SkillsSectionProps {
  skillLanes: SkillLane[]
}

export function SkillsSection({ skillLanes }: SkillsSectionProps) {
  return (
    <section id="skills" className="skills-section" data-section-word="Stack">
      <MotionReveal className="skills-section__intro">
        <div className="section-intro__eyebrow">
          <span className="section-index">03</span>
          <p className="section-kicker">Toolbox</p>
        </div>
        <div className="skills-section__intro-grid">
          <h2 className="section-heading">
            Tools I actually use when building backend and AI projects.
          </h2>
          <p className="skills-section__intro-note">
            Grouped by the layers I reach for most often, from backend
            foundations through AI workflows to delivery tooling.
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
