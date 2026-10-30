import { test, expect } from '@playwright/test'

test.describe('TanStack Playground End-to-End Suite', () => {
  test('Dashboard loads and displays core curriculum libraries', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/TanStack Playground/i)

    // Check main dashboard headline
    await expect(page.locator('text=Interactive Developer Playground')).toBeVisible()

    // Verify presence of primary libraries
    await expect(page.locator('text=TanStack Query').first()).toBeVisible()
    await expect(page.locator('text=TanStack Table').first()).toBeVisible()
    await expect(page.locator('text=TanStack Router').first()).toBeVisible()
  })

  test('Navigate to TanStack Query -> Open Basic Query lesson', async ({ page }) => {
    await page.goto('/library/query')
    await expect(page.locator('text=Declarative, always up-to-date auto-managed queries')).toBeVisible()

    // Click on Basic Query
    await page.click('text=Basic Query')
    await expect(page).toHaveURL(/.*\/library\/query\/query-basics/)

    // Confirm theory panel & learning objectives
    await expect(page.locator('text=Learning Objectives')).toBeVisible()
    await expect(page.locator('text=Important APIs')).toBeVisible()
  })

  test('Theme switching updates html class and persists in storage', async ({ page }) => {
    await page.goto('/')

    // Check default dark theme
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Open theme dropdown
    await page.click('button[aria-label="Toggle color theme"]')
    await page.click('text=Light')

    // Confirm light mode applied
    await expect(html).toHaveClass(/light/)

    // Reload page to verify persistence
    await page.reload()
    await expect(html).toHaveClass(/light/)
  })

  test('User authentication, bookmarks, and topic completion flow', async ({ page }) => {
    await page.goto('/library/query/query-basics')

    // Open Sign-In Dialog
    await page.click('button:has-text("Sign In")')
    await expect(page.locator('text=Sign In to TanStack Playground')).toBeVisible()

    // 1-Click Demo Login
    await page.click('text=Quick 1-Click Sign In with Demo Account')

    // Confirm profile dropdown appears
    await expect(page.locator('button:has-text("D")')).toBeVisible()

    // Mark topic as completed
    await page.click('button:has-text("Mark Complete")')
    await expect(page.locator('button:has-text("Completed")')).toBeVisible()

    // Bookmark topic
    await page.click('button[title*="Bookmark"]')

    // Reload and confirm persistence
    await page.reload()
    await expect(page.locator('button:has-text("Completed")')).toBeVisible()
  })

  test('Mobile responsive navigation drawer behaves correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label="Open navigation menu"]')
    await expect(menuButton).toBeVisible()

    // Open drawer
    await menuButton.click()
    await expect(page.locator('text=TanStack Libraries')).toBeVisible()

    // Navigate to Virtual
    await page.click('text=Virtual')
    await expect(page).toHaveURL(/.*\/library\/virtual/)
  })
})

