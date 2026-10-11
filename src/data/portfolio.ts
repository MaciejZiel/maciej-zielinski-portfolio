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
    name: 'CaseFlow',
    category: 'Multi-tenant backend platform',
    headline: 'A multi-tenant FastAPI backend for case and document workflows, with a Next.js workspace on top.',
    context:
      'A backend-first B2B platform focused on case and document workflows, tenant separation, and operational reliability.',
    summary:
      'CaseFlow is the clearest example of how I approach backend engineering: tenant isolation in one shared schema, RBAC, persisted sessions, versioned uploads with a review flow, audit logs, HMAC-signed webhooks and outbound email driven by persisted work records with retries, plus a case-scoped assistant that answers with stored citations using deterministic keyword scoring (no external LLM).',
    challenge:
      'The interesting part was not exposing endpoints. It was designing a backend where permissions, workflow transitions, and downstream delivery all stay coherent as the domain gets more complex.',
    outcome:
      'The result is a backend case study built around the problems a B2B system has to solve: policy gates, operational paths, auditable state, and test coverage around failure-prone workflows.',
    details: [
      'Tenant isolation with role-based access control and session-backed auth flows.',
      'Document workflow orchestration with auditable actions and event delivery.',
      'Retry and background processing patterns designed around reliability rather than demo-only behavior.',
      'Next.js workspace with case lists and case detail: documents, comments, activity and the assistant.',
    ],
    technologies: [
      'FastAPI',
      'SQLAlchemy',
      'Alembic',
      'RBAC',
      'Session Auth',
      'Webhooks',
      'Next.js',
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
    screenshot: {
      src: '/projects/caseflow-cases.png',
      alt: 'CaseFlow case list for a demo workspace, with status and priority breakdowns',
      width: 1440,
      height: 1027,
      caption: 'Case list in the Next.js workspace (demo data).',
    },
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
    name: 'pgqueue',
    category: 'Infrastructure library',
    headline:
      'A background job queue that runs only on PostgreSQL, with explicit and tested failure semantics.',
    context:
      'Most applications that need background jobs already have PostgreSQL. Keeping the queue in the same database lets a job be enqueued in the same transaction as the data it refers to.',
    summary:
      'pgqueue claims jobs with SELECT … FOR UPDATE SKIP LOCKED, retries failures with capped exponential backoff, protects running jobs with heartbeated leases and fences every completion on the current lease holder. Idle workers wake through LISTEN/NOTIFY, cron-like periodic jobs fire once per tick without leader election, and an admin dashboard and Prometheus metrics show what the queue is doing.',
    challenge:
      'The hard part is what happens when things go wrong: crashed or partitioned workers, late results from a worker that lost its lease, lost notifications. Each case has a defined outcome, and stress tests with several worker processes check that no attempt ever runs twice.',
    outcome:
      'On a laptop with default Postgres settings it drains about 6,600 no-op jobs per second with 8 worker processes and picks up a new job in about 4 ms (p50) through LISTEN/NOTIFY. The benchmark also exposed a claim query that sorted the whole backlog; fixing it doubled throughput.',
    details: [
      'One-statement batch claims with SKIP LOCKED, priorities and per-queue partial indexes.',
      'Leases, a reaper for crashed workers and fenced completions for at-least-once delivery.',
      'Typed pydantic payloads, transactional enqueue, idempotency keys and dead letters.',
      'Admin API, dashboard, Prometheus metrics and 143 tests against real PostgreSQL 16 and 17.',
    ],
    technologies: [
      'Python',
      'asyncio',
      'asyncpg',
      'PostgreSQL',
      'SQLAlchemy Core',
      'Alembic',
      'FastAPI',
      'Prometheus',
    ],
    repositoryUrl: 'https://github.com/MaciejZiel/pgqueue',
    repositoryLabel: 'View repository',
    stageLabel: 'Job lifecycle',
    status: 'Public repository / Python library',
    year: '2026',
    theme: 'signal',
    visualization: 'queue',
    flowCaption: 'ENQUEUE → CLAIM + LEASE → COMPLETE / RETRY',
    metrics: [
      { label: 'Throughput', value: '~6,600 jobs/s, 8 workers' },
      { label: 'Pickup latency', value: '4.1 ms p50 (LISTEN/NOTIFY)' },
      { label: 'Delivery', value: 'At-least-once, fenced' },
    ],
    screenshot: {
      src: '/projects/pgqueue-dashboard.png',
      alt: 'pgqueue admin dashboard with job counts per queue and state, workers and recent failures',
      width: 1200,
      height: 850,
      caption: 'Admin dashboard running the Docker Compose demo.',
    },
    artifactTitle: 'Job lifecycle',
    artifactSummary:
      'A job moves through three steps, and each one is a single SQL statement whose shape is the correctness argument.',
    artifactLanes: [
      {
        label: 'Enqueue',
        summary: 'Jobs are inserted in the caller\'s transaction, so they exist only if the data does.',
        items: ['Transactional enqueue', 'Idempotency keys', 'NOTIFY trigger'],
      },
      {
        label: 'Claim',
        summary: 'Workers lock different rows concurrently and take a lease on each job.',
        items: ['SKIP LOCKED batch', 'Heartbeated leases', 'Reaper for crashes'],
      },
      {
        label: 'Finish',
        summary: 'Results are accepted only from the current lease holder for the current attempt.',
        items: ['Fenced completion', 'Backoff + jitter', 'Dead letters'],
      },
    ],
  },
  {
    name: 'agentic-rag-platform',
    category: 'Applied AI platform',
    headline:
      'A document intelligence platform with grounded, cited answers, structured extraction, and a full web UI.',
    context:
      'A multi-tenant RAG platform where documents are uploaded, chunked, embedded, and queried through an authenticated API and a React frontend.',
    summary:
      'Agentic RAG Platform combines FastAPI, PostgreSQL, and Qdrant into a retrieval workflow that goes beyond a single prompt. Documents are indexed in the background by a Celery worker with configurable chunking; questions are answered with source citations over SSE, and documents can be turned into JSON that follows a user-supplied schema. Every query, vector search and statistic is scoped to the caller\'s tenant, and accounts support email verification and optional TOTP two-factor authentication.',
    challenge:
      'The hard part was keeping answers grounded and the platform operable: tenant-scoped data, vector cleanup when documents change, cached and rate-limited LLM calls, and metrics that show how the system behaves.',
    outcome:
      'The result behaves like a small product rather than a notebook demo: users manage documents and conversations in a web UI, every answer points back to its sources, and the backend is observable and deployable.',
    details: [
      'Document ingestion with configurable chunking and Qdrant vector storage.',
      'Cited Q&A with SSE streaming, conversation history, and structured JSON extraction.',
      'Tenant isolation, JWT and API key auth, optional TOTP 2FA with recovery codes.',
      'Redis caching, rate limiting, signed webhooks, and Prometheus/Grafana metrics.',
    ],
    technologies: [
      'FastAPI',
      'PostgreSQL',
      'Qdrant',
      'Redis',
      'Celery',
      'React',
      'Kubernetes',
      'Prometheus',
      'Grafana',
    ],
    repositoryUrl: 'https://github.com/MaciejZiel/agentic-rag-platform',
    repositoryLabel: 'GitHub',
    stageLabel: 'Retrieval pipeline',
    status: 'Public repo / updated 2026',
    year: '2026',
    theme: 'vision',
    metrics: [
      { label: 'Retrieval', value: 'Qdrant + PostgreSQL' },
      { label: 'Interface', value: 'React + FastAPI' },
      { label: 'Indexing', value: 'Background jobs on Celery' },
    ],
    screenshot: {
      src: '/projects/agentic-rag-chat.png',
      alt: 'Chat view answering a question with numbered source chips that link to document chunks',
      width: 1440,
      height: 900,
      caption: 'Local run with sample documents; the model was replaced by a stub, the retrieval pipeline is real.',
    },
    artifactTitle: 'Grounded answer pipeline',
    artifactSummary:
      'The value is in the path from raw documents to answers that can be traced back to their sources, not just in calling an LLM.',
    artifactLanes: [
      {
        label: 'Ingest',
        summary: 'Documents are parsed, chunked, and embedded into a tenant-scoped index.',
        items: ['PDF / DOCX / TXT / MD', 'Celery worker', 'Qdrant vectors'],
      },
      {
        label: 'Retrieve',
        summary: 'Questions are matched against the index and the best chunks become context.',
        items: ['Similarity search', 'Conversation context', 'Redis cache'],
      },
      {
        label: 'Answer',
        summary: 'The model answers with citations, streamed to the UI or returned as JSON.',
        items: ['Cited answers', 'SSE streaming', 'Structured extraction'],
      },
    ],
  },
  {
    name: 'Motorsport_API',
    category: 'Backend API',
    headline:
      'A Django REST API with computed standings, JWT auth and documented contracts, plus an Angular dashboard on top.',
    context:
      'A domain-heavy REST API where the backend has to model seasons, teams, races, results, and standings cleanly.',
    summary:
      'Motorsport_API models seasons, teams, drivers, races, and race results for a fictional championship, with driver and constructor standings computed in SQL. Browsers get JWTs in HttpOnly cookies with CSRF protection while API clients use Bearer tokens; reads are public and writes need a staff account. An Angular 21 dashboard ("Pit Wall") shows standings, driver profiles, the race calendar and classifications, with every number coming from the API.',
    challenge:
      'The core challenge was modeling a sports domain where standings and result logic matter, then exposing it as a clean API with documented contracts and usable auth.',
    outcome:
      'That makes it a solid backend API case study: domain modeling, contract clarity, authentication, and the operational basics needed for a maintainable service.',
    details: [
      'Backend domain modeling for standings, race results, teams, and drivers.',
      'JWT authentication, pagination, and filtering for usable API consumption.',
      'OpenAPI documentation and Dockerized local workflow for maintainability.',
      'Angular frontend served by Nginx, which proxies the API to Django.',
    ],
    technologies: [
      'Django',
      'Django REST Framework',
      'PostgreSQL',
      'JWT',
      'OpenAPI',
      'Angular',
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
      { label: 'Frontend', value: 'Angular 21 dashboard' },
    ],
    screenshot: {
      src: '/projects/motorsport-standings.png',
      alt: 'Pit Wall dashboard showing drivers and constructors standings for a fictional 2026 season',
      width: 1440,
      height: 900,
      caption: 'Standings in the Angular dashboard (fictional championship data).',
    },
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
    name: 'Reroute',
    description: 'Local-first Warsaw transit control room: GTFS timetables, live vehicle positions, line punctuality and rerouting around closures (FastAPI + PostGIS + React).',
    href: 'https://github.com/MaciejZiel/Reroute',
  },
  {
    name: 'procurement-graph',
    description: 'Real BZP public procurement notices traced from buyer to supplier, with SQL analytics, a relationship map and PL/EN UI (FastAPI + PostgreSQL).',
    href: 'https://github.com/MaciejZiel/procurement-graph',
  },
  {
    name: 'plan-bot',
    description: 'Telegram and Discord bot for university timetables from ICS feeds: next class, reminders and change alerts.',
    href: 'https://github.com/MaciejZiel/plan-bot',
  },
  {
    name: 'clip_to_text',
    description: 'Local video-to-text transcription with FastAPI, FFmpeg and Faster-Whisper: queued jobs, live progress and SRT export.',
    href: 'https://github.com/MaciejZiel/clip_to_text',
  },
  {
    name: 'hand_gesture_control',
    description: 'OpenCV + MediaPipe gesture control with smoothing and configurable mappings.',
    href: 'https://github.com/MaciejZiel/hand_gesture_control',
  },
]

export const projectAnchorId = (name: string) =>
  `project-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

const projectDisplayNames: Record<string, string> = {
  CaseFlow: 'CASEFLOW',
  pgqueue: 'PGQUEUE',
  clip_to_text: 'CLIP TO TEXT',
  'plan-bot': 'PLAN-BOT',
  Reroute: 'REROUTE',
  'agentic-rag-platform': 'AGENTIC RAG PLATFORM',
  Motorsport_API: 'MOTORSPORT API',
  live_flights_map: 'LIVE FLIGHTS MAP',
  'procurement-graph': 'PROCUREMENT GRAPH',
  hand_gesture_control: 'HAND GESTURE CONTROL',
}

export const projectDisplayName = (name: string) =>
  projectDisplayNames[name] ?? name.replaceAll('_', ' ').toLocaleUpperCase('en-US')

export const projectHighlights = [
  {
    name: 'CaseFlow',
    description: 'A multi-tenant workflow platform with clear access rules and reliable delivery.',
    anchorId: projectAnchorId('CaseFlow'),
  },
  {
    name: 'pgqueue',
    description: 'A PostgreSQL-only job queue with leases, retries, LISTEN/NOTIFY and measured throughput.',
    anchorId: projectAnchorId('pgqueue'),
  },
  {
    name: 'Agentic RAG Platform',
    description: 'A document Q&A platform with cited answers, structured extraction, and monitoring.',
    anchorId: projectAnchorId('agentic-rag-platform'),
  },
  {
    name: 'Motorsport_API',
    description: 'A documented API for race results and standings, with an Angular dashboard.',
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
      'asyncio',
      'PostgreSQL job queues',
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
      'Qdrant',
      'FAISS',
      'Semantic search',
      'Prompt engineering',
      'Faster-Whisper',
      'YOLOv8',
    ],
  },
  {
    label: 'Tooling and delivery',
    summary: 'What I use to keep projects maintainable, testable, and ready to ship.',
    items: [
      'Docker',
      'Kubernetes',
      'Prometheus / Grafana',
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
    value: 'linkedin.com/in/maciej-zieliński-28669b3a4',
    href: linkedInUrl,
    icon: 'linkedin',
  },
]
