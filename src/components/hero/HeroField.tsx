'use client'

import dynamic from 'next/dynamic'

const PacketField = dynamic(() => import('./PacketField'), { ssr: false })

export function HeroField() {
  return <div className="hero-field" aria-hidden="true"><PacketField /></div>
}
