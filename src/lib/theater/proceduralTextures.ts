import { CanvasTexture, RepeatWrapping } from 'three'

// Tiled grayscale value-noise texture for roughness/bump maps.
// size: canvas px · cell: noise cell px · min/max: value range 0–255
export function makeNoiseTexture(size = 128, cell = 4, min = 110, max = 200): CanvasTexture {
  const c = document.createElement('canvas')
  c.width = size; c.height = size
  const ctx = c.getContext('2d')!
  for (let y = 0; y < size; y += cell) {
    for (let x = 0; x < size; x += cell) {
      const v = Math.floor(min + Math.random() * (max - min))
      ctx.fillStyle = `rgb(${v},${v},${v})`
      ctx.fillRect(x, y, cell, cell)
    }
  }
  const tex = new CanvasTexture(c)
  tex.wrapS = tex.wrapT = RepeatWrapping
  return tex
}
