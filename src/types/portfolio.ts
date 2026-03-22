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
}

export interface Project {
  name: string
  category: string
  description: string
  highlights: string[]
  technologies: string[]
  repositoryUrl: string
  repositoryLabel: string
  featured?: boolean
  repositoryNote?: string
}

export interface SkillGroup {
  title: string
  description: string
  items: string[]
}

export interface ContactMethod {
  label: string
  value: string
  href: string
  icon: IconName
}
