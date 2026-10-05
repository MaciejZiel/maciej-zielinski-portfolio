import type { Profile } from '../../types/portfolio'
import { MotionReveal } from '../ui/MotionReveal'

interface AboutSectionProps {
  profile: Profile
}

const focusLabels = ['Systems', 'Applied AI', 'Building well']

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <MotionReveal className="about-section__heading">
        <p className="about-section__eyebrow">A little about me</p>
        <h2 id="about-title">I enjoy making complex software feel clear.</h2>
      </MotionReveal>

      <div className="about-section__body">
        <MotionReveal className="about-section__bio">
          <p className="about-section__summary">{profile.summary}</p>
          <p className="about-section__intro">{profile.intro}</p>
          <p className="about-section__availability">{profile.availability}</p>
          <p className="about-section__background">
            {profile.education} <span aria-hidden="true">/</span> {profile.location}
          </p>
        </MotionReveal>

        <div className="about-section__focus">
          {profile.focusAreas.map((area, index) => (
            <MotionReveal className="about-section__focus-item" key={area} delay={index * 0.06}>
              <span className="about-section__focus-label">{focusLabels[index] ?? 'Focus'}</span>
              <p>{area}</p>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
