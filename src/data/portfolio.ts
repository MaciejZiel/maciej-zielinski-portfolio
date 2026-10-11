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
  headline: 'Software Engineer | Python / Applied AI',
  intro:
    'I like turning complex workflows into clear, dependable tools. I care about solid APIs, predictable runtime behavior, and interfaces that make software easier to understand and use.',
  summary:
    'I’m a software developer and fourth-year Computer Science student at PJATK in Warsaw. I build reliable backend systems and practical software, with a focus on Python, applied AI, computer vision, and real-time data.',
  availability: 'Open to software engineering internships and junior roles focused on Python, backend, and applied AI.',
  location: 'Warsaw, Poland',
  education: 'PJATK, 4th year Computer Science',
  focusAreas: [
    'Backend systems with clear data boundaries, authentication, and domain logic.',
    'Applied AI workflows that need retrieval, orchestration, and runtime control.',
    'Projects built with testing, Docker, and maintainable structure in mind.',
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
}

export const featuredProjects: FeaturedProject[] = [
  {
    name: 'pytest-queryguard',
    category: 'Open-source developer tool',
    headline: 'A pytest plugin that fails tests which hide N+1 queries and missing indexes.',
    context:
      'A published Python package for teams that use SQLAlchemy 2: it watches the SQL a test sends and turns silent performance problems into failing tests.',
    summary:
      'pytest-queryguard counts the statements each test sends, recognises the N+1 pattern, enforces per-test query budgets and, on PostgreSQL 16+, plans every distinct SELECT to find reads that no index serves. A failure names the offending line and suggests the fix, such as selectinload or CREATE INDEX.',
    challenge:
      'A test can pass while the code behind it sends 101 queries for 100 rows. The hard part was reporting this precisely enough to trust: no noise on harmless repetition, and no race conditions in the cached catalog the index check relies on.',
    outcome:
      'On PyPI with CI across Python 3.10 to 3.14 and PostgreSQL 15 to 17. Three independent review rounds fixed real concurrency and API issues before 0.3.0 shipped.',
    details: [
      'N+1 detection and query budgets for sync, async (asyncpg) and FastAPI test setups, with call sites in every message.',
      'Opt-in missing-index check: EXPLAIN in a savepoint with sequential scans off, so the test database is left untouched.',
      'A small public API, record_queries(), for asserting on the queries a block sent.',
    ],
    technologies: [
      'Python',
      'pytest',
      'SQLAlchemy 2',
      'PostgreSQL',
      'asyncpg',
      'GitHub Actions',
      'PyPI',
      'mypy --strict',
    ],
    repositoryUrl: 'https://github.com/MaciejZiel/pytest-queryguard',
    repositoryLabel: 'View repository',
    repositoryNote:
      'Install with pip install pytest-queryguard. Source, changelog and design notes are in the repository.',
    stageLabel: 'Published package',
    status: 'v0.3.0 on PyPI / open source',
    year: '2026',
    theme: 'steel',
    visualization: 'query-log',
    metrics: [
      { label: 'Release', value: 'v0.3.0 on PyPI' },
      { label: 'Quality bar', value: '630+ tests, 99% coverage' },
      { label: 'Runs on', value: 'Python 3.10-3.14, PostgreSQL 15-17' },
    ],
    artifactTitle: 'How a failing test is found',
    artifactSummary:
      'The plugin listens to SQLAlchemy events, groups the statements of each test, and judges them after the test body has run.',
    artifactLanes: [
      {
        label: 'Collect',
        summary: 'Every statement a test sends is recorded with the line of code that caused it.',
        items: ['SQLAlchemy events', 'Per-test log', 'Call sites'],
      },
      {
        label: 'Judge',
        summary: 'Repeated statements and budget overruns become readable failures.',
        items: ['N+1 detection', 'Query budgets', 'Fix suggestions'],
      },
      {
        label: 'Verify',
        summary: 'Optionally, PostgreSQL itself says whether a query reads a whole table.',
        items: ['EXPLAIN in a savepoint', 'Missing-index hints', 'asyncpg support'],
      },
    ],
  },
  {
    name: 'CaseFlow',
    category: 'Multi-tenant backend platform',
    headline: 'A multi-tenant FastAPI backend designed like a production B2B system.',
    context:
      'A backend-first B2B platform focused on case and document workflows, tenant separation, and operational reliability.',
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
    repositoryUrl: 'https://github.com/MaciejZiel/caseflow',
    repositoryLabel: 'View repository',
    repositoryNote:
      'Public source, setup instructions, and verification details are available in the repository.',
    stageLabel: 'Workflow engine',
    status: 'Public repository / multi-tenant backend',
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
        label: 'Policy gate',
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
  {
    name: 'live_flights_map',
    category: 'Full-stack real-time data app',
    headline:
      'A live aircraft map with a resilient path from external feeds to searchable flight history.',
    context:
      'A full-stack flight-tracking application that combines external position feeds, a local archive, and a map-based interface.',
    summary:
      'OpenSky is the primary live data provider, with ADSB.lol available as a fallback. A Flask service brokers the requests and stores aircraft positions in SQLite for later search and replay.',
    challenge:
      'The application needs to make changing external data useful over time: handle provider availability, retain position history, and keep aircraft movement legible on a live map.',
    outcome:
      'The result connects live tracking with a searchable local archive, replay, and flight trails instead of treating each provider response as a disposable snapshot.',
    details: [
      'OpenSky primary feed with ADSB.lol provider fallback.',
      'Flask proxy, bounding-box caching, and a SQLite position archive.',
      'Svelte and Leaflet map with polling by default and optional server-sent events.',
    ],
    technologies: [
      'Flask',
      'SQLite',
      'Svelte',
      'Leaflet',
      'OpenSky',
      'ADSB.lol',
      'Server-Sent Events',
    ],
    repositoryUrl: 'https://github.com/MaciejZiel/live_flights_map',
    repositoryLabel: 'View repository',
    stageLabel: 'Live data route',
    status: 'Public repository / real-time aircraft tracking',
    year: '2026',
    theme: 'vision',
    visualization: 'flight-route',
    metrics: [
      { label: 'Live feeds', value: 'OpenSky + ADSB.lol fallback' },
      { label: 'Archive', value: 'SQLite position history' },
      { label: 'Map', value: 'Svelte + Leaflet' },
    ],
    artifactTitle: 'Live position pipeline',
    artifactSummary:
      'Provider feeds pass through a Flask service before live map updates and searchable position history.',
    artifactLanes: [
      {
        label: 'Sources',
        summary: 'Live aircraft states come from a primary provider with a fallback source.',
        items: ['OpenSky', 'ADSB.lol fallback', 'Bounding-box cache'],
      },
      {
        label: 'Archive',
        summary: 'The Flask service stores positions so past activity can be explored later.',
        items: ['Flask proxy', 'SQLite archive', 'Position search'],
      },
      {
        label: 'Map & replay',
        summary: 'The map turns position history into movement, trails, and replay.',
        items: ['Svelte + Leaflet', 'Flight trails', 'Polling / optional SSE'],
      },
    ],
  },
]

export const projectRail: ProjectRailItem[] = [
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
    name: 'camera_object_recognition',
    description: 'Real-time webcam object recognition with YOLOv8, FastAPI, OpenCV and Angular.',
    href: 'https://github.com/MaciejZiel/camera_object_recognition',
  },
  {
    name: 'F1InfoMobileApp',
    description: 'Android app for live motorsport telemetry and race-focused mobile interfaces.',
    href: 'https://github.com/MaciejZiel/F1InfoMobileApp',
  },
]

// One accent per project, so no two projects share a colour whatever their motion theme.
const projectAccents: Record<string, string> = {
  CaseFlow: '#7be4b8',
  'pytest-queryguard': '#f2d76b',
  clip_to_text: '#ffb86c',
  Motorsport_API: '#d4a5e0',
  live_flights_map: '#f07887',
  'Live Flights Map': '#f07887',
}

export const projectAccent = (name: string) => projectAccents[name]

export const projectAnchorId = (name: string) =>
  `project-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

const projectDisplayNames: Record<string, string> = {
  CaseFlow: 'CASEFLOW',
  'pytest-queryguard': 'PYTEST-QUERYGUARD',
  clip_to_text: 'CLIP TO TEXT',
  camera_object_recognition: 'CAMERA OBJECT RECOGNITION',
  Motorsport_API: 'MOTORSPORT API',
  live_flights_map: 'LIVE FLIGHTS MAP',
  RAG_Retrieval_Augmented_Generation: 'RAG — RETRIEVAL AUGMENTED GENERATION',
  hand_gesture_control: 'HAND GESTURE CONTROL',
  F1InfoMobileApp: 'F1 INFO MOBILE APP',
}

export const projectDisplayName = (name: string) =>
  projectDisplayNames[name] ?? name.replaceAll('_', ' ').toLocaleUpperCase('en-US')

export const projectHighlights = [
  {
    name: 'pytest-queryguard',
    description: 'A published pytest plugin that turns N+1 queries and missing indexes into failing tests.',
    anchorId: projectAnchorId('pytest-queryguard'),
  },
  {
    name: 'CaseFlow',
    description: 'A multi-tenant workflow platform with clear access rules and reliable delivery.',
    anchorId: projectAnchorId('CaseFlow'),
  },
  {
    name: 'clip_to_text',
    description: 'An audio-to-transcript workflow with live job progress and practical exports.',
    anchorId: projectAnchorId('clip_to_text'),
  },
  {
    name: 'Motorsport_API',
    description: 'A documented API for race results, teams, drivers, and standings.',
    anchorId: projectAnchorId('Motorsport_API'),
  },
  {
    name: 'Live Flights Map',
    description: 'A real-time aircraft map with search, history replay, and provider fallback.',
    anchorId: projectAnchorId('live_flights_map'),
  },
] as const

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
