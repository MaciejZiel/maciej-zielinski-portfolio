import type { ContactMethod } from '../../types/portfolio'
import { Icon } from '../ui/Icon'
import { MotionReveal } from '../ui/MotionReveal'

interface ContactSectionProps {
  contactMethods: ContactMethod[]
}

export function ContactSection({ contactMethods }: ContactSectionProps) {
  return (
    <section id="contact" className="contact-section" data-section-word="Contact">
      <MotionReveal className="contact-section__intro">
        <div className="section-intro__eyebrow">
          <span className="section-index">04</span>
          <p className="section-kicker">Contact</p>
        </div>
        <div className="contact-section__intro-grid">
          <h2 className="section-heading">
            If you are hiring for backend, Python, or applied AI work, let&apos;s
            talk.
          </h2>
        </div>
      </MotionReveal>

      <div className="contact-section__layout">
        <MotionReveal className="contact-section__lead" delay={0.08}>
          <p className="contact-section__lead-title">Contact</p>
        </MotionReveal>

        <div className="contact-section__links">
          {contactMethods.map((method, index) => (
            <MotionReveal
              key={method.label}
              className="contact-section__link-wrap"
              delay={0.14 + index * 0.08}
            >
              <a
                className="contact-section__link"
                href={method.href}
                rel={method.href.startsWith('http') ? 'noreferrer' : undefined}
                target={method.href.startsWith('http') ? '_blank' : undefined}
              >
                <span className="contact-section__link-index">0{index + 1}</span>
                <span className="contact-section__link-meta">
                  <span className="contact-section__link-label">
                    {method.label}
                  </span>
                  <span className="contact-section__link-value">
                    {method.value}
                  </span>
                </span>
                <span className="contact-section__link-icon">
                  <Icon name={method.icon} className="contact-section__icon-svg" />
                </span>
              </a>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
