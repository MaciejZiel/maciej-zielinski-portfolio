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
    <section id="about" className="about-section" data-section-word="About">
      <MotionReveal className="about-section__intro">
        <div className="section-intro__eyebrow">
          <span className="section-index">01</span>
          <p className="section-kicker">About</p>
        </div>
        <div className="about-section__intro-grid">
          <h2 className="section-heading">
            I build backend-first systems that still make product sense under
            real constraints.
          </h2>
          <p className="about-section__intro-note">
            Computer Science student in Warsaw, focused on backend, Python, and
            applied AI roles where engineering quality matters.
          </p>
        </div>
      </MotionReveal>

      <div className="about-section__layout">
        <MotionReveal className="about-section__statement" delay={0.08}>
          <p>
            The work I enjoy most lives where APIs, AI capabilities, runtime
            constraints, and maintainable engineering all have to cooperate.
          </p>
          <div className="about-section__signals">
            <p className="about-section__signals-label">
              What shows up across the projects
            </p>
            <ul className="about-section__signals-list">
              {projectSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </div>
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
    </section>
  )
}
