'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Maximize2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { GalleryProps } from './Gallery'

// Same markup as the interactive gallery's first state, so the swap is invisible and shifts nothing.
function StaticGallery({ shots, name }: GalleryProps) {
  const [main] = shots
  return (
    <>
      <figure className="gallery-main">
        <div className="plate gallery-stage" style={{ aspectRatio: `${main.width} / ${main.height}` }}>
          <div className="gallery-frame"><div className="gallery-image"><Image src={main.src} alt={main.alt} width={main.width} height={main.height} sizes="(max-width: 900px) 100vw, 62vw" /></div></div>
          <button type="button" className="gallery-expand" aria-label={`Expand ${main.label}`} aria-haspopup="dialog"><Maximize2 size={15} aria-hidden="true" /><span>Expand</span></button>
        </div>
        <figcaption><span>{main.label}</span><p>{main.note}</p></figcaption>
      </figure>
      <div className="gallery-thumbs" role="group" aria-label={`${name} screens`}>
        {shots.map((shot, index) => (
          <button key={shot.src} type="button" className="gallery-thumb plate" aria-pressed={index === 0} aria-label={`Show ${shot.label}`}>
            <Image src={shot.src} alt="" width={shot.width} height={shot.height} sizes="(max-width: 900px) 33vw, 20vw" />
            {index === 0 && <span className="gallery-thumb-indicator" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </>
  )
}

const InteractiveGallery = dynamic(() => import('./Gallery'), { ssr: false, loading: () => null })

export function GalleryShell({ tone, ...props }: GalleryProps & { tone: 'dark' | 'light' }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      import('./Gallery').then(() => setLoaded(true))
      setReady(true)
    }, { rootMargin: '600px 0px' })
    io.observe(element)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="gallery" data-tone={tone} data-observe>
      {ready && loaded ? <InteractiveGallery {...props} /> : <StaticGallery {...props} />}
    </div>
  )
}
