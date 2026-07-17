'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cascadeContainer, cascadeItem } from './stagger'

function Meta({ label, value, mono, color }: { label: string; value: string; mono?: boolean; color?: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: mono ? "'Space Mono', monospace" : "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: color ?? 'rgba(255,255,255,0.75)', lineHeight: 1.3 }}>{value}</div>
    </div>
  )
}

export default function AboutPanel() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div variants={cascadeContainer} initial="hidden" animate="show" style={{ color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <motion.p variants={cascadeItem} style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#ffd27c', marginBottom: 18 }}>
        Meet the Director
      </motion.p>

      {/* Hero */}
      <motion.div variants={cascadeItem} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 24, marginBottom: 22 }}>

        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '3/4', border: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
          <Image src="/harvy-profile.jpg" alt="Harvy H. Monte de Ramos" fill style={{ objectFit: 'cover' }} sizes="140px" priority />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 26, fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>
              Harvy H. Monte de Ramos
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.55)' }}>
              Full stack developer with a strong track record of shipping AI-integrated web apps, community platforms, and SaaS tools end to end. React/Next.js frontend, Python (FastAPI) and Laravel backend, PostgreSQL on the data layer. Built production RAG pipelines using LangChain and LLM APIs. Uses Claude Code as a core daily tool, not just autocomplete.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
            <Meta label="Local Time"  value={time || '--:--:--'} mono />
            <Meta label="Location"    value="Cebu City, PH · UTC+8" />
            <Meta label="Status"      value="● Open to work" color="#4ade80" />
            <Meta label="Graduating"  value="June 2026 · USJ-R" />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: 'GitHub',   href: 'https://github.com/gghrvy' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/harvy-montederamos' },
              { label: 'Email',    href: 'mailto:harvyh.montederamos@gmail.com' },
            ].map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{
                padding: '7px 16px', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 7,
                background: 'rgba(255,255,255,0.05)', fontSize: 12, color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none', fontFamily: "'Space Mono', monospace", letterSpacing: '0.08em',
              }}>{link.label}</a>
            ))}
            <a href="/cv.pdf" download style={{
              padding: '7px 16px', border: '1px solid rgba(255,210,124,0.4)', borderRadius: 7,
              background: 'rgba(255,210,124,0.08)', fontSize: 12, color: '#ffd27c',
              textDecoration: 'none', fontFamily: "'Space Mono', monospace", letterSpacing: '0.08em',
            }}>↓ CV</a>
          </div>
        </div>
      </motion.div>

      <motion.div variants={cascadeItem} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: 20 }} />

      {/* Experience */}
      <motion.div variants={cascadeItem} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: 'rgba(255,210,124,0.6)', flexShrink: 0 }} />
        <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>Experience</div>
      </motion.div>

      <motion.div variants={cascadeItem} style={{ borderLeft: '3px solid rgba(255,210,124,0.4)', paddingLeft: 18, marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 17, fontWeight: 600 }}>Xeleqt Technology Innovations Inc.</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>Software Developer Intern · Award-Winning AIoT Startup, Cebu City</div>
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.28)', flexShrink: 0, marginLeft: 12 }}>Mar 2026 – Present</div>
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.58)' }}>Developed and deployed the company website with an integrated AI chatbot on AWS Amplify + Microsoft Clarity analytics</li>
          <li style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.58)' }}>Built a digital twin visualization prototype translating real-time sensor data into an interactive 3D UI (Three.js, Mapbox GL, Deck.gl)</li>
          <li style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.58)' }}>Comprehensive QA across iOS, Android, and React web — functionality, regression, edge cases, and cross-platform behavior</li>
          <li style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.58)' }}>3D asset testing for the company's AIoT hardware product line · Agile/Scrum ceremonies weekly</li>
        </ul>
      </motion.div>

      <motion.div variants={cascadeItem} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: 20 }} />

      {/* Education */}
      <motion.div variants={cascadeItem} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: 'rgba(147,197,253,0.6)', flexShrink: 0 }} />
        <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>Education</div>
      </motion.div>

      <motion.div variants={cascadeItem} style={{ borderLeft: '3px solid rgba(147,197,253,0.35)', paddingLeft: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 17, fontWeight: 600 }}>University of San Jose-Recoletos</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>BS Information Technology — Web Applications Development · Cebu City</div>
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.28)', flexShrink: 0, marginLeft: 12 }}>2022 – 2026</div>
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
          <li style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.58)' }}>Bronze Loyalty Award recipient · Active in sports and esports competitions</li>
          <li style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.58)' }}>Submitted two projects to Solutionsfest 2026: BantayKo (AI personal safety app) and a barangay community digitization platform</li>
        </ul>
      </motion.div>

    </motion.div>
  )
}
