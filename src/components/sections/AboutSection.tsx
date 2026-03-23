import { MotionReveal } from '../ui/MotionReveal'

interface AboutSectionProps {
  aboutPoints: string[]
  projectSignals: string[]
}

export function AboutSection({
  aboutPoints,
  projectSignals,
}: AboutSectionProps) {
  return (
    <section id="about" className="about-section">
      <MotionReveal className="about-section__intro">
        <p className="section-kicker">About</p>
        <div className="about-section__intro-grid">
          <h2 className="section-heading">
            I build backend-first systems that still make product sense under
            real constraints.
          </h2>
          <p className="about-section__intro-note">
            Computer Science student in Warsaw, targeting backend, Python, and
            applied AI internship or junior roles.
          </p>
        </div>
      </MotionReveal>

      <div className="about-section__layout">
        <MotionReveal className="about-section__statement" delay={0.08}>
          <p>
            The work I enjoy most lives where APIs, AI capabilities, runtime
            constraints, and maintainable engineering all have to cooperate.
          </p>
        </MotionReveal>

        <div className="about-section__body">
          {aboutPoints.map((point, index) => (
            <MotionReveal
              key={point}
              className="about-section__paragraph"
              delay={0.12 + index * 0.08}
            >
              <span className="about-section__paragraph-index">0{index + 1}</span>
              <p>{point}</p>
            </MotionReveal>
          ))}
        </div>
      </div>

      <MotionReveal className="about-section__signals" delay={0.18}>
        <p className="about-section__signals-label">What stands out in the work</p>
        <ul className="about-section__signals-list">
          {projectSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </MotionReveal>
    </section>
  )
}
