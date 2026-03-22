import type {
  ContactMethod,
  NavigationItem,
  Profile,
  Project,
  SkillGroup,
} from '../types/portfolio'

const githubProfileUrl = 'https://github.com/MaciejZiel'
const linkedInUrl =
  'https://www.linkedin.com/in/maciej-zieli%C5%84ski-28669b3a4/'

export const navigationItems: NavigationItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Stack', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export const profile: Profile = {
  name: 'Maciej Zieliński',
  headline: 'Backend Developer (Python) | AI Systems',
  intro:
    'I build backend systems and AI-powered applications, focused on practical AI, scalable APIs, and real-world engineering.',
  summary:
    'Computer Science student at PJATK focused on Python backend development, LLM integrations, and production-minded system design.',
  availability: 'Open to backend, Python, and AI internship or junior roles.',
  location: 'Warsaw, Poland',
  education: 'PJATK, Computer Science',
  focusAreas: [
    'Designing APIs with clear domain logic, auth, and maintainable data models.',
    'Building applied AI workflows with RAG pipelines, LLM integrations, and grounded prompts.',
    'Treating personal projects like engineering systems: testing, Docker, and deployment readiness.',
  ],
  heroLinks: [
    { label: 'View Projects', href: '#projects', variant: 'primary' },
    {
      label: 'GitHub',
      href: githubProfileUrl,
      icon: 'github',
      variant: 'secondary',
      external: true,
    },
    {
      label: 'LinkedIn',
      href: linkedInUrl,
      icon: 'linkedin',
      variant: 'secondary',
      external: true,
    },
  ],
  socialLinks: [
    {
      label: 'GitHub',
      href: githubProfileUrl,
      icon: 'github',
      external: true,
    },
    {
      label: 'LinkedIn',
      href: linkedInUrl,
      icon: 'linkedin',
      external: true,
    },
  ],
  details: [
    { label: 'Focus', value: 'Python backend, APIs, AI systems' },
    { label: 'Mindset', value: 'Practical engineering over demos' },
    { label: 'Strengths', value: 'FastAPI, Django, REST, testing, Docker' },
    { label: 'Looking for', value: 'Internships and junior backend roles' },
  ],
}

export const aboutPoints: string[] = [
  'I approach projects from the backend out: data flow, API boundaries, authentication, and failure handling come before surface-level polish.',
  'My strongest work sits at the intersection of Python backend development and applied AI, especially when LLMs need retrieval, guardrails, and predictable system behavior.',
  'I prefer practical software engineering choices over inflated claims: clear architecture, readable code, tests where they matter, and systems that can be reasoned about.',
]

export const projectSignals: string[] = [
  'Production-style APIs with authentication, RBAC, and domain logic.',
  'AI integrations designed around retrieval quality, grounding, and prompt discipline.',
  'Containerized projects with testing, documentation, and deployment awareness.',
]

export const projects: Project[] = [
  {
    name: 'CaseFlow',
    category: 'Featured project',
    description:
      'Production-style multi-tenant B2B backend for document-driven case workflows. Built with FastAPI, SQLAlchemy, and Alembic, with tenant-aware RBAC, session-backed authentication, audit logs, webhook delivery, retry and background processing, Dockerized services, and integration-test coverage aimed at real operational behavior rather than tutorial patterns.',
    highlights: [
      'Tenant isolation, role-based access control, and session-backed auth flows.',
      'Document workflow orchestration with auditability, webhook events, and retry logic.',
      'Docker-based local environment with integration tests for backend-critical paths.',
    ],
    technologies: [
      'FastAPI',
      'SQLAlchemy',
      'Alembic',
      'RBAC',
      'Session Auth',
      'Webhooks',
      'Docker',
      'Integration Tests',
    ],
    repositoryUrl: githubProfileUrl,
    repositoryLabel: 'GitHub profile',
    featured: true,
    repositoryNote: 'Primary implementation is private; public profile included for portfolio context.',
  },
  {
    name: 'RAG System',
    category: 'AI project',
    description:
      'Retrieval-Augmented Generation workflow in Python combining FAISS-based indexing, semantic search, and LLM integration to answer from grounded source material. The project focuses on retrieval pipeline quality, prompt engineering, and reducing hallucinations by constraining answers to retrieved context.',
    highlights: [
      'Chunking, embeddings, and FAISS retrieval tuned for semantic search workflows.',
      'LLM integration with answer-grounding rules to improve reliability on document QA.',
      'Practical experimentation around prompt structure, recall quality, and context control.',
    ],
    technologies: [
      'Python',
      'FAISS',
      'RAG',
      'LLM Integration',
      'Semantic Search',
      'Prompt Engineering',
      'Qwen',
    ],
    repositoryUrl:
      'https://github.com/MaciejZiel/RAG_Retrieval_Augmented_Generation',
    repositoryLabel: 'GitHub',
  },
  {
    name: 'Motorsport API',
    category: 'Backend project',
    description:
      'Production-minded Django REST Framework backend for managing teams, drivers, races, and results. The API includes JWT authentication, filtering, pagination, domain-specific business logic, OpenAPI and Swagger documentation, Dockerized local setup, testing, and CI-ready structure.',
    highlights: [
      'Structured domain modeling for seasons, teams, drivers, races, and standings.',
      'JWT-protected endpoints with filtering, pagination, and documented API contracts.',
      'Docker, testing, and CI-friendly workflow for a deployable backend codebase.',
    ],
    technologies: [
      'Django',
      'Django REST Framework',
      'JWT',
      'OpenAPI',
      'Swagger',
      'Docker',
      'Testing',
      'CI/CD',
    ],
    repositoryUrl: 'https://github.com/MaciejZiel/Motorsport_API',
    repositoryLabel: 'GitHub',
  },
  {
    name: 'Hand Gesture Control',
    category: 'Computer vision project',
    description:
      'Real-time gesture control application using OpenCV and MediaPipe for live recognition, smoothed signals, configurable gesture mapping, and macro-style actions. Built as a systems-oriented computer vision project focused on responsiveness and control accuracy.',
    highlights: [
      'Real-time detection pipeline with dual-hand support and configurable profiles.',
      'Signal smoothing to stabilize gesture recognition in practical desktop use.',
      'Configurable mapping layer connecting recognized gestures to actions and macros.',
    ],
    technologies: [
      'Python',
      'OpenCV',
      'MediaPipe',
      'Real-time Recognition',
      'Signal Smoothing',
      'Gesture Mapping',
    ],
    repositoryUrl: 'https://github.com/MaciejZiel/hand_gesture_control',
    repositoryLabel: 'GitHub',
  },
]

export const skillGroups: SkillGroup[] = [
  {
    title: 'Backend',
    description: 'API design, web frameworks, and data-oriented backend work.',
    items: [
      'Python',
      'FastAPI',
      'Django',
      'Django REST Framework',
      'REST API',
      'SQL',
      'Authentication',
      'OpenAPI',
    ],
  },
  {
    title: 'AI / Data',
    description: 'Applied AI workflows built around grounding and retrieval.',
    items: [
      'LLM Integration',
      'OpenAI',
      'Qwen',
      'FAISS',
      'RAG',
      'Semantic Search',
      'Prompt Engineering',
    ],
  },
  {
    title: 'DevOps / Tools',
    description: 'Tooling that makes projects easier to ship and maintain.',
    items: [
      'Docker',
      'Git',
      'CI/CD',
      'Linux',
      'Swagger',
      'Testing',
      'Alembic',
    ],
  },
  {
    title: 'Other',
    description: 'Additional tools and languages used across side projects.',
    items: ['Java', 'OpenCV', 'MediaPipe', 'PostgreSQL', 'System Design Basics'],
  },
]

export const contactMethods: ContactMethod[] = [
  {
    label: 'Email',
    value: 'zielinski.macio@gmail.com',
    href: 'mailto:zielinski.macio@gmail.com',
    icon: 'mail',
  },
  {
    label: 'GitHub',
    value: 'github.com/MaciejZiel',
    href: githubProfileUrl,
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/maciej-zielinski-28669b3a4',
    href: linkedInUrl,
    icon: 'linkedin',
  },
]
