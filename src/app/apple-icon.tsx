import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const clash = await readFile(join(process.cwd(), 'src/fonts/ClashGrotesk-Medium.ttf'))
  return new ImageResponse(
    (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#0c0e0d', color: '#e7e9e2', fontFamily: 'Clash', fontSize: 92, letterSpacing: -4 }}>
        HM
        <div style={{ position: 'absolute', right: 30, bottom: 34, width: 18, height: 18, borderRadius: 999, background: '#f0a33a' }} />
      </div>
    ),
    { ...size, fonts: [{ name: 'Clash', data: clash, weight: 500, style: 'normal' }] },
  )
}
