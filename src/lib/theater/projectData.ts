export interface Project {
  id: string
  title: string
  role: string
  year: string
  status: 'Deployed' | 'Production' | 'Live Demo' | 'In Development'
  genreTag: string
  description: string
  tags: string[]
  codeSnippet: string
  ctaLabel?: string
  ctaHref?: string
  featured: boolean
  /** Optional key-art poster (2:3 portrait) — falls back to the canvas-drawn poster when absent */
  posterImage?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'one-tap',
    title: 'One Tap',
    role: 'Full-Stack · Capstone',
    year: '2026',
    status: 'Deployed',
    genreTag: 'Community Drama',
    description: 'Full-stack HOA management platform serving 3 user roles — residents, officers, and admins. Built multimedia issue reporting (image/audio/video), facility reservation flows, and an AI-powered assistant. Deployed on Railway with role-based auth, real-time dashboards, and mobile-responsive interfaces.',
    tags: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'Railway'],
    codeSnippet: `// Role-based dashboard routing
Route::middleware(['auth', 'role:admin'])
  ->group(fn() => Route::resource('reports', ReportController::class));`,
    featured: false,
    posterImage: '/posters/onetap.png',
  },
  {
    id: 'digital-twin',
    title: 'Digital Twin Visualization',
    role: 'Frontend · 3D · Internship',
    year: '2026',
    status: 'Production',
    genreTag: 'Real-time Sci-Fi ★ Featured Premiere',
    description: 'Production 3D visualization system built at Xeleqt AI for monitoring live infrastructure. Rendered real-time device positions across multiple asset categories using instanced meshes, layered Mapbox GL maps, and Deck.gl overlays. Supported live diagnostics with sub-second data refresh.',
    tags: ['Three.js', 'Mapbox GL', 'Deck.gl', 'Next.js'],
    codeSnippet: `// Live device position updates via InstancedMesh
const mesh = instancedRef.current
devices.forEach((d, i) => {
  dummy.position.set(d.lng, d.lat, d.alt)
  dummy.updateMatrix()
  mesh.setMatrixAt(i, dummy.matrix)
})
mesh.instanceMatrix.needsUpdate = true`,
    ctaLabel: 'View Work',
    ctaHref: '#',
    featured: true,
  },
  {
    id: 'dev-day-one',
    title: 'Dev Day One',
    role: 'Full-Stack · AI · RAG Platform',
    year: '2026',
    status: 'In Development',
    genreTag: 'Onboarding Odyssey',
    description: 'A full-stack RAG platform that connects to any GitHub repository, indexes it with vector embeddings, and gives engineering teams an AI that actually understands their codebase. New hires ask natural-language questions and get cited, code-grounded answers instead of digging through outdated docs — while teams get auto-generated architecture maps, pattern detection, and change-impact analysis for free.',
    tags: ['Next.js', 'FastAPI', 'pgvector', 'Groq', 'Supabase'],
    codeSnippet: `# Retrieve relevant code chunks via pgvector similarity search
async def retrieve_context(query: str, repo_id: str):
    embedding = await embed_text(query)
    rows = await db.fetch(
        """SELECT content, file_path FROM code_chunks
           WHERE repo_id = :repo_id
           ORDER BY embedding <=> :embedding LIMIT 8""",
        repo_id=repo_id, embedding=embedding,
    )
    return [r["content"] for r in rows]`,
    featured: false,
    posterImage: '/posters/devdayone.png',
  },
  {
    id: 'coming-soon',
    title: 'Coming Soon',
    role: 'Next Project · TBA',
    year: '2026',
    status: 'In Development',
    genreTag: 'Stay Tuned',
    description: 'Something new is in the works. Check back soon.',
    tags: ['TBA'],
    codeSnippet: '// to be continued…',
    featured: false,
  },
]
