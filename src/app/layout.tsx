import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { MotionOrchestrator } from '@/components/MotionOrchestrator'
import { PageIntro } from '@/components/PageIntro'
import { siteUrl } from '@/lib/site-url'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Harvy Monte de Ramos | Full-Stack Software Engineer',
  description: 'Full-stack software engineer building AI-powered products, backend systems, and workflow automation across sales, operations, and team knowledge.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: 'Harvy Monte de Ramos | Full-Stack Software Engineer', description: 'AI-powered products, backend systems, and workflow automation across sales, operations, and team knowledge.', url: '/', images: ['/og-image.jpg'], type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Harvy Monte de Ramos | Full-Stack Software Engineer', description: 'AI-powered products, backend systems, and workflow automation across sales, operations, and team knowledge.', images: ['/og-image.jpg'] },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Person', '@id': `${siteUrl}/#harvy`, name: 'Harvy Monte de Ramos', url: siteUrl, image: `${siteUrl}/harvy-profile.jpg`, jobTitle: 'Full-Stack Software Engineer', description: 'Full-stack software engineer building AI-powered products, backend systems, and workflow automation.', sameAs: ['https://github.com/gghrvy', 'https://linkedin.com/in/harvy-montederamos'], knowsAbout: ['React', 'Next.js', 'TypeScript', 'FastAPI', 'Laravel', 'PostgreSQL', 'AI workflows', 'workflow automation'] },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Harvy Monte de Ramos Portfolio', url: siteUrl, description: 'Portfolio of Harvy Monte de Ramos, a full-stack software engineer.', author: { '@id': `${siteUrl}/#harvy` } },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) { return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} /><PageIntro /><MotionOrchestrator>{children}</MotionOrchestrator></body></html> }
