'use client'

import { motion } from 'framer-motion'
import TechStack from '@/components/ui/TechStack'
import { cascadeContainer, cascadeItem } from './stagger'

const certifications = [
  { issuer: 'IBM',      name: 'Generative AI: Prompt Engineering Basics',           color: 'rgba(79,142,247,0.8)' },
  { issuer: 'IBM',      name: 'Generative AI: Introduction and Applications',       color: 'rgba(79,142,247,0.8)' },
  { issuer: 'AWS',      name: 'AWS Academy Cloud Foundations',                      color: 'rgba(255,153,0,0.8)' },
  { issuer: 'AWS',      name: 'AWS Academy Cloud Operations',                       color: 'rgba(255,153,0,0.8)' },
  { issuer: 'Coursera', name: 'Generative AI for Growth Marketing Specialization',  color: 'rgba(74,222,128,0.8)' },
  { issuer: 'Coursera', name: 'AI-Driven Growth Marketing Strategy',               color: 'rgba(74,222,128,0.8)' },
]

const label: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.28)', marginBottom: 16,
}

export default function SkillsPanel() {
  return (
    <motion.div variants={cascadeContainer} initial="hidden" animate="show">
      <motion.p variants={cascadeItem} style={{ ...label, color: '#7cffb0', marginBottom: 8 }}>Behind the Lens</motion.p>
      <motion.h2 variants={cascadeItem} style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 28 }}>The toolkit that powers the films.</motion.h2>

      <motion.p variants={cascadeItem} style={label}>Tech Stack</motion.p>
      <motion.div variants={cascadeItem}>
        <TechStack />
      </motion.div>

      <motion.p variants={cascadeItem} style={{ ...label, marginTop: 28 }}>Certifications</motion.p>
      <motion.div variants={cascadeItem} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {certifications.map(c => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.color, minWidth: 60 }}>{c.issuer}</span>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{c.name}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
