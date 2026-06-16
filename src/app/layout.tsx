import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Harvy H. Monte de Ramos | Frontend Developer',
  description: 'A 3D cinema portfolio. Frontend developer shipping production code at an AI startup — Three.js, React, Next.js. Step into the theater.',
  openGraph: {
    title: 'Harvy H. Monte de Ramos | Frontend Developer',
    description: 'Step into the theater — a 3D cinema portfolio built with Three.js and Next.js.',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harvy H. Monte de Ramos | Frontend Developer',
    description: 'Step into the theater — a 3D cinema portfolio built with Three.js and Next.js.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
