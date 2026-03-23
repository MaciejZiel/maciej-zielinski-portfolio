import type {
  ContactMethod,
  FeaturedProject,
  NavigationItem,
  Profile,
  ProjectRailItem,
  SkillLane,
} from '../types/portfolio'

const githubProfileUrl = 'https://github.com/MaciejZiel'
const linkedInUrl =
  'https://www.linkedin.com/in/maciej-zieli%C5%84ski-28669b3a4/'

export const navigationItems: NavigationItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Stack', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export const profile: Profile = {
  name: 'Maciej Zieliński',
  headline: 'Backend Developer (Python) | AI Systems',
  intro:
    'I build backend systems and AI-powered products with a backend-first mindset: clear boundaries, reliable workflows, practical AI integration, and software that behaves predictably under real constraints.',
  summary:
    'Computer Science student focused on Python backend development, applied AI systems, and projects that are structured closer to products than coursework.',
  availability: 'Open to backend, Python, and AI internship or junior roles.',
  location: 'Warsaw, Poland',
  education: 'PJATK, 3rd year Computer Science',
  focusAreas: [
    'Backend systems with clear data boundaries, authentication, and domain logic.',
    'Applied AI workflows that need retrieval, orchestration, and runtime control.',
    'Projects built with testing, Docker, and maintainable structure in mind.',
  ],
  heroLinks: [
    { label: 'View Work', href: '#projects', variant: 'primary' },
    {
      label: 'GitHub',
      href: githubProfileUrl,
      icon: 'github',
      variant: 'text',
      external: true,
    },
    {
      label: 'LinkedIn',
      href: linkedInUrl,
      icon: 'linkedin',
      variant: 'text',
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
    { label: 'Primary stack', value: 'Python / FastAPI / Django / SQL' },
    { label: 'AI layer', value: 'RAG / LLM integrations / CV pipelines' },
    { label: 'Build style', value: 'Backend-first, system-oriented builds' },
    { label: 'Role target', value: 'Internship / junior backend roles' },
  ],
  heroRibbon: [
    'CaseFlow / private multi-tenant backend',
    'clip_to_text / FastAPI + Faster-Whisper',
    'camera_object_recognition / YOLOv8 + OpenCV',
    'live_flights_map / real-time map + replay',
    'Motorsport_API / DRF + JWT + OpenAPI',
  ],
  heroArtifactTitle: 'CaseFlow system snapshot',
  heroArtifactSummary:
    'The flagship project is a private multi-tenant backend built around the things that usually separate a demo from a product: access boundaries, workflow state, auditable events, and reliable delivery paths.',
  heroArtifactLanes: [
    {
      label: 'Entry',
      summary: 'Every request is tenant-aware before business logic runs.',
      items: ['Session-backed auth', 'RBAC checks', 'Tenant context'],
    },
    {
      label: 'Workflow',
      summary: 'Document state changes are explicit and traceable.',
      items: ['Document transitions', 'Action history', 'State rules'],
    },
    {
      label: 'Delivery',
      summary: 'Side effects are pushed through controlled operational paths.',
      items: ['Webhook dispatch', 'Retry handling', 'Background jobs'],
    },
    {
      label: 'Quality',
      summary: 'The build is treated like a system, not just an endpoint set.',
      items: ['Docker services', 'Alembic migrations', 'Integration tests'],
    },
  ],
}

export const aboutPoints: string[] = [
  'I care most about the part of software that has to stay understandable when the product gets more complex: APIs, data flow, authentication, background work, and the seams between services.',
  'On the AI side, I am interested in systems where models are only one part of the stack. Retrieval quality, orchestration, runtime controls, and user trust matter more to me than surface-level demos.',
  'A lot of my best work sits between backend engineering and AI tooling. I like building systems that need both solid Python fundamentals and enough product thinking to be genuinely useful.',
]

export const projectSignals: string[] = [
  'Private B2B backend architecture with auth, auditability, and workflow logic.',
  'Public AI and CV projects that expose orchestration, runtime state, and real-time behavior.',
  'Recent GitHub work that covers transcription pipelines, computer vision, APIs, and live data products.',
]

export const featuredProjects: FeaturedProject[] = [
  {
    name: 'CaseFlow',
    category: 'Private backend case study',
    headline: 'A multi-tenant FastAPI backend designed like a production B2B system.',
    context:
      'A backend-first internal product focused on document workflows, tenant separation, and operational reliability.',
    summary:
      'CaseFlow is the strongest example of how I approach backend engineering: tenant-aware architecture, RBAC, session-backed authentication, document workflow state, audit logs, webhook delivery, retry logic, background processing, Dockerized services, and integration testing around operational paths.',
    challenge:
      'The interesting part was not exposing endpoints. It was designing a backend where permissions, workflow transitions, and downstream delivery all stay coherent as the domain gets more complex.',
    outcome:
      'The result is a backend case study that looks closer to a real B2B system than a student CRUD app: policy gates, operational paths, auditable state, and test coverage around failure-prone workflows.',
    details: [
      'Tenant isolation with role-based access control and session-backed auth flows.',
      'Document workflow orchestration with auditable actions and event delivery.',
      'Retry and background processing patterns designed around reliability rather than demo-only behavior.',
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
    repositoryNote:
      'Primary implementation is private. The public profile is linked for portfolio context.',
    stageLabel: 'Workflow engine',
    status: 'Private project / ongoing backend case study',
    year: '2026',
    theme: 'steel',
    metrics: [
      { label: 'Core stack', value: 'FastAPI + SQLAlchemy' },
      { label: 'System concerns', value: 'Auth, workflows, auditability' },
      { label: 'Quality bar', value: 'Docker + integration tests' },
    ],
    artifactTitle: 'Operational architecture',
    artifactSummary:
      'The system is organized around clear policy boundaries, explicit workflow state, and delivery infrastructure that can be observed and retried.',
    artifactLanes: [
      {
        label: 'Policy boundary',
        summary: 'The request layer enforces who can act and in which tenant context.',
        items: ['Session auth', 'RBAC rules', 'Tenant isolation'],
      },
      {
        label: 'Workflow core',
        summary: 'Documents move through controlled transitions instead of ad hoc updates.',
        items: ['State transitions', 'Action handlers', 'Audit records'],
      },
      {
        label: 'Delivery layer',
        summary: 'Operational side effects are dispatched outside the request path.',
        items: ['Webhook queue', 'Retry logic', 'Background processing'],
      },
    ],
  },
  {
    name: 'clip_to_text',
    category: 'Applied AI system',
    headline:
      'A local transcription workflow with queued jobs, live progress, caching, and export-ready output.',
    context:
      'A practical transcription tool that treats speech-to-text as a repeatable workflow instead of a single model call.',
    summary:
      'Built around FastAPI, FFmpeg, and Faster-Whisper, clip_to_text treats transcription as a product workflow rather than a one-shot script. It tracks jobs in real time, stores history in SQLite, caches work, and supports optional SRT export for practical downstream use.',
    challenge:
      'The main challenge was orchestration: upload handling, preprocessing, model execution, progress reporting, and output persistence all needed to feel reliable from a user perspective.',
    outcome:
      'It ends up feeling like a small AI product, not an experiment: queued work, persisted history, observable progress, and outputs that are immediately useful downstream.',
    details: [
      'FastAPI orchestration around transcription jobs instead of a single synchronous request.',
      'Live job progress, persisted history, and caching for repeated work.',
      'Export path designed for usable outputs, not just a raw transcript dump.',
    ],
    technologies: [
      'FastAPI',
      'Faster-Whisper',
      'FFmpeg',
      'SQLite',
      'Job Progress',
      'Caching',
      'SRT Export',
    ],
    repositoryUrl: 'https://github.com/MaciejZiel/clip_to_text',
    repositoryLabel: 'GitHub',
    stageLabel: 'Transcription pipeline',
    status: 'Public repo / updated 2026',
    year: '2026',
    theme: 'signal',
    metrics: [
      { label: 'Model layer', value: 'Faster-Whisper' },
      { label: 'Runtime flow', value: 'Jobs, progress, persistence' },
      { label: 'Delivery', value: 'Local web app + export support' },
    ],
    artifactTitle: 'Transcription workflow',
    artifactSummary:
      'The interesting work sits in the queue and runtime lifecycle around the model, not just in speech recognition itself.',
    artifactLanes: [
      {
        label: 'Ingest',
        summary: 'Media is normalized into a predictable processing path.',
        items: ['Upload input', 'FFmpeg prep', 'Job creation'],
      },
      {
        label: 'Runtime',
        summary: 'Transcription is tracked as work with observable progress.',
        items: ['Whisper job', 'Live progress', 'Caching'],
      },
      {
        label: 'Output',
        summary: 'Results are persisted and shaped for practical reuse.',
        items: ['SQLite history', 'SRT export', 'Readable transcript'],
      },
    ],
  },
  {
    name: 'camera_object_recognition',
    category: 'Realtime AI pipeline',
    headline:
      'A live computer vision system with streaming, tracking, runtime controls, and per-class analytics.',
    context:
      'A realtime vision pipeline combining inference, streaming, tracking, and operator controls in one workflow.',
    summary:
      'This project combines YOLOv8, FastAPI, and OpenCV into a real-time object recognition workflow that goes beyond detection. It includes streaming, tracking, counting, snapshots, and control surfaces that make the system feel operational instead of purely experimental.',
    challenge:
      'The hard part was coordinating a live video loop, inference, stateful tracking, and a usable control surface without the whole thing feeling fragile or demo-only.',
    outcome:
      'The result behaves more like an operational vision console: live feed, object counts, snapshots, and controls that expose how the inference loop is behaving in real time.',
    details: [
      'Real-time webcam pipeline with detection, tracking, and live streaming.',
      'Per-class counts and snapshots that make the output measurable and inspectable.',
      'Runtime controls exposed through a web interface instead of hard-coded parameters.',
    ],
    technologies: [
      'YOLOv8',
      'FastAPI',
      'OpenCV',
      'Streaming',
      'Tracking',
      'Angular',
      'Runtime Controls',
    ],
    repositoryUrl: 'https://github.com/MaciejZiel/camera_object_recognition',
    repositoryLabel: 'GitHub',
    stageLabel: 'Realtime inference loop',
    status: 'Public repo / updated 2026',
    year: '2026',
    theme: 'vision',
    metrics: [
      { label: 'Inference', value: 'YOLOv8 + OpenCV' },
      { label: 'Interface', value: 'Angular + FastAPI' },
      { label: 'Focus', value: 'Streaming, tracking, controls' },
    ],
    artifactTitle: 'Realtime inference loop',
    artifactSummary:
      'The value is in the live runtime loop and observability around it, not just in returning detections from a model.',
    artifactLanes: [
      {
        label: 'Capture',
        summary: 'Frames are pulled and normalized for live processing.',
        items: ['Webcam feed', 'Frame pipeline', 'Streaming path'],
      },
      {
        label: 'Inference',
        summary: 'Detection and tracking stay stateful across frames.',
        items: ['YOLOv8 detect', 'Object tracking', 'Class counts'],
      },
      {
        label: 'Control',
        summary: 'Operators can inspect and shape runtime behavior.',
        items: ['Angular UI', 'Snapshots', 'Runtime controls'],
      },
    ],
  },
  {
    name: 'Motorsport_API',
    category: 'Backend API',
    headline:
      'A production-minded Django REST API with standings logic, JWT auth, filtering, and documented contracts.',
    context:
      'A domain-heavy REST API where the backend has to model seasons, teams, races, results, and standings cleanly.',
    summary:
      'Motorsport_API models seasons, teams, drivers, races, and race results with domain logic that goes beyond CRUD. It layers in JWT authentication, filtering, pagination, Swagger/OpenAPI documentation, Dockerized setup, and testable backend structure.',
    challenge:
      'The core challenge was modeling a sports domain where standings and result logic matter, then exposing it as a clean API with documented contracts and usable auth.',
    outcome:
      'That makes it a solid backend API case study: domain modeling, contract clarity, authentication, and the operational basics needed for a maintainable service.',
    details: [
      'Backend domain modeling for standings, race results, teams, and drivers.',
      'JWT authentication, pagination, and filtering for usable API consumption.',
      'OpenAPI documentation and Dockerized local workflow for maintainability.',
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
    stageLabel: 'API domain layer',
    status: 'Public repo / updated 2026',
    year: '2026',
    theme: 'track',
    metrics: [
      { label: 'Framework', value: 'Django REST Framework' },
      { label: 'API concerns', value: 'JWT, filtering, pagination' },
      { label: 'Contracts', value: 'Swagger + OpenAPI' },
    ],
    artifactTitle: 'API domain map',
    artifactSummary:
      'The strength of the project is the backend contract: coherent models, standings logic, and a usable interface for consumers.',
    artifactLanes: [
      {
        label: 'Domain',
        summary: 'The model layer reflects the season and race structure clearly.',
        items: ['Teams', 'Drivers', 'Races'],
      },
      {
        label: 'API',
        summary: 'Endpoints are shaped for real consumption rather than raw data dumping.',
        items: ['JWT auth', 'Filtering', 'Pagination'],
      },
      {
        label: 'Contracts',
        summary: 'The service is documented and runnable in a clean local setup.',
        items: ['Swagger UI', 'OpenAPI', 'Docker workflow'],
      },
    ],
  },
]

export const projectRail: ProjectRailItem[] = [
  {
    name: 'live_flights_map',
    description: 'Real-time flight tracking workspace with replay and airport dashboards.',
    href: 'https://github.com/MaciejZiel/live_flights_map',
  },
  {
    name: 'RAG_Retrieval_Augmented_Generation',
    description: 'Python retrieval workflow combining FAISS, semantic search, and LLM integration.',
    href: 'https://github.com/MaciejZiel/RAG_Retrieval_Augmented_Generation',
  },
  {
    name: 'hand_gesture_control',
    description: 'OpenCV + MediaPipe gesture control with smoothing and configurable mappings.',
    href: 'https://github.com/MaciejZiel/hand_gesture_control',
  },
  {
    name: 'F1InfoMobileApp',
    description: 'Android app for live motorsport telemetry and race-focused mobile interfaces.',
    href: 'https://github.com/MaciejZiel/F1InfoMobileApp',
  },
]

export const skillLanes: SkillLane[] = [
  {
    label: 'Backend systems',
    summary: 'Frameworks, APIs, data flow, and the operational layer around them.',
    items: [
      'Python',
      'FastAPI',
      'Django',
      'Django REST Framework',
      'REST API design',
      'SQL',
      'Authentication',
      'OpenAPI / Swagger',
      'Background processing',
    ],
  },
  {
    label: 'Applied AI',
    summary: 'LLM and CV work where system design matters as much as the model.',
    items: [
      'LLM integration',
      'OpenAI',
      'Qwen',
      'RAG',
      'FAISS',
      'Semantic search',
      'Prompt engineering',
      'Codex',
      'Faster-Whisper',
      'YOLOv8',
    ],
  },
  {
    label: 'Tooling and delivery',
    summary: 'What I use to keep projects maintainable, testable, and ready to ship.',
    items: [
      'Docker',
      'Git',
      'CI/CD',
      'Linux',
      'Testing',
      'Alembic',
      'PostgreSQL',
      'FFmpeg',
      'OpenCV',
    ],
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
