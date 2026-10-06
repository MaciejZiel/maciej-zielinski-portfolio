import { MotionConfig, useScroll } from 'framer-motion'

import { SiteHeader } from './components/layout/SiteHeader'
import { AboutSection } from './components/sections/AboutSection'
import { ContactSection } from './components/sections/ContactSection'
import { HeroSection } from './components/sections/HeroSection'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { SkillsSection } from './components/sections/SkillsSection'
import { ExperienceLayer } from './components/ui/ExperienceLayer'
import {
  contactMethods,
  featuredProjects,
  navigationItems,
  profile,
  projectRail,
  skillLanes,
} from './data/portfolio'
import './styles/app.css'
import './styles/content-structure.css'

function App() {
  return <PortfolioExperience />
}

function PortfolioExperience() {
  const { scrollY, scrollYProgress } = useScroll()

  return (
    <MotionConfig reducedMotion="user">
      <>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>

        <div className="site-shell">
          <ExperienceLayer scrollYProgress={scrollYProgress} />
          <SiteHeader
            name={profile.name}
            headline={profile.headline}
            navigationItems={navigationItems}
            socialLinks={profile.socialLinks}
            scrollY={scrollY}
          />
          <main id="main-content" className="main-content">
            <HeroSection profile={profile} />
            <AboutSection profile={profile} />
            <ProjectsSection
              featuredProjects={featuredProjects}
              projectRail={projectRail}
            />
            <SkillsSection skillLanes={skillLanes} />
            <ContactSection contactMethods={contactMethods} />
          </main>

          <footer className="site-footer">
            <p>{profile.name}</p>
            <p>Software engineering across Python, applied AI, and real-time data.</p>
          </footer>
        </div>
      </>
    </MotionConfig>
  )
}

export default App
