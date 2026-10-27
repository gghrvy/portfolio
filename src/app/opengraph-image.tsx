import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const alt = 'Harvy Monte de Ramos — Full-stack, frontend and AI developer in Cebu, Philippines. Available for work.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Brand values mirror tokens.css (dark theme); the image renderer cannot read CSS variables.
const ink = { bg: '#0c0e0d', line: '#262b29', strong: '#3a413d', text: '#e7e9e2', muted: '#8e958f', signal: '#f0a33a', live: '#5ccf9f' }

// Elbow routes for the packet graph motif: [x1, y1, x2, y2] drawn horizontal-then-vertical.
const routes = [
  [700, 80, 880, 180], [880, 180, 1080, 120], [880, 180, 940, 330], [940, 330, 1120, 300],
  [760, 300, 940, 330], [940, 330, 860, 470], [1120, 300, 1060, 470], [860, 470, 1060, 470],
]
const hot = new Set([1, 2, 5])

export default async function OpenGraphImage() {
  const clash = await readFile(join(process.cwd(), 'src/fonts/ClashGrotesk-Medium.ttf'))
  return new ImageResponse(
    (
      <div style={{ position: 'relative', display: 'flex', width: '100%', height: '100%', background: ink.bg, color: ink.text, fontFamily: 'Clash' }}>
        {routes.map(([x1, y1, x2, y2], i) => {
          const color = hot.has(i) ? ink.signal : ink.strong
          return (
            <div key={i} style={{ position: 'absolute', display: 'flex' }}>
              <div style={{ position: 'absolute', left: Math.min(x1, x2), top: y1, width: Math.abs(x2 - x1) + 2, height: 2, background: color }} />
              <div style={{ position: 'absolute', left: x2, top: Math.min(y1, y2), width: 2, height: Math.abs(y2 - y1) + 2, background: color }} />
            </div>
          )
        })}
        {routes.flatMap(([x1, y1, x2, y2]) => [[x1, y1], [x2, y2]]).map(([x, y], i) => (
          <div key={`n${i}`} style={{ position: 'absolute', left: x - 6, top: y - 6, width: 14, height: 14, border: `2px solid ${ink.signal}`, background: ink.bg, transform: 'rotate(45deg)' }} />
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', padding: '64px 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, letterSpacing: 2, color: ink.muted }}>
            <div style={{ width: 40, height: 2, background: ink.signal }} />
            FULL-STACK · FRONTEND · AI DEVELOPER
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 116, lineHeight: 0.95, letterSpacing: -4 }}>
            <span>Harvy Monte</span>
            <span>de Ramos</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 26, color: ink.muted }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', border: `2px solid ${ink.line}`, color: ink.text }}>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: ink.live }} />
              Available for work
            </div>
            <span>Cebu, Philippines · UTC+8</span>
            <span style={{ marginLeft: 'auto', color: ink.signal }}>harvygg.vercel.app</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Clash', data: clash, weight: 500, style: 'normal' }] },
  )
}
