import { SectionIntro } from '../ui/SectionIntro'
import { Reveal } from '../ui/Reveal'

interface AboutSectionProps {
  aboutPoints: string[]
  projectSignals: string[]
}

export function AboutSection({
  aboutPoints,
  projectSignals,
}: AboutSectionProps) {
  return (
    <section id="about" className="section about-section">
      <Reveal delay={40}>
        <SectionIntro
          eyebrow="About"
          title="Backend-focused, practical, and systems-oriented."
          description="I am a Computer Science student focused on Python backend development and AI systems that solve concrete problems. The work I care about most lives where product needs, implementation details, and operational reliability meet."
        />
      </Reveal>

      <div className="about-grid">
        <Reveal className="content-card content-card--story" delay={120}>
          {aboutPoints.map((point) => (
            <p key={point} className="content-card__paragraph">
              {point}
            </p>
          ))}
        </Reveal>

        <Reveal className="content-card content-card--signals" delay={220}>
          <p className="content-card__eyebrow">What shows up in my projects</p>
          <ul className="signal-list">
            {projectSignals.map((signal, index) => (
              <li key={signal} className="signal-list__item">
                <span className="signal-list__index">0{index + 1}</span>
                <span>{signal}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
