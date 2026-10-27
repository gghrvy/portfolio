import './globals.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import localFont from 'next/font/local'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { BackToTop } from '@/components/BackToTop'
import { CommandPalette } from '@/components/CommandPalette'
import { MotionOrchestrator } from '@/components/MotionOrchestrator'
import { Toaster } from '@/components/Toaster'
import { siteUrl } from '@/lib/site-url'

const display = localFont({ src: '../fonts/ClashGrotesk-Variable.woff2', weight: '200 700', variable: '--font-display', display: 'swap' })
const body = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body', display: 'swap' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Harvy Monte de Ramos | Full-Stack & Frontend Developer',
  description: 'Full-stack, frontend, and AI developer in Cebu, Philippines (UTC+8). Case studies in AI prospecting, RAG knowledge tools, and community platforms. Available for work.',
  applicationName: 'Harvy Monte de Ramos',
  authors: [{ name: 'Harvy Monte de Ramos', url: siteUrl }],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: 'Harvy Monte de Ramos | Full-Stack & Frontend Developer', description: 'AI-powered products, backend systems, and workflow automation. Based in Cebu, Philippines. Available for work.', url: '/', siteName: 'Harvy Monte de Ramos', locale: 'en_US', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Harvy Monte de Ramos | Full-Stack & Frontend Developer', description: 'AI-powered products, backend systems, and workflow automation. Based in Cebu, Philippines. Available for work.' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3eee4' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0e0d' },
  ],
  colorScheme: 'dark light',
}

// Sets data-theme before first paint: stored manual choice, else the OS preference, else dark.
const themeScript = "(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem('theme')}catch(e){}var m=t==='light'||t==='dark';d.dataset.theme=m?t:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');d.dataset.themeSource=m?'manual':'system'})()"

// Opt into reveal states before first paint; fall back to static content if hydration never lands.
const motionScript = "(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('motion');setTimeout(function(){if(!window.__motionReady)d.classList.remove('motion')},4000)}catch(e){}})()"

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Person', '@id': `${siteUrl}/#harvy`, name: 'Harvy Monte de Ramos', url: siteUrl, image: `${siteUrl}/harvy-profile.jpg`, jobTitle: 'Full-Stack Software Engineer', description: 'Full-stack software engineer building AI-powered products, backend systems, and workflow automation.', sameAs: ['https://github.com/gghrvy', 'https://linkedin.com/in/harvy-montederamos'], knowsAbout: ['React', 'Next.js', 'TypeScript', 'FastAPI', 'Laravel', 'PostgreSQL', 'AI workflows', 'workflow automation'] },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Harvy Monte de Ramos Portfolio', url: siteUrl, description: 'Portfolio of Harvy Monte de Ramos, a full-stack software engineer.', author: { '@id': `${siteUrl}/#harvy` } },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
        <a className="skip-link" href="#main">Skip to content</a>
        <MotionOrchestrator>{children}</MotionOrchestrator>
        <BackToTop />
        <Toaster />
        <CommandPalette />
      </body>
    </html>
  )
}
