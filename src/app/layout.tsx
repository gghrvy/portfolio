import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// Resolves OG/Twitter image URLs against the live deployment automatically —
// Vercel sets these at build time, no manual domain config needed.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
      </head>
      <body>{children}</body>
    </html>
  )
}
