'use client'

import { useState, useRef, useEffect } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { AnimatePresence, motion } from 'framer-motion'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { useTheaterStore } from '@/store/theaterStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { EASE } from '@/lib/theater/easing'
import { sounds } from '@/lib/theater/sounds'
import { CARD_SEAT_POS } from './HouseLights'

const paperInput: React.CSSProperties = {
  width: '100%', padding: '4px 2px',
  background: 'transparent',
  border: 'none',
  borderBottom: '1.5px dotted rgba(60,40,20,0.45)',
  color: '#2a1c10',
  fontFamily: "'Caveat', 'Segoe Script', cursive",
  fontSize: 17, outline: 'none',
}

const paperLabel: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase',
  color: 'rgba(60,40,20,0.55)', display: 'block', marginBottom: 2,
}

export default function ReviewCard() {
  const groupRef = useRef<Group>(null)
  const activeSection = useTheaterStore(s => s.activeSection)
  const isTransitioning = useTheaterStore(s => s.isTransitioning)
  const setSection = useTheaterStore(s => s.setSection)
  const setHoveredZone = useTheaterStore(s => s.setHoveredZone)
  const reduced = useReducedMotion()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'stamped' | 'sent' | 'error'>('idle')

  const open = activeSection === 'contact' && !isTransitioning

  // Paper rustle as the card form appears
  useEffect(() => {
    if (open) sounds.play('rustle')
  }, [open])

  // Paper breathes almost imperceptibly, as if disturbed by air
  useFrame(({ clock }) => {
    if (reduced || !groupRef.current) return
    groupRef.current.rotation.y = 0.14 + Math.sin(clock.elapsedTime * 0.4) * 0.004
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) { setStatus('error'); return }
      sounds.play('thock')
      setStatus('stamped')                       // stamp slams
      setTimeout(() => setStatus('sent'), 1100)  // then card slides away
    } catch {
      setStatus('error')
    }
  }

  return (
    <group
      ref={groupRef}
      position={[CARD_SEAT_POS[0], CARD_SEAT_POS[1], CARD_SEAT_POS[2]]}
      rotation={[0, 0.14, 0]}
    >
      {/* The paper — always physically present, clickable from anywhere.
          Sized up from the spec's 0.5×0.7 for form readability at the
          contact shot distance: 0.85 units ≈ the 280px Html at DF 1.1 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerEnter={() => {
          if (!isTransitioning) { setHoveredZone('contact'); document.body.style.cursor = 'pointer' }
        }}
        onPointerLeave={() => { setHoveredZone(null); document.body.style.cursor = 'default' }}
        onClick={() => { if (!isTransitioning) setSection('contact') }}
      >
        <planeGeometry args={[0.85, 1.15]} />
        <meshStandardMaterial color="#f2e8d4" roughness={0.9} />
      </mesh>

      {/* Stub pencil beside the card */}
      <group position={[0.55, 0.005, 0.15]} rotation={[0, 0.5, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 6]} />
          <meshStandardMaterial color="#c8861a" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <coneGeometry args={[0.012, 0.04, 6]} />
          <meshStandardMaterial color="#3a2a18" roughness={0.8} />
        </mesh>
      </group>

      {/* The form — projected just above the paper while contact is open */}
      <Html
        transform
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        distanceFactor={1.1}
        style={{ width: 280, pointerEvents: open ? 'auto' : 'none' }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: reduced ? 0 : -14, rotate: reduced ? 0 : -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.45, ease: EASE.dom }}
              style={{
                width: 280, padding: '18px 20px', boxSizing: 'border-box',
                background: 'linear-gradient(175deg, #f6eedb 0%, #efe3c8 100%)',
                borderRadius: 3,
                boxShadow: '0 2px 14px rgba(0,0,0,0.35)',
                color: '#2a1c10',
              }}
            >
              {status === 'sent' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ textAlign: 'center', padding: '28px 0' }}
                >
                  <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                    Thank you for your review.
                  </p>
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: 'rgba(60,40,20,0.7)' }}>
                    The director will write back within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  animate={status === 'stamped' && !reduced ? { y: 60, opacity: 0, rotate: 4 } : {}}
                  transition={{ duration: 0.5, delay: 0.6, ease: EASE.dom }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  <div style={{ textAlign: 'center', borderBottom: '2px solid rgba(60,40,20,0.5)', paddingBottom: 8, marginBottom: 2 }}>
                    <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '0.06em' }}>
                      AUDIENCE REVIEW CARD
                    </p>
                    <p style={{ fontFamily: "'Caveat', cursive", fontSize: 13, color: 'rgba(60,40,20,0.6)' }}>
                      Tell the director what you thought
                    </p>
                    <p aria-hidden="true" style={{ fontSize: 12, letterSpacing: '0.2em', color: '#b8860b', marginTop: 3 }}>★★★★★</p>
                  </div>

                  <div>
                    <label style={paperLabel} htmlFor="rc-name">Name</label>
                    <input id="rc-name" style={paperInput} value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div>
                    <label style={paperLabel} htmlFor="rc-email">Email</label>
                    <input id="rc-email" type="email" style={paperInput} value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div>
                    <label style={paperLabel} htmlFor="rc-message">Your review</label>
                    <textarea id="rc-message" rows={3} style={{ ...paperInput, resize: 'none' }} value={message} onChange={e => setMessage(e.target.value)} required />
                  </div>

                  {/* Rubber-stamp send button */}
                  <motion.button
                    type="submit"
                    disabled={status === 'sending' || status === 'stamped'}
                    whileTap={reduced ? {} : { scale: 0.92 }}
                    animate={status === 'stamped' && !reduced ? { scale: [1.3, 1], rotate: [-8, -3] } : {}}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    style={{
                      alignSelf: 'center', marginTop: 4,
                      padding: '7px 18px',
                      background: status === 'stamped' ? 'rgba(140,30,30,0.12)' : 'transparent',
                      border: '2.5px solid #8c1e1e', borderRadius: 6,
                      color: '#8c1e1e',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      transform: 'rotate(-3deg)',
                      cursor: 'pointer',
                    }}
                  >
                    {status === 'sending' ? 'Sending…' : status === 'stamped' ? '✓ Received' : 'Send to Director'}
                  </motion.button>

                  {status === 'error' && (
                    <p style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: '#a02020', textAlign: 'center' }}>
                      hmm, that didn't go through — <a href="mailto:ggtempestt@gmail.com" style={{ color: '#a02020' }}>email me directly</a>
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 2 }}>
                    <a href="https://github.com/ggkyle" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.15em', color: 'rgba(60,40,20,0.55)', textDecoration: 'none' }}>
                      <FaGithub size={11} /> GITHUB
                    </a>
                    <a href="https://linkedin.com/in/harvy-monte-de-ramos" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.15em', color: 'rgba(60,40,20,0.55)', textDecoration: 'none' }}>
                      <FaLinkedinIn size={11} /> LINKEDIN
                    </a>
                  </div>
                </motion.form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Html>
    </group>
  )
}
