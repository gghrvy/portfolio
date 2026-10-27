'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Shot } from '@/content/projects'

export function Gallery({ shots, tone, name, priority = false }: { shots: Shot[]; tone: 'dark' | 'light'; name: string; priority?: boolean }) {
  const [active, setActive] = useState(0)
  const main = shots[active]

  return (
    <div className="gallery" data-tone={tone}>
      <figure className="gallery-main">
        <div className="plate">
          <Image src={main.src} alt={main.alt} width={main.width} height={main.height} sizes="(max-width: 900px) 100vw, 62vw" priority={priority} />
        </div>
        <figcaption><span>{main.label}</span><p>{main.note}</p></figcaption>
      </figure>
      <div className="gallery-thumbs" role="group" aria-label={`${name} screens`}>
        {shots.map((shot, index) => (
          <button key={shot.src} type="button" className="gallery-thumb plate" aria-pressed={index === active} aria-label={`Show ${shot.label}`} onClick={() => setActive(index)}>
            <Image src={shot.src} alt="" width={shot.width} height={shot.height} sizes="(max-width: 900px) 33vw, 20vw" />
          </button>
        ))}
      </div>
    </div>
  )
}
