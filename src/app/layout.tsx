import './globals.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import localFont from 'next/font/local'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { MotionOrchestrator } from '@/components/MotionOrchestrator'
import { siteUrl } from '@/lib/site-url'

const display = localFont({ src: '../fonts/ClashGrotesk-Variable.woff2', weight: '200 700', variable: '--font-display', display: 'swap' })
const body = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body', display: 'swap' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Harvy Monte de Ramos | Full-Stack Software Engineer',
  description: 'Full-stack software engineer building AI-powered products, backend systems, and workflow automation across sales, operations, and team knowledge.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: 'Harvy Monte de Ramos | Full-Stack Software Engineer', description: 'AI-powered products, backend systems, and workflow automation across sales, operations, and team knowledge.', url: '/', images: ['/og-image.jpg'], type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Harvy Monte de Ramos | Full-Stack Software Engineer', description: 'AI-powered products, backend systems, and workflow automation across sales, operations, and team knowledge.', images: ['/og-image.jpg'] },
}

export const viewport: Viewport = { themeColor: '#0c0e0d', colorScheme: 'dark' }

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Person', '@id': `${siteUrl}/#harvy`, name: 'Harvy Monte de Ramos', url: siteUrl, image: `${siteUrl}/harvy-profile.jpg`, jobTitle: 'Full-Stack Software Engineer', description: 'Full-stack software engineer building AI-powered products, backend systems, and workflow automation.', sameAs: ['https://github.com/gghrvy', 'https://linkedin.com/in/harvy-montederamos'], knowsAbout: ['React', 'Next.js', 'TypeScript', 'FastAPI', 'Laravel', 'PostgreSQL', 'AI workflows', 'workflow automation'] },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Harvy Monte de Ramos Portfolio', url: siteUrl, description: 'Portfolio of Harvy Monte de Ramos, a full-stack software engineer.', author: { '@id': `${siteUrl}/#harvy` } },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
        <a className="skip-link" href="#work">Skip to work</a>
        <MotionOrchestrator>{children}</MotionOrchestrator>
      </body>
    </html>
  )
}
