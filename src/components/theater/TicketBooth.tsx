'use client'

import { useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import gsap from 'gsap'
import { useTheaterStore } from '@/store/theaterStore'
import { CAMERA_SHOTS } from '@/lib/theater/cameraShots'
import { EASE } from '@/lib/theater/easing'
import { sounds } from '@/lib/theater/sounds'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// First-visit only: camera starts at the box office, visitor gets a ticket.
const BOOTH_CAM = { position: [6.6, 2.9, 5.6] as const, target: [9.5, 2.8, 1.6] as const }

export default function TicketBooth() {
  const { camera } = useThree()
  const mode = useTheaterStore(s => s.mode)
  const setMode = useTheaterStore(s => s.setMode)
  const setVisitorName = useTheaterStore(s => s.setVisitorName)
  const reduced = useReducedMotion()
  const [name, setName] = useState('')
  const [printing, setPrinting] = useState(false)
  const placed = useRef(false)

  // Park the camera at the booth when ticket mode begins
  useEffect(() => {
    if (mode !== 'ticket' || placed.current) return
    placed.current = true
    camera.position.set(...BOOTH_CAM.position)
    camera.lookAt(...BOOTH_CAM.target)
  }, [mode, camera])

  const issue = (visitor: string) => {
    if (printing) return
    setPrinting(true)
    sounds.play('chatter')
    setVisitorName(visitor)
    localStorage.setItem('hm-visited', '1')

    const lobby = CAMERA_SHOTS.LOBBY
    const done = () => setMode('normal')
    if (reduced) {
      camera.position.set(...lobby.position)
      done()
      return
    }
    // Brief beat for the print, then dolly to the lobby
    gsap.to(camera.position, {
      x: lobby.position[0], y: lobby.position[1], z: lobby.position[2],
      duration: 2.2, delay: 0.9, ease: EASE.camera,
      onUpdate: () => camera.lookAt(0, 5.5, -15),
      onComplete: done,
    })
  }

  if (mode !== 'ticket') return null

  return (
    <Html position={[9.5, 2.0, 3.2]} center style={{ pointerEvents: 'auto' }}>
      <div style={{
        width: 230, padding: '16px 18px',
        background: 'rgba(12,8,6,0.94)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,180,71,0.35)', borderRadius: 10,
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.25em', color: '#ffb347', textTransform: 'uppercase', marginBottom: 8 }}>
          Box Office
        </p>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
          One ticket for tonight&apos;s premiere. Your name?
        </p>
        <form onSubmit={e => { e.preventDefault(); issue(name.trim() || 'GUEST') }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={24}
            placeholder="Your name"
            autoFocus
            style={{
              width: '100%', padding: '8px 12px', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 6, color: '#fff', fontSize: 13,
              fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none',
              textAlign: 'center', marginBottom: 10,
            }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button type="submit" disabled={printing} style={{
              padding: '7px 16px', background: 'rgba(255,180,71,0.14)',
              border: '1px solid rgba(255,180,71,0.5)', borderRadius: 6,
              color: '#ffb347', fontFamily: "'Space Mono', monospace",
              fontSize: 10, letterSpacing: '0.12em', cursor: 'pointer',
            }}>
              {printing ? 'PRINTING…' : 'GET TICKET'}
            </button>
            <button type="button" disabled={printing} onClick={() => issue('GUEST')} style={{
              padding: '7px 14px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6,
              color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono', monospace",
              fontSize: 10, letterSpacing: '0.12em', cursor: 'pointer',
            }}>
              SKIP
            </button>
          </div>
        </form>
      </div>
    </Html>
  )
}
