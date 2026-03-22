import { motion, useScroll, useSpring } from 'framer-motion'

import { SiteHeader } from './components/layout/SiteHeader'
import { AboutSection } from './components/sections/AboutSection'
import { ContactSection } from './components/sections/ContactSection'
import { HeroSection } from './components/sections/HeroSection'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { SkillsSection } from './components/sections/SkillsSection'
import {
  aboutPoints,
  contactMethods,
  featuredProjects,
  navigationItems,
  profile,
  projectRail,
  projectSignals,
  skillLanes,
} from './data/portfolio'
import './styles/app.css'

function App() {
  const { scrollYProgress } = useScroll()
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.22,
  })

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="site-shell">
        <motion.div
          aria-hidden="true"
          className="scroll-progress"
          style={{ scaleX: progressScaleX }}
        />
        <div
          className="site-shell__glow site-shell__glow--primary"
          aria-hidden="true"
        />
        <div
          className="site-shell__glow site-shell__glow--secondary"
          aria-hidden="true"
        />

        <SiteHeader
          name={profile.name}
          headline={profile.headline}
          navigationItems={navigationItems}
          socialLinks={profile.socialLinks}
        />

        <main id="main-content" className="main-content">
          <HeroSection profile={profile} />
          <AboutSection
            aboutPoints={aboutPoints}
            projectSignals={projectSignals}
          />
          <ProjectsSection
            featuredProjects={featuredProjects}
            projectRail={projectRail}
          />
          <SkillsSection skillLanes={skillLanes} />
          <ContactSection contactMethods={contactMethods} />
        </main>

        <footer className="site-footer">
          <p>Maciej Zieliński</p>
          <p>Built with React, TypeScript, and Vite. Ready for Cloudflare Pages.</p>
        </footer>
      </div>
    </>
  )
}

export default App
