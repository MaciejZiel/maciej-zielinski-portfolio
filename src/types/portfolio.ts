export type ButtonVariant = 'primary' | 'secondary' | 'text'

export type IconName = 'arrow-up-right' | 'github' | 'linkedin' | 'mail'

export interface NavigationItem {
  label: string
  href: string
}

export interface ActionLink {
  label: string
  href: string
  icon?: IconName
  variant?: ButtonVariant
  external?: boolean
}

export interface HeroDetail {
  label: string
  value: string
}

export interface ArtifactLane {
  label: string
  summary: string
  items: string[]
}

export interface Profile {
  name: string
  headline: string
  intro: string
  summary: string
  availability: string
  location: string
  education: string
  focusAreas: string[]
  heroLinks: ActionLink[]
  socialLinks: ActionLink[]
  details: HeroDetail[]
  heroRibbon: string[]
  heroArtifactTitle: string
  heroArtifactSummary: string
  heroArtifactLanes: ArtifactLane[]
}

export interface ProjectMetric {
  label: string
  value: string
}

export interface FeaturedProject {
  name: string
  category: string
  headline: string
  context: string
  summary: string
  challenge: string
  outcome: string
  details: string[]
  technologies: string[]
  repositoryUrl: string
  repositoryLabel: string
  repositoryNote?: string
  stageLabel: string
  status: string
  year: string
  theme: 'steel' | 'signal' | 'vision' | 'track'
  metrics: ProjectMetric[]
  artifactTitle: string
  artifactSummary: string
  artifactLanes: ArtifactLane[]
}

export interface ProjectRailItem {
  name: string
  description: string
  href: string
}

export interface SkillLane {
  label: string
  summary: string
  items: string[]
}

export interface ContactMethod {
  label: string
  value: string
  href: string
  icon: IconName
}
