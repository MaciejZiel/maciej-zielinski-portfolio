import type { ContactMethod } from '../../types/portfolio'
import { Icon } from '../ui/Icon'
import { SectionIntro } from '../ui/SectionIntro'

interface ContactSectionProps {
  contactMethods: ContactMethod[]
}

export function ContactSection({ contactMethods }: ContactSectionProps) {
  return (
    <section id="contact" className="section">
      <SectionIntro
        eyebrow="Contact"
        title="Open to backend and AI engineering conversations."
        description="If you are hiring for a backend, Python, or applied AI internship or junior role, I am interested in teams where engineering quality and practical problem-solving matter."
      />

      <div className="contact-grid">
        <div className="contact-card">
          <p className="contact-card__eyebrow">Best fit</p>
          <p className="contact-card__headline">
            Backend engineering, Python services, API development, and practical
            AI systems.
          </p>
          <p className="contact-card__copy">
            I am especially interested in roles where I can deepen backend
            fundamentals, contribute to production-quality systems, and work on
            AI features with clear engineering constraints.
          </p>
        </div>

        <div className="contact-links" role="list" aria-label="Contact methods">
          {contactMethods.map((method) => (
            <a
              key={method.label}
              className="contact-link"
              href={method.href}
              rel={method.href.startsWith('http') ? 'noreferrer' : undefined}
              target={method.href.startsWith('http') ? '_blank' : undefined}
            >
              <span className="contact-link__meta">
                <span className="contact-link__icon">
                  <Icon name={method.icon} className="contact-link__icon-svg" />
                </span>
                <span>
                  <span className="contact-link__label">{method.label}</span>
                  <span className="contact-link__value">{method.value}</span>
                </span>
              </span>
              <Icon name="arrow-up-right" className="contact-link__arrow" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
