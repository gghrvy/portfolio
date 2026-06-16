import { CanvasTexture } from 'three'
import type { Project } from './projectData'

export function createPosterTexture(project: Project): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 384
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = project.featured ? '#1a1230' : '#0e0c18'
  ctx.fillRect(0, 0, 256, 384)

  // Top accent bar
  ctx.fillStyle = project.featured ? '#ffd27c' : '#6b5fa0'
  ctx.fillRect(0, 0, 256, 4)

  // Genre tag
  ctx.fillStyle = project.featured ? '#ffd27c' : '#9b8bc0'
  ctx.font = '10px monospace'
  ctx.fillText(project.genreTag.slice(0, 30).toUpperCase(), 12, 28)

  // Title — word-wrap at 230px
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 20px sans-serif'
  let y = 72
  let line = ''
  for (const word of project.title.split(' ')) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > 228) {
      ctx.fillText(line, 12, y)
      y += 26
      line = word
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, 12, y)

  // Role
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.font = '11px sans-serif'
  ctx.fillText(project.role, 12, y + 30)

  // Status badge
  const statusColor =
    project.status === 'Deployed' || project.status === 'Production' ? '#4ade80'
    : project.status === 'Live Demo' ? '#60a5fa'
    : '#fbbf24'
  ctx.fillStyle = statusColor
  ctx.font = '10px monospace'
  ctx.fillText(`● ${project.status}`, 12, 360)

  // Year
  ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ctx.textAlign = 'right'
  ctx.fillText(project.year, 244, 360)
  ctx.textAlign = 'left'

  return new CanvasTexture(canvas)
}
