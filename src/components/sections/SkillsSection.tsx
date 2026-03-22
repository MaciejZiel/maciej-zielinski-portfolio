import type { SkillGroup } from '../../types/portfolio'
import { SectionIntro } from '../ui/SectionIntro'

interface SkillsSectionProps {
  skillGroups: SkillGroup[]
}

export function SkillsSection({ skillGroups }: SkillsSectionProps) {
  return (
    <section id="skills" className="section">
      <SectionIntro
        eyebrow="Tech Stack"
        title="Tools chosen for shipping backend systems and AI features."
        description="The stack reflects where I spend the most time: Python backends, API architecture, retrieval-oriented AI workflows, and the tooling needed to keep projects testable and deployable."
      />

      <div className="skills-grid">
        {skillGroups.map((group) => (
          <article key={group.title} className="skill-card">
            <p className="skill-card__title">{group.title}</p>
            <p className="skill-card__description">{group.description}</p>
            <ul className="skill-card__items">
              {group.items.map((item) => (
                <li key={item} className="skill-card__item">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
