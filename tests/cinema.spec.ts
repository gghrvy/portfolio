import { test, expect } from '@playwright/test'

// Helper: wait for nav to appear and loading screen to clear
async function waitForAppReady(page: import('@playwright/test').Page) {
  // Step 1: Wait for the nav to exist in the DOM (TheaterApp has loaded)
  await page.waitForSelector('[role="navigation"][aria-label="Portfolio sections"]', { timeout: 15000 })
  // Step 2: Wait for the loading screen to disappear.
  // The loading screen is identified by its "Now Loading" text.
  // It dismisses via setVisible(false) which causes it to return null.
  await page.waitForFunction(() => {
    // The loading screen contains "Now Loading" text
    const allFixed = Array.from(document.querySelectorAll('*')).filter(el => {
      if (el.nodeType !== Node.ELEMENT_NODE) return false
      const s = window.getComputedStyle(el)
      return s.position === 'fixed' && el.textContent?.includes('Now Loading')
    })
    return allFixed.length === 0
  }, { timeout: 15000 })
  // Brief pause for React state to settle after loading dismisses
  await page.waitForTimeout(500)
}

test('canvas renders and loading screen appears', async ({ page }) => {
  await page.goto('/')
  // Canvas should be in the DOM
  await expect(page.locator('canvas')).toBeAttached({ timeout: 15000 })
  // Loading screen text is visible
  await expect(page.getByText('Now Loading', { exact: false })).toBeVisible({ timeout: 10000 })
})

test('FilmReelNav is visible after loading', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(4000)
  await expect(page.getByRole('navigation', { name: 'Portfolio sections' })).toBeVisible({ timeout: 5000 })
})

test('clicking About in nav opens panel', async ({ page }) => {
  await page.goto('/')
  await waitForAppReady(page)
  await page.getByRole('button', { name: 'About' }).click()
  await page.waitForTimeout(2000)
  await expect(page.getByText('Meet the Director')).toBeVisible({ timeout: 5000 })
})

test('clicking Contact in nav opens contact form', async ({ page }) => {
  await page.goto('/')
  await waitForAppReady(page)
  await page.getByRole('button', { name: 'Contact' }).click()
  await page.waitForTimeout(2000)
  await expect(page.getByText('Get Tickets')).toBeVisible({ timeout: 5000 })
  await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible()
})

test('Escape key closes panel', async ({ page }) => {
  await page.goto('/')
  await waitForAppReady(page)
  await page.getByRole('button', { name: 'About' }).click()
  await page.waitForTimeout(1500)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(1000)
  await expect(page.getByText('Meet the Director')).not.toBeVisible({ timeout: 3000 })
})

test('keyboard number 2 opens About section', async ({ page }) => {
  await page.goto('/')
  await waitForAppReady(page)
  await page.keyboard.press('2')
  await page.waitForTimeout(3000)
  await expect(page.getByText('Meet the Director')).toBeVisible({ timeout: 5000 })
})
