import type { ContactMethod } from '../../types/portfolio'
import { Icon } from '../ui/Icon'
import { MotionReveal } from '../ui/MotionReveal'

interface ContactSectionProps {
  contactMethods: ContactMethod[]
}

export function ContactSection({ contactMethods }: ContactSectionProps) {
  return (
    <section id="contact" className="contact-section">
      <MotionReveal className="contact-section__intro">
        <p className="section-kicker">Contact</p>
        <h2 className="section-heading">
          If you need someone who cares about backend fundamentals and can also
          work comfortably with AI-heavy product surfaces, I am interested.
        </h2>
      </MotionReveal>

      <div className="contact-section__layout">
        <MotionReveal className="contact-section__lead" delay={0.08}>
          <p className="contact-section__lead-copy">
            Best fit: backend engineering, Python services, API development, and
            applied AI systems with real constraints.
          </p>
          <a
            className="contact-section__email"
            href="mailto:zielinski.macio@gmail.com"
          >
            zielinski.macio@gmail.com
          </a>
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
