import type {
  ContactMethod,
  FeaturedProject,
  NavigationItem,
  Profile,
  ProjectRailItem,
  SelfHostedDemos,
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
      'pytest-queryguard counts the statements each test sends, recognises the N+1 pattern, enforces per-test query and time budgets and, with the opt-in index check, plans every distinct SELECT to find reads that no index serves. A failure names the offending line and suggests the fix, such as selectinload or CREATE INDEX.',
    challenge:
      'A test can pass while the code behind it sends 101 queries for 100 rows. The hard part was reporting this precisely enough to trust: no noise on harmless repetition, and no race conditions in the cached catalog the index check relies on.',
    outcome:
      'Stable 0.3.0 is on PyPI with CI across Python 3.10 to 3.14. Release 0.4.0 is in release-candidate testing and adds a baseline so only new findings fail, SARIF output with a GitHub Action, per-finding ignore patterns, and the index check on SQLite, MySQL and MariaDB.',
    details: [
      'N+1 detection, repeated-statement and column-reload checks, and query and time budgets for sync, async and FastAPI test setups, with the call site in every message.',
      'Opt-in missing-index check that proposes the CREATE INDEX and the Alembic call; on PostgreSQL 16+ it runs EXPLAIN with sequential scans off, so the test database is left untouched.',
      'A small public API, record_queries(), for asserting on the queries a block sent. It sees only statements that go through SQLAlchemy, and the documentation lists its limits.',
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
    repositoryLabel: 'Source code',
    repositoryNote:
      'Install with pip install pytest-queryguard. Source, changelog, documentation and design notes are in the repository.',
    stageLabel: 'Published package',
    status: 'v0.3.0 on PyPI / 0.4.0 coming / open source',
    year: '2026',
    theme: 'steel',
    visualization: 'query-log',
    metrics: [
      { label: 'Release', value: 'v0.3.0 on PyPI, 0.4.0 next' },
      { label: 'Quality bar', value: 'mypy --strict, coverage-gated CI' },
      { label: 'Runs on', value: 'Python 3.10-3.14, SQLAlchemy 2' },
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
        summary: 'Optionally, the database itself says whether a query reads a whole table.',
        items: ['EXPLAIN in a savepoint', 'Missing-index hints', 'asyncpg support'],
      },
    ],
  },
  {
    name: 'Contrail',
    category: 'Real-time data app',
    headline:
      'A live flight tracker where aircraft glide on a WebGL map and every flight shows its whole track and the route ahead.',
    context:
      'A self-hosted air-traffic map built on ADSB.lol data: a fast map for browsing traffic, plus a panel for any single flight.',
    summary:
      'Every aircraft is drawn on its own WebGL layer and extrapolated each frame from its track and ground speed, so nothing jumps between updates. Click one to see a photo of it, its route, live altitude and speed with history, the track flown since take-off and the dashed route ahead with an arrival estimate. Search finds flights, airports and airlines, airport cards show decoded weather, and filters narrow the picture.',
    challenge:
      'The public ADSB.lol feed answers a limited circle per request and often says 429, so the server fetches small tiles under a request budget and shares them between viewers. The map has to stay smooth and honest about how old each area is, and no source provides a complete trace, so the track is the server’s own record of what it has seen.',
    outcome:
      'A map that stays smooth with thousands of aircraft, a photo for every aircraft (the exact airframe, a representative type photo, or an illustration), and a compact binary API that costs a 304 for unchanged areas. Its README states the data limits plainly.',
    details: [
      'WebGL2 aircraft layer on MapLibre with dead reckoning, corrections eased in over 1.5 s, and one representative aircraft per grid cell when zoomed far out.',
      'Flight panel with photo, route, history charts, the whole track since take-off and the route ahead, plus search, airports with METAR and TAF, and filters that live in the URL.',
      'Pure-Python Starlette server with a shared tile cache, SQLite track checkpoints and no native wheels, documented for self-hosting on a small always-on server.',
    ],
    technologies: [
      'Python',
      'Starlette',
      'Svelte 5',
      'TypeScript',
      'MapLibre GL',
      'WebGL2',
      'SQLite',
      'Playwright',
    ],
    repositoryUrl: 'https://github.com/MaciejZiel/contrail',
    repositoryLabel: 'Source code',
    repositoryNote:
      'Self-hosted on a home server. Data from ADSB.lol, credited in the app.',
    liveDemoUrl: 'https://contrail.maciejzielinski.dev',
    stageLabel: 'Live data route',
    status: 'Live demo / self-hosted',
    year: '2026',
    theme: 'vision',
    visualization: 'flight-route',
    metrics: [
      { label: 'Live feed', value: 'ADSB.lol, tiled and budgeted' },
      { label: 'Rendering', value: 'WebGL2 with dead reckoning' },
      { label: 'Per flight', value: 'Photo, track since take-off, route ahead' },
    ],
    artifactTitle: 'Live position pipeline',
    artifactSummary:
      'One polite fetcher feeds a shared tile cache; the browser turns compact binary tiles into moving aircraft.',
    artifactLanes: [
      {
        label: 'Sources',
        summary: 'Aircraft positions arrive in 5 degree tiles, fetched under a request budget that backs off on 429.',
        items: ['ADSB.lol tiles', 'Request budget', 'Reference data'],
      },
      {
        label: 'Tracks',
        summary: 'The server keeps compact tiles and the track of each flight it has seen.',
        items: ['32-byte records', 'Track since take-off', 'SQLite checkpoints'],
      },
      {
        label: 'Map',
        summary: 'The browser extrapolates every aircraft each frame and opens a panel per flight.',
        items: ['WebGL2 layer', 'Dead reckoning', 'Photo, route, ETA'],
      },
    ],
  },
  {
    name: 'Reroute',
    category: 'Live transit app and delay model',
    headline:
      'A live Warsaw tram and bus map: click a stop, pick a line, see the vehicles and how late they are.',
    context:
      'Built around one question, is my tram or bus coming and is it late, on the Warsaw timetable and the live GTFS-Realtime vehicle feed.',
    summary:
      'Click a stop to see every line that serves it with the next departures. Pick a line to see its route and its moving vehicles, outlined by delay, then click a vehicle for its delay against the timetable and its next stops. Underneath, a collector writes every vehicle observation and stop arrival to PostgreSQL with PostGIS, feeding a delay-prediction model that shows its reasoning and an 80% range for each stop.',
    challenge:
      'A delay is only meaningful if the live vehicle is matched to the right timetable trip. After-midnight trips, the daylight-saving night, loop lines, stale positions and gaps in the feed all break naive matching, so each case is covered by tests.',
    outcome:
      'A working live map with a delay model on top. On a held-out last hour the model\'s mean error is about 41 seconds against 44 for simply keeping the current delay, around 9% lower, and its 80% range covers about 80% of outcomes. That is one evening of data, and the app says so.',
    details: [
      'Stop, line and vehicle in three steps, with a bottom sheet on small screens and a switch that limits a line to the vehicles still heading to your stop.',
      'A separate collector polls the feeds every 20 seconds and stores observations, derived arrival events and service alerts, with partitions, retention and replay of raw snapshots.',
      'FastAPI backend with a PostGIS schema, a React and MapLibre frontend, and CI that runs the database tests against a PostGIS service.',
    ],
    technologies: [
      'Python',
      'FastAPI',
      'SQLAlchemy 2',
      'PostgreSQL',
      'PostGIS',
      'React',
      'TypeScript',
      'MapLibre GL',
      'GTFS-Realtime',
      'Docker',
    ],
    repositoryUrl: 'https://github.com/MaciejZiel/Reroute',
    repositoryLabel: 'Source code',
    repositoryNote:
      'Includes the LightGBM delay model with a persistence baseline, per-prediction explanations and a documented evaluation, plus the live app, the collector and the training pipeline.',
    liveDemoUrl: 'https://reroute.maciejzielinski.dev',
    stageLabel: 'Transit pipeline',
    status: 'Live demo / collecting data',
    year: '2026',
    theme: 'track',
    metrics: [
      { label: 'Live data', value: 'GTFS timetable + GTFS-Realtime' },
      { label: 'Storage', value: 'PostgreSQL 16 + PostGIS' },
      { label: 'Model', value: 'LightGBM, about 9% lower error' },
    ],
    artifactTitle: 'From feed to prediction',
    artifactSummary:
      'The same recorded observations drive the live view and train the delay model.',
    artifactLanes: [
      {
        label: 'Ingest',
        summary: 'A collector polls the realtime feeds and stores every observation next to the imported timetable.',
        items: ['GTFS-Realtime feeds', 'Timetable import', 'PostGIS storage'],
      },
      {
        label: 'Serve',
        summary: 'The API matches live vehicles to timetable trips and works out each delay.',
        items: ['Stop panel', 'Line focus', 'Vehicle delay'],
      },
      {
        label: 'Predict',
        summary: 'Recorded arrivals become training rows. A gradient-boosted model predicts the delay at each stop and explains the main factors.',
        items: ['Arrival events', 'LightGBM model', 'Per-stop explanation'],
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
    repositoryLabel: 'Source code',
    repositoryNote:
      'Read-only demo on a home server with a one-click demo account. Source, setup instructions and verification details are in the repository.',
    liveDemoUrl: 'https://caseflow.maciejzielinski.dev',
    stageLabel: 'Workflow engine',
    status: 'Live demo / multi-tenant backend',
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
    repositoryLabel: 'Source code',
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
]

export const projectRail: ProjectRailItem[] = [
  {
    name: 'pgqueue',
    description:
      'A job queue on PostgreSQL: SKIP LOCKED claiming, leases, retries and a live SSE dashboard.',
    href: 'https://github.com/MaciejZiel/pgqueue',
    liveDemoUrl: 'https://pgqueue.maciejzielinski.dev',
  },
  {
    name: 'Gravity Studio',
    description:
      'An interactive Solar System viewer: a Pygame desktop app and a Three.js browser version with JPL orbital elements.',
    href: 'https://gravity.maciejzielinski.dev',
    liveDemoUrl: 'https://gravity.maciejzielinski.dev',
  },
  {
    name: 'plan-bot',
    description: 'A Discord and Telegram bot that answers timetable questions from an ICS feed.',
    href: 'https://github.com/MaciejZiel/plan-bot',
  },
  {
    name: 'firm-radar',
    description: 'Polish company profiles from public registries, with change tracking.',
    href: 'https://github.com/MaciejZiel/firm-radar',
  },
  {
    name: 'Motorsport_API',
    description: 'A documented Django REST API for race results, teams, drivers and standings.',
    href: 'https://github.com/MaciejZiel/Motorsport_API',
  },
  {
    name: 'hand_gesture_control',
    description: 'OpenCV + MediaPipe gesture control with smoothing and configurable mappings.',
    href: 'https://github.com/MaciejZiel/hand_gesture_control',
  },
]

export const selfHostedDemos: SelfHostedDemos = {
  label: 'Self-hosted demos',
  statusLabel: 'System status',
  statusUrl: 'https://status.maciejzielinski.dev',
}

// One accent per project, so no two projects share a colour whatever their motion theme.
const projectAccents: Record<string, string> = {
  'pytest-queryguard': '#f2d76b',
  Contrail: '#f07887',
  Reroute: '#82b1ff',
  CaseFlow: '#7be4b8',
  clip_to_text: '#ffb86c',
}

export const projectAccent = (name: string) => projectAccents[name]

export const projectAnchorId = (name: string) =>
  `project-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

const projectDisplayNames: Record<string, string> = {
  'pytest-queryguard': 'PYTEST-QUERYGUARD',
  Contrail: 'CONTRAIL',
  Reroute: 'REROUTE',
  CaseFlow: 'CASEFLOW',
  clip_to_text: 'CLIP TO TEXT',
  Motorsport_API: 'MOTORSPORT API',
  hand_gesture_control: 'HAND GESTURE CONTROL',
  'plan-bot': 'PLAN-BOT',
  'firm-radar': 'FIRM-RADAR',
  pgqueue: 'PGQUEUE',
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
    name: 'Contrail',
    description: 'A live flight tracker on WebGL with a photo, the full track and the route ahead for every aircraft.',
    anchorId: projectAnchorId('Contrail'),
  },
  {
    name: 'Reroute',
    description: 'Live Warsaw trams and buses with delays, and a model that predicts arrival delays.',
    anchorId: projectAnchorId('Reroute'),
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
