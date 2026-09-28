import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

import type { ContactMethod } from '../../types/portfolio'
import { Icon } from '../ui/Icon'
import { MotionReveal } from '../ui/MotionReveal'
import { useAmbientActivity } from '../../hooks/useAmbientActivity'

interface ContactSectionProps {
  contactMethods: ContactMethod[]
}

export function ContactSection({ contactMethods }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()
  const ambientActive = useAmbientActivity(sectionRef)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const routeProgress = useTransform(scrollYProgress, [0.05, 0.78], [0, 1])
  const finaleScale = useTransform(scrollYProgress, [0, 0.24, 0.68, 1], [0.88, 1, 1.04, 0.96])
  const finaleY = useTransform(scrollYProgress, [0, 0.35, 1], [36, 0, -48])

  return (
    <section ref={sectionRef} id="contact" className="contact-section" data-reduced={reduceMotion} data-ambient-active={ambientActive}>
      <svg className="contact-route" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
        <path className="contact-route__track" d="M1000 0 C1000 180 995 500 1000 620 C970 660 520 680 12 680" />
        <motion.path
          className="contact-route__signal"
          d="M1000 0 C1000 180 995 500 1000 620 C970 660 520 680 12 680"
          style={reduceMotion ? { pathLength: 1 } : { pathLength: routeProgress }}
        />
        <motion.circle
          className="contact-route__endpoint"
          cx="12"
          cy="680"
          r="8"
          style={reduceMotion ? undefined : { opacity: routeProgress }}
        />
      </svg>
      <MotionReveal className="contact-section__intro">
        <div className="section-intro__eyebrow">
          <span className="section-index">05</span>
          <p className="section-kicker">Contact</p>
        </div>
        <div className="contact-section__intro-grid">
          <motion.h2 className="section-heading contact-heading" style={reduceMotion ? undefined : { scale: finaleScale, y: finaleY }}>
            Bring me the <em>hard part.</em>
          </motion.h2>
          <div>
            <p className="contact-section__invitation">
              If you&apos;re building something that needs careful backend or applied AI work, I&apos;d like to hear about it.
            </p>
            <div className="contact-section__availability-banner">
              <span className="contact-section__status-beacon" aria-hidden="true" />
              <span>Warsaw, Poland / Remote — Open to internship &amp; junior engineering roles</span>
            </div>
          </div>
        </div>
      </MotionReveal>

      <div className="contact-section__layout">
        <div className="contact-section__links">
          {contactMethods.map((method, index) => {
            return (
              <MotionReveal
                key={method.label}
                className="contact-section__link-wrap"
                delay={0.14 + index * 0.08}
              >
                <a
                  className={`contact-section__link${index === 0 ? ' contact-section__link--featured' : ''}`}
                  href={method.href}
                  rel={method.href.startsWith('http') ? 'noreferrer' : undefined}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  data-magnetic
                  data-cursor="contact"
                  data-cursor-label={index === 0 ? 'WRITE' : 'CONNECT'}
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
