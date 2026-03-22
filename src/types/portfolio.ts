export type ButtonVariant = 'primary' | 'secondary'

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
}

export interface ProjectMetric {
  label: string
  value: string
}

export interface FeaturedProject {
  name: string
  category: string
  headline: string
  summary: string
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
