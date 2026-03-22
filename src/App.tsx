import { SiteHeader } from './components/layout/SiteHeader'
import { AboutSection } from './components/sections/AboutSection'
import { ContactSection } from './components/sections/ContactSection'
import { HeroSection } from './components/sections/HeroSection'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { SkillsSection } from './components/sections/SkillsSection'
import {
  aboutPoints,
  contactMethods,
  navigationItems,
  profile,
  projectSignals,
  projects,
  skillGroups,
} from './data/portfolio'
import './styles/app.css'

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="site-shell">
        <div className="site-shell__glow site-shell__glow--primary" aria-hidden="true" />
        <div className="site-shell__glow site-shell__glow--secondary" aria-hidden="true" />

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
          <ProjectsSection projects={projects} />
          <SkillsSection skillGroups={skillGroups} />
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
