'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cascadeContainer, cascadeItem } from './stagger'

const label: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.28)', marginBottom: 6,
}

const skillGroups = [
  { name: 'Frontend',          color: '#60a5fa', items: ['React.js', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'] },
  { name: 'Backend',           color: '#4ade80', items: ['Laravel', 'PHP', 'REST APIs', 'Auth Systems', 'CRUD'] },
  { name: '3D / Visualization', color: '#b07cff', items: ['Three.js', 'Mapbox GL', 'Deck.gl'] },
  { name: 'Cloud & DevOps',    color: '#fbbf24', items: ['AWS Amplify', 'Railway', 'Vercel', 'Git / GitHub'] },
  { name: 'Database',          color: '#f87171', items: ['MySQL', 'PostgreSQL', 'Firebase'] },
  { name: 'Design & QA',       color: '#ffd27c', items: ['Figma', 'Wix Studio', 'Manual QA', 'Mobile Testing'] },
]

const certifications = [
  { issuer: 'IBM',      name: 'Generative AI: Prompt Engineering Basics',          color: 'rgba(79,142,247,0.9)' },
  { issuer: 'IBM',      name: 'Generative AI: Introduction and Applications',      color: 'rgba(79,142,247,0.9)' },
  { issuer: 'AWS',      name: 'AWS Academy Cloud Foundations',                     color: 'rgba(255,153,0,0.9)' },
  { issuer: 'AWS',      name: 'AWS Academy Cloud Operations',                      color: 'rgba(255,153,0,0.9)' },
  { issuer: 'Coursera', name: 'Generative AI for Growth Marketing Specialization', color: 'rgba(74,222,128,0.9)' },
]

const bullets = [
  'Developed responsive, production-ready web interfaces for 3 company products using Next.js, React, and TypeScript — deployed on AWS Amplify and Railway.',
  'Built real-time 3D digital twin dashboards for infrastructure monitoring using Three.js, Mapbox GL, and Deck.gl, rendering live device data across multiple asset categories.',
  'Implemented role-based authentication and CRUD systems with Laravel and MySQL, supporting admin, officer, and resident workflows.',
  'Executed manual regression testing across 15+ features on Android and iOS — validating online/offline behavior and cross-device consistency across sprint cycles.',
]

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
    <motion.div variants={cascadeContainer} initial="hidden" animate="show" style={{ color: '#fff' }}>
      <motion.p variants={cascadeItem} style={{ ...label, color: '#ffd27c', marginBottom: 10 }}>Meet the Director</motion.p>

      {/* Hero row */}
      <motion.div variants={cascadeItem} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 20, marginBottom: 22 }}>
        <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '3/4', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Image
            src="/harvy-profile.jpg"
            alt="Harvy H. Monte de Ramos"
            fill
            style={{ objectFit: 'cover' }}
            sizes="80px"
            priority
          />
        </div>
        <div>
          <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 18, fontWeight: 600, lineHeight: 1.1, marginBottom: 8 }}>
            Harvy H. Monte de Ramos
          </h2>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>
            Early-career Frontend &amp; Full Stack Developer with hands-on production experience at an AI startup.
            Focused on responsive UI, modern web experiences, and scalable application development.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div><div style={label}>Local Time</div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13 }}>{time || '--:--:--'}</div></div>
            <div><div style={label}>Location</div><div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Cebu, PH · UTC+8</div></div>
            <div>
              <div style={label}>Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', display: 'block' }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: '#4ade80' }}>Open to work</span>
              </div>
            </div>
            <div><div style={label}>Graduating</div><div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>June 2026 · USJ-R</div></div>
          </div>
          <a href="/cv.pdf" download style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14,
            padding: '7px 16px', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 11, color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
          }}>↓ Download CV</a>
        </div>
      </motion.div>

      {/* Experience */}
      <motion.p variants={cascadeItem} style={{ ...label, marginBottom: 10 }}>Experience</motion.p>
      <motion.div variants={cascadeItem} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '18px 20px', marginBottom: 24, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 15, fontWeight: 600 }}>Xeleqt AI — Cebu City</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>Frontend Developer Intern</div>
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Mar – Jun 2026</div>
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.52)' }}>{b}</li>
          ))}
        </ul>
      </motion.div>

      {/* Tech Stack grid */}
      <motion.p variants={cascadeItem} style={{ ...label, marginBottom: 12 }}>Tech Stack</motion.p>
      <motion.div variants={cascadeItem} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        {skillGroups.map(g => (
          <div key={g.name} style={{ padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: g.color, marginBottom: 8 }}>{g.name}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {g.items.map(s => (
                <span key={s} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10.5, color: 'rgba(255,255,255,0.6)', padding: '2px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.07)' }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Certifications */}
      <motion.p variants={cascadeItem} style={{ ...label, marginBottom: 10 }}>Certifications</motion.p>
      <motion.div variants={cascadeItem} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {certifications.map(c => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.color, minWidth: 58, flexShrink: 0 }}>{c.issuer}</span>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11.5, color: 'rgba(255,255,255,0.5)' }}>{c.name}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
