import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const page = readFileSync(resolve(root, 'src/app/page.tsx'), 'utf8')

describe('portfolio content', () => {
  it('keeps the real resume and project screenshots available', () => {
    expect(existsSync(resolve(root, 'public/cv.pdf'))).toBe(true)
    expect(existsSync(resolve(root, 'public/screenshots/dev-day-one-1.png'))).toBe(true)
    expect(existsSync(resolve(root, 'public/screenshots/one-tap-1.png'))).toBe(true)
  })

  it('uses verified contact and project information', () => {
    expect(page).toContain('harvyh.montederamos@gmail.com')
    expect(page).toContain('https://github.com/gghrvy')
    expect(page).not.toContain('Opportunity Intelligence')
    expect(page).toContain('Day One')
    expect(page).toContain('OneTap')
  })
})
