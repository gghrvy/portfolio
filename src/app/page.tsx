'use client'

import dynamic from 'next/dynamic'

const TheaterApp = dynamic(() => import('@/components/theater/TheaterApp'), { ssr: false })

export default function Home() {
  return <TheaterApp />
}
