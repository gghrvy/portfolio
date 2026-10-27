import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Harvy Monte de Ramos — Portfolio',
    short_name: 'Harvy MdR',
    description: 'Full-stack, frontend and AI developer in Cebu, Philippines.',
    start_url: '/',
    display: 'browser',
    background_color: '#0c0e0d',
    theme_color: '#0c0e0d',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
