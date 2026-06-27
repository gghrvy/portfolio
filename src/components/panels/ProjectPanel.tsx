'use client'

import { motion } from 'framer-motion'
import { useTheaterStore } from '@/store/theaterStore'
import { PROJECTS } from '@/lib/theater/projectData'
import { cascadeContainer, cascadeItem } from './stagger'

const label: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.28)',
}

export default function ProjectPanel() {
  const activeProject = useTheaterStore(s => s.activeProject)
  const setProject = useTheaterStore(s => s.setProject)
  const project = PROJECTS.find(p => p.id === activeProject)

  if (!project) {
    return (
      <motion.div variants={cascadeContainer} initial="hidden" animate="show">
        <motion.p variants={cascadeItem} style={{ ...label, color: '#b07cff', marginBottom: 12 }}>Now Showing</motion.p>
        <motion.p variants={cascadeItem} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
          Choose a film from the poster wall.
        </motion.p>
        <motion.div variants={cascadeItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {PROJECTS.map(p => (
            <button
              key={p.id}
              onClick={() => setProject(p.id)}
              style={{
                padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderLeft: `3px solid ${p.featured ? '#ffd27c' : '#b07cff'}`,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: p.featured ? '#ffd27c' : '#9b8bc0', marginBottom: 4 }}>{p.genreTag}</div>
                <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 14, fontWeight: 600, color: '#fff' }}>{p.title}</div>
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginTop: 2 }}>{p.year}</div>
            </button>
          ))}
        </motion.div>
      </motion.div>
    )
  }

  const statusColor = project.status === 'Deployed' || project.status === 'Production' ? '#4ade80'
    : project.status === 'Live Demo' ? '#60a5fa' : '#fbbf24'

  return (
    <motion.div variants={cascadeContainer} initial="hidden" animate="show">
      <motion.div variants={cascadeItem} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <p style={{ ...label, color: project.featured ? '#ffd27c' : '#b07cff' }}>{project.genreTag}</p>
        <button onClick={() => setProject(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 11, fontFamily: "'Space Mono', monospace" }}>← All films</button>
      </motion.div>

      <motion.h2 variants={cascadeItem} style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 28, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{project.title}</motion.h2>
      <motion.p variants={cascadeItem} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{project.role} · {project.year}</motion.p>
      <motion.p variants={cascadeItem} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: statusColor, marginBottom: 20 }}>● {project.status}</motion.p>

      <motion.p variants={cascadeItem} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', marginBottom: 24 }}>{project.description}</motion.p>

      {project.screenshots && project.screenshots.length > 0 && (
        <motion.div variants={cascadeItem} style={{ marginBottom: 24 }}>
          <p style={{ ...label, marginBottom: 8 }}>Screens</p>
          <div style={{
            display: 'flex', gap: 8, overflowX: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: 4,
          }}>
            {project.screenshots.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                style={{
                  height: 110, width: 'auto', borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.08)',
                  flexShrink: 0, objectFit: 'cover',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={cascadeItem} style={{ marginBottom: 24 }}>
        <p style={{ ...label, marginBottom: 8 }}>Cast &amp; Crew</p>
        <div style={{ display: 'flex', gap: 0, flexDirection: 'column' }}>
          {project.tags.map((t, i) => (
            <div key={t} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '5px 0',
              borderBottom: i < project.tags.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{t}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                {i === 0 ? 'Lead' : i === 1 ? 'Supporting' : 'Ensemble'}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {project.ctaLabel && project.ctaHref && (
        <motion.a
          variants={cascadeItem}
          href={project.ctaHref}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, background: 'rgba(255,255,255,0.06)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 600, color: '#fff', textDecoration: 'none' }}
        >
          {project.ctaLabel}
        </motion.a>
      )}
    </motion.div>
  )
}
