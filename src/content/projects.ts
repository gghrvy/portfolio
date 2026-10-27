// Hotspot x/y are percentages of the screenshot. Every note describes something visible in that screen.
export type Hotspot = { x: number; y: number; title: string; body: string }
export type Shot = { src: string; alt: string; width: number; height: number; label: string; note: string; hotspots?: Hotspot[] }
export type Fact = { term: string; detail: string }

export type Project = {
  id: string
  index: string
  kicker: string
  name: string
  summary: string
  role: string
  problem: string
  outcome: string
  stack: string[]
  tone: 'dark' | 'light'
  approach: { label: string; heading: string; body: string; facts: Fact[] }
  result: { label: string; heading: string; body: string }
  flow: string[]
  shots: [Shot, Shot, Shot]
}

export const workIntro = {
  heading: 'Evidence of how I build.',
  body: 'I prioritize projects that expose a real system: inputs, decisions, automation, and the interface where the outcome becomes useful.',
  demo: 'Want a project demo? Email me',
}

export const projects: Project[] = [
  {
    id: 'prospectos',
    index: '01',
    kicker: 'Sales intelligence / outbound workflow',
    name: 'Prospectos',
    summary: 'An AI-powered prospecting platform that discovers local businesses, audits their websites for verified opportunities, and manages controlled Gmail outreach.',
    role: 'Full-stack developer · personal project',
    problem: 'Outbound pitches are usually generic, and often recommend a feature the business already has.',
    outcome: 'Evidence-backed drafts, sent only after Gmail approval',
    stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Playwright', 'Ollama', 'Gmail API', 'OpenStreetMap'],
    tone: 'dark',
    approach: {
      label: 'Discovery / qualified local leads',
      heading: 'Find a market before writing the first email.',
      body: 'Prospectos searches local businesses by category and location, then makes the discovery set usable with contactability signals, website presence, filters, and Prospect Fit scoring.',
      facts: [
        { term: 'Source', detail: 'OpenStreetMap and Geoapify discovery for category and city searches' },
        { term: 'Triage', detail: 'Email-ready leads, website signals, review context, and audit potential' },
      ],
    },
    result: {
      label: 'Audit to delivery',
      heading: 'Evidence carries through to approval.',
      body: 'A crawl identifies a credible conversion or automation gap, ranks it by confidence, and gives the outbound draft one supported sales angle rather than a generic pitch.',
    },
    flow: ['Crawl', 'verified finding', 'selected angle', 'reviewed draft'],
    shots: [
      { src: '/screenshots/prospectos discovery.png', alt: 'Prospectos local business discovery map and prospect results', width: 1893, height: 1036, label: 'Discovery / location, category, and lead filters', note: 'A real search area and lead set before a business enters the outreach workflow.', hotspots: [{x: 21,y: 17,title: "Category and city search",body: "Businesses are discovered through OpenStreetMap and Geoapify, by category and location."},{x: 62,y: 41,title: "Search area",body: "The map sets the search centre and radius, so the lead set is a real, bounded market."},{x: 12,y: 91,title: "Prospect Fit filters",body: "Leads are triaged by fit score, reviews, website presence and contact path, including email-ready only."},{x: 87,y: 5,title: "Gmail connection",body: "Outreach runs through a connected Gmail account, so nothing is sent from a mystery server."}] },
      { src: '/screenshots/prospectos audit.png', alt: 'Prospectos website audit with scored evidence and responsive page captures', width: 1899, height: 1036, label: 'Audit / opportunity scoring and evidence', note: 'Confidence, supporting signals, and desktop/mobile captures keep the recommendation defensible.', hotspots: [{x: 49,y: 33,title: "Overall audit score",body: "Each crawl is scored across mobile, technical, conversion, design, content and customer experience."},{x: 47,y: 56,title: "Opportunity areas",body: "Detected gaps become named opportunities, each backed by a specific finding listed below it."},{x: 44,y: 81,title: "Crawl evidence",body: "The audit records pages crawled, depth, HTTPS and broken links, then captures desktop and mobile views."}] },
      { src: '/screenshots/prospectos outreach.png', alt: 'Prospectos Gmail-connected evidence-based outreach draft awaiting approval', width: 1890, height: 1050, label: 'Outreach / Gmail-connected review', note: 'The audit finding becomes a draft that is reviewed and approved before delivery.', hotspots: [{x: 13,y: 13,title: "One primary angle",body: "The strongest opportunity is chosen, with its evidence and a confidence score shown beside it."},{x: 14,y: 45,title: "Not recommended",body: "Angles the evidence does not support are listed explicitly, so the pitch never claims a missing feature that exists."},{x: 66,y: 70,title: "Draft, then approve",body: "Drafts are generated into the connected Gmail account and reviewed before anything is sent."}] },
    ],
  },
  {
    id: 'day-one',
    index: '02',
    kicker: 'B2B SaaS / RAG platform',
    name: 'Day One',
    summary: 'A team knowledge platform designed to preserve context when engineers leave and new people need answers quickly.',
    role: 'Full-stack developer · personal project',
    problem: 'Institutional knowledge is lost when senior engineers leave teams.',
    outcome: '8 core features shipped end to end',
    stack: ['Next.js', 'FastAPI', 'LangChain', 'Groq', 'Supabase', 'pgvector', 'React Flow'],
    tone: 'dark',
    approach: {
      label: 'Primary surface / Ask Repository',
      heading: 'Answers grounded in the codebase.',
      body: 'Repository content is ingested, chunked, indexed, and retrieved before the system responds. The interface keeps the source-oriented question flow visible instead of hiding it behind a generic chat screen.',
      facts: [
        { term: 'Input', detail: 'Repository context, architecture decisions, and engineering questions' },
        { term: 'Output', detail: 'Grounded answers designed for onboarding and ongoing system understanding' },
      ],
    },
    result: {
      label: 'Engineering context',
      heading: 'Architecture, then access.',
      body: 'The supporting interfaces make it easier to map a codebase and establish the team workspace before knowledge retrieval takes over.',
    },
    flow: ['Repository', 'index', 'retrieval', 'grounded answer'],
    shots: [
      { src: '/screenshots/dev-day-one-2.png', alt: 'Day One workspace showing source-grounded knowledge retrieval', width: 1912, height: 1061, label: 'Workspace / source-grounded knowledge retrieval', note: 'Repository-aware questions remain tied to their working context.', hotspots: [{x: 8,y: 27,title: "Feature surfaces",body: "Ask, onboarding, architecture, patterns, ADRs and APIs each live as their own view of the same indexed repository."},{x: 37,y: 23,title: "Cited sources",body: "Every answer lists the files it was retrieved from, so it can be checked rather than trusted."},{x: 52,y: 75,title: "Ask the codebase",body: "Questions run through a RAG pipeline: LangChain and the Groq API, with pgvector semantic search."}] },
      { src: '/screenshots/dev-day-one-3.png', alt: 'Day One architecture intelligence system map', width: 1907, height: 1041, label: 'Architecture intelligence / system mapping', note: 'Visual relationships help teams reason about the repository as a system.', hotspots: [{x: 40,y: 39,title: "Generated system map",body: "Architecture Intelligence draws services and their relationships with React Flow."},{x: 29,y: 90,title: "Typed nodes",body: "Nodes are classified as service, module, database, external or layer, so the map reads at a glance."},{x: 95,y: 11,title: "Re-analyze",body: "The map is regenerated from the indexed repository on demand, so it doesn't go stale."}] },
      { src: '/screenshots/dev-day-one-1.png', alt: 'Day One team sign-in screen', width: 1907, height: 1041, label: 'Entry point / team access', note: 'An explicit workspace entry point before shared knowledge becomes available.' },
    ],
  },
  {
    id: 'onetap',
    index: '03',
    kicker: 'Multi-tenant product',
    name: 'OneTap',
    summary: 'A community management platform for resident operations, issue reporting, facility reservations, and notification flows.',
    role: 'Full-stack developer · personal project',
    problem: 'Issue reports, reservations, and notices need one system that residents and staff share.',
    outcome: 'Live on Railway with Resend email notifications',
    stack: ['Laravel', 'PHP', 'MySQL', 'Livewire', 'JavaScript', 'Railway'],
    tone: 'light',
    approach: {
      label: 'Primary surface / Community map',
      heading: 'A resident app with a real operations layer.',
      body: 'Residents can report issues where they happen. Staff can track their status, coordinate follow-through, and manage community activity from the same system.',
      facts: [
        { term: 'People', detail: 'Residents, community staff, and administrators' },
        { term: 'Core flows', detail: 'Issue reports, reservations, notices, and account access' },
      ],
    },
    result: {
      label: 'Operational coverage',
      heading: 'From resident access to the daily workspace.',
      body: 'The product separates the resident experience from the staff-facing workflow while keeping both sides connected to the same community data.',
    },
    flow: ['Resident account', 'report or reserve', 'staff follow-through', 'notification'],
    shots: [
      { src: '/screenshots/one-tap-2.png', alt: 'OneTap community map and issue reporting operations', width: 1887, height: 1037, label: 'Community map / issue reporting', note: 'Location and status turn individual reports into an operational view.', hotspots: [{x: 49,y: 67,title: "Reports on the map",body: "Issues are pinned where they happen and coloured by status: pending, in progress or resolved."},{x: 52,y: 20,title: "Status filters",body: "The same reports filter by status, so staff can work the queue from one view."},{x: 87,y: 22,title: "Trustworthy score",body: "Resident access depends on a trust score, shown with what it takes to keep full access."},{x: 95,y: 92,title: "Assistant",body: "An AI chatbot helps residents find their way around the platform."}] },
      { src: '/screenshots/one-tap-1.png', alt: 'OneTap resident sign-in screen', width: 1887, height: 1037, label: 'Resident access / onboarding', note: 'A clear entry point for people using the community platform.' },
      { src: '/screenshots/one-tap-3.png', alt: 'OneTap community workspace', width: 1887, height: 1037, label: 'Community workspace / daily operations', note: 'Shared updates, issue visibility, and coordination for the community.' },
    ],
  },
]

export const aria = {
  label: 'Aria / product concept',
  role: 'Full-stack developer · personal project',
  outcome: 'In development',
  stack: ['Next.js', 'Three.js', 'Groq API', 'pgvector'],
  heading: 'Meet Aria.',
  title: 'A context-aware assistant for the work already in motion',
  body: 'Aria interprets a request, retrieves the context behind it, and returns the next useful response across projects, tasks, updates, and conversations.',
  traits: [
    { term: 'Understands', detail: 'Classifies intent and asks for clarification when confidence is low.' },
    { term: 'Connects', detail: 'Routes a request to project status, task management, agenda, or conversation context.' },
    { term: 'Remembers', detail: 'Uses session structure and vector-embedded memory chunks in Supabase pgvector.' },
  ],
  flow: ['Request', 'Intent', 'Context retrieval', 'Useful response'],
  footnote: 'In development · The portrait represents the product’s presence; the example describes the intended interaction model.',
  // Scripted walkthroughs of the intended routing: intent classification with confidence, then retrieval or clarification.
  demo: [
    { question: 'What changed in the Day One architecture?', intent: 'Project status', confidence: 0.91, retrieves: 'Recent project context, active tasks, and relevant memory.', response: 'A concise update with gaps surfaced before it answers.' },
    { question: 'Move the OneTap review to Friday.', intent: 'Task management', confidence: 0.88, retrieves: 'The task, its due date, and Friday on the agenda.', response: 'Rescheduled, after checking Friday for conflicts.' },
    { question: 'Can you look into that thing from yesterday?', intent: 'Unclear', confidence: 0.41, retrieves: 'Nothing yet. Confidence is below the threshold.', response: 'Asks which project you mean before retrieving anything.' },
  ],
}
