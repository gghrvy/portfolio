export const timelineIntro = {
  label: 'Experience & credentials',
  heading: 'Recent work, with clear ownership.',
  body: 'End-to-end product work, engineering delivery, and cross-functional contribution.',
  credentialsBody: 'Academic work, recognized commitment, and training across applied AI, cloud operations, and software engineering.',
}

export type TimelineEntry = {
  kind: 'Work' | 'Education' | 'Certification'
  date: string
  title: string
  org: string
  body: string[]
  scopeLabel?: string
  scope?: string[]
  highlights?: string[]
}

export const experience: TimelineEntry[] = [
  {
    kind: 'Work',
    date: 'Collaborative project',
    title: 'Lead Backend Developer',
    org: 'Woogidex / Collaborative project',
    body: [
      'Partnered with the project owner and frontend developer to build Woogidex, a browser-based Fakemon creation platform. Led backend development using Supabase, including Edge Functions, database migrations, identifier-based authentication, login security, and data services for community, contest, and notification features.',
      'Supported real-time multiplayer functionality through WebRTC networking and application protocols, while integrating cloud features with local-first IndexedDB storage.',
    ],
    scopeLabel: 'Lead',
    scope: ['Supabase Edge Functions', 'database design', 'secure auth', 'community features', 'WebRTC', 'IndexedDB'],
  },
  {
    kind: 'Work',
    date: 'Mar 2026 - Jun 2026',
    title: 'Software Developer Intern',
    org: 'Xeleqt Technology Innovations Inc. / Cebu City',
    body: ['Rebuilt the company website from Wix to Next.js and shipped it on AWS Amplify. Integrated an AI chatbot and Microsoft Clarity, then contributed QA across iOS, Android, and React web products. Also supported digital-twin UI prototypes, 3D asset testing, and Agile delivery.'],
    scopeLabel: 'Shipped',
    scope: ['Wix-to-Next.js migration', 'AI chatbot', 'AWS Amplify', 'Clarity', 'cross-platform QA'],
  },
]

export const education: TimelineEntry = {
  kind: 'Education',
  date: '2022 - 2026',
  title: 'Bachelor of Science in Information Technology',
  org: 'University of San Jose-Recoletos / Cebu City, Philippines',
  body: ['Web Applications Development'],
  highlights: [
    'Submitted BantayKo, an AI personal safety app, and a barangay community digitization platform to Solutionsfest 2026.',
    'Bronze Loyalty Award recipient.',
    'Participated in team-based sports and esports competitions throughout university.',
  ],
}

export const certifications: TimelineEntry[] = [
  { kind: 'Certification', org: 'IBM / Coursera', title: 'Generative AI for Growth Marketing', body: ['Generative AI applications, prompt engineering basics, and AI-driven growth marketing strategy.'], date: 'Issued Dec 2025 - Expires Dec 2028' },
  { kind: 'Certification', org: 'Alliance Software Inc.', title: 'Alliance Software Engineering Program', body: ['React, JavaScript, TypeScript, .NET, and C# software engineering training.'], date: 'Issued Dec 2025 - Expires Dec 2028' },
  { kind: 'Certification', org: 'Amazon Web Services', title: 'AWS Academy Graduate - Cloud Foundations', body: ['Cloud fundamentals, core AWS services, and foundational cloud architecture concepts.'], date: 'Issued Nov 2025 - Expires Nov 2028' },
  { kind: 'Certification', org: 'Amazon Web Services', title: 'AWS Academy Graduate - Cloud Operations', body: ['Cloud operations, monitoring, reliability, and day-to-day service management.'], date: 'Issued Nov 2025 - Expires Nov 2028' },
]
