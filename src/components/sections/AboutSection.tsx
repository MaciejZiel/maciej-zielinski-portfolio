import { MotionReveal } from '../ui/MotionReveal'

interface AboutSectionProps {
  aboutPoints: string[]
  projectSignals: string[]
}

export function AboutSection({
  aboutPoints,
  projectSignals,
}: AboutSectionProps) {
  const pillarTitles = [
    'System Seams & Boundaries',
    'AI as a Controlled Runtime',
    'Practical Backend-First Tooling',
  ]

  return (
    <section id="about" className="manifesto-section">
      <MotionReveal className="manifesto-eyebrow">
        <span>Philosophy &amp; methodology</span>
      </MotionReveal>

      <MotionReveal className="manifesto-lead">
        <h2 className="manifesto-heading">
          I build <span className="manifesto-heading__highlight">backend-first</span> systems that still make product sense under real-world constraints.
        </h2>
      </MotionReveal>

      <div className="manifesto-grid">
        <MotionReveal className="manifesto-aside" delay={0.08}>
          <p className="manifesto-aside__statement">
            The work I enjoy most lives where APIs, AI capabilities, runtime
            constraints, and maintainable engineering all have to cooperate.
          </p>

          <div className="manifesto-signals">
            <span className="manifesto-signals__label">RECURRING ENGINEERING SIGNALS</span>
            <ul className="manifesto-signals__list">
              {projectSignals.map((signal, idx) => (
                <li key={signal}>
                  <span className="signal-marker" aria-hidden="true">0{idx + 1}</span>
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        </MotionReveal>

        <div className="manifesto-pillars">
          {aboutPoints.map((point, index) => (
            <MotionReveal
              key={point}
              className="manifesto-pillar"
              delay={0.12 + index * 0.08}
            >
              <div className="manifesto-pillar__head">
                <span className="manifesto-pillar__num">0{index + 1}</span>
                <span className="manifesto-pillar__title">{pillarTitles[index] ?? `Principle 0${index + 1}`}</span>
              </div>
              <p className="manifesto-pillar__text">{point}</p>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
