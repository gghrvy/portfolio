'use client'

import { useEffect, useState } from 'react'
import { Monogram } from '@/components/Monogram'

export function PageIntro() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const finish = () => { timer = setTimeout(() => setReady(true), 520) }
    const fontReady = document.fonts?.ready ?? Promise.resolve()
    Promise.race([fontReady, new Promise<void>((resolve) => setTimeout(resolve, 900))]).then(finish)
    return () => { if (timer) clearTimeout(timer) }
  }, [])

  return <div className={'page-intro' + (ready ? ' is-ready' : '')} role="status" aria-label="Loading portfolio"><div className="page-intro-mark"><Monogram /><span>Harvy Monte de Ramos</span></div><div className="page-intro-progress" aria-hidden="true"><i /></div></div>
}
