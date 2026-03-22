import type { SkillGroup } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'
import { SectionIntro } from '../ui/SectionIntro'

interface SkillsSectionProps {
  skillGroups: SkillGroup[]
}

export function SkillsSection({ skillGroups }: SkillsSectionProps) {
  return (
    <section id="skills" className="section">
      <Reveal delay={40}>
        <SectionIntro
          eyebrow="Tech Stack"
          title="Tools chosen for shipping backend systems and AI features."
          description="The stack reflects where I spend the most time: Python backends, API architecture, retrieval-oriented AI workflows, and the tooling needed to keep projects testable and deployable."
        />
      </Reveal>

      <div className="skills-grid">
        {skillGroups.map((group, index) => (
          <Reveal
            key={group.title}
            as="article"
            className="skill-card"
            delay={120 + index * 80}
          >
            <p className="skill-card__title">{group.title}</p>
            <p className="skill-card__description">{group.description}</p>
            <ul className="skill-card__items">
              {group.items.map((item) => (
                <li key={item} className="skill-card__item">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
