'use client'

import { motion } from 'framer-motion'
import { cascadeContainer, cascadeItem } from './stagger'

const FEATURED = ['Next.js', 'React', 'TypeScript', 'Laravel', 'Python / FastAPI', 'LangChain', 'Supabase']

const GROUPS = [
  { label: 'Frontend',       color: '#60a5fa', skills: ['JavaScript', 'Tailwind CSS', 'shadcn/ui', 'Three.js', 'D3.js', 'React Flow', 'Framer Motion', 'GSAP', 'HTML5', 'CSS3'] },
  { label: 'Backend & AI',   color: '#b07cff', skills: ['PHP', 'RAG Pipelines', 'Groq API', 'n8n', 'LLM Integration', 'REST APIs', 'Prompt Engineering'] },
  { label: 'Data & Cloud',   color: '#4ade80', skills: ['PostgreSQL', 'MySQL', 'pgvector', 'DynamoDB', 'AWS Amplify', 'Vercel', 'Railway'] },
  { label: 'AI Dev Tools',   color: '#ffd27c', skills: ['Claude', 'Claude Code', 'Cursor', 'GitHub Copilot'] },
  { label: 'Design & Other', color: '#f87171', skills: ['Figma', 'Git / GitHub', 'Agile / Scrum', 'QA Testing', 'Microsoft Clarity', 'Wix', 'Resend API'] },
]

const CERTS = [
  { issuer: 'IBM',      name: 'Generative AI for Growth Marketing Specialization',  sub: '3 courses via Coursera', color: '#4f8ef7' },
  { issuer: 'AWS',      name: 'Academy Cloud Foundations',                           sub: 'Amazon Web Services',    color: '#ff9900' },
  { issuer: 'AWS',      name: 'Academy Cloud Operations',                            sub: 'Amazon Web Services',    color: '#ff9900' },
  { issuer: 'Alliance', name: 'Software Engineering Program',                        sub: 'React · JS · TS · .NET · C#', color: '#a78bfa' },
]

const pill = (color?: string): React.CSSProperties => ({
  fontSize: 12, color: color ?? 'rgba(255,255,255,0.6)',
  padding: '4px 11px',
  background: color ? `${color}12` : 'rgba(255,255,255,0.04)',
  borderRadius: 5,
  border: `1px solid ${color ? `${color}30` : 'rgba(255,255,255,0.08)'}`,
  lineHeight: 1.4, whiteSpace: 'nowrap' as const,
})

export default function SkillsPanel() {
  return (
    <motion.div variants={cascadeContainer} initial="hidden" animate="show" style={{ color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <motion.p variants={cascadeItem} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#7cffb0', marginBottom: 6 }}>
        Behind the Lens
      </motion.p>
      <motion.h2 variants={cascadeItem} style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 22, fontWeight: 600, marginBottom: 18 }}>
        The toolkit that powers the films.
      </motion.h2>

      {/* Core stack — featured */}
      <motion.div variants={cascadeItem} style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em', marginBottom: 10 }}>Core Stack</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {FEATURED.map(s => (
            <span key={s} style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 14, fontWeight: 600,
              color: '#fff',
              padding: '6px 16px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.14)',
              letterSpacing: '0.02em',
            }}>{s}</span>
          ))}
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div variants={cascadeItem} style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }} />

      {/* Skill groups — 2-col grid */}
      <motion.div variants={cascadeItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px', marginBottom: 20 }}>
        {GROUPS.map(g => (
          <div key={g.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${g.color}22` }}>
              <div style={{ width: 3, height: 16, borderRadius: 2, background: g.color, flexShrink: 0 }} />
              <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', color: g.color }}>
                {g.label}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {g.skills.map(s => (
                <span key={s} style={pill()}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Divider */}
      <motion.div variants={cascadeItem} style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }} />

      {/* Certifications */}
      <motion.div variants={cascadeItem} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
        <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em' }}>Certifications</div>
      </motion.div>

      <motion.div variants={cascadeItem} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {CERTS.map(c => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: c.color, minWidth: 56, flexShrink: 0,
            }}>{c.issuer}</span>
            <div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{c.sub}</div>
            </div>
          </div>
        ))}
      </motion.div>

    </motion.div>
  )
}
