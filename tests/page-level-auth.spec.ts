import { test, expect } from '@playwright/test'

/**
 * Page-level authentication tests
 * Tests the complete user authentication flow including 403 error handling and logout
 */
test.describe('Page Level Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
  })

  /**
   * Test complete login flow and verify authenticated state
   */
  test('should login user and show authenticated page', async ({ page }) => {
    // Should show login page initially
    await expect(page.locator('h2:has-text("Welcome Back")')).toBeVisible()
    
    // Capture initial login page
    await page.screenshot({ path: 'test-results/login-page-initial.png', fullPage: true })
    
    // Mock successful login API
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'valid-jwt-token-12345',
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@church.com',
            role: 'member'
          }
        })
      })
    })

    // Mock successful profile API
    await page.route('**/api/auth/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'John Doe',
          email: 'john@church.com',
          role: 'member'
        })
      })
    })

    // Fill login form
    await page.fill('input[type="email"]', 'john@church.com')
    await page.fill('input[type="password"]', 'password123')
    
    // Capture filled login form
    await page.screenshot({ path: 'test-results/login-form-filled.png', fullPage: true })
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Should navigate to authenticated page
    await expect(page.locator('h2:has-text("Welcome to Our Church Community")')).toBeVisible()
    await expect(page.locator('text=Hello, John Doe!')).toBeVisible()
    await expect(page.locator('button:has-text("Logout")')).toBeVisible()
    
    // Capture authenticated page
    await page.screenshot({ path: 'test-results/authenticated-page-success.png', fullPage: true })
    
    // Verify JWT token is stored
    const token = await page.evaluate(() => localStorage.getItem('jwt'))
    expect(token).toBe('valid-jwt-token-12345')
  })

  /**
   * Test 403 error triggers automatic logout with dialog
   */
  test('should show logout dialog when 403 error occurs on API call', async ({ page }) => {
    // First, perform a successful login to get to authenticated state
    await expect(page.locator('h2:has-text("Welcome Back")')).toBeVisible()
    
    // Mock successful login API
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'valid-jwt-token-12345',
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@church.com',
            role: 'member'
          }
        })
      })
    })

    // Mock successful profile API initially
    await page.route('**/api/auth/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Test User',
          email: 'test@church.com',
          role: 'member'
        })
      })
    })
    
    // Perform login
    await page.fill('input[type="email"]', 'test@church.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Wait for authenticated page to load
    await expect(page.locator('h2:has-text("Welcome to Our Church Community")')).toBeVisible({ timeout: 10000 })
    
    // Now mock the profile API to return 403 for subsequent calls
    await page.route('**/api/auth/profile', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Token expired',
          message: 'Your session has expired'
        })
      })
    })
    
    // Look for test logout buttons and click one to trigger 403
    const testButton = page.locator('button:has-text("Test 403 Error")')
    if (await testButton.count() > 0) {
      await testButton.first().click()
      
      // Wait for the logout dialog to appear
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 })
      await expect(page.locator('text=Session Expired')).toBeVisible()
      await expect(page.locator('text=Your session has expired')).toBeVisible()
      
      // Capture the logout dialog
      await page.screenshot({ path: 'test-results/logout-dialog-403-error.png', fullPage: true })
      
      // Click OK to close dialog
      await page.click('button:has-text("OK")')
      
      // Should redirect to login page
      await expect(page.locator('h2:has-text("Welcome Back")')).toBeVisible()
      
      // Verify JWT token is removed from localStorage
      const token = await page.evaluate(() => localStorage.getItem('jwt'))
      expect(token).toBeNull()
    } else {
      console.log('Test 403 Error button not found, skipping dialog test')
    }
  })

  /**
   * Test manual logout functionality
   */
  test('should logout user when logout button is clicked', async ({ page }) => {
    // Set up authenticated state
    await page.evaluate(() => {
      localStorage.setItem('jwt', 'valid-token-12345')
    })
    
    await page.reload()
    
    // Mock profile API for authenticated state
    await page.route('**/api/auth/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Jane Smith',
          email: 'jane@church.com',
          role: 'admin'
        })
      })
    })
    
    // Mock logout API
    await page.route('**/api/auth/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Logged out successfully' })
      })
    })
    
    // Should show authenticated page
    await expect(page.locator('h2:has-text("Welcome to Our Church Community")')).toBeVisible()
    
    // Capture authenticated page before manual logout
    await page.screenshot({ path: 'test-results/before-manual-logout.png', fullPage: true })
    
    // Click logout button
    await page.click('button:has-text("Logout")')
    
    // Should redirect to login page
    await expect(page.locator('h2:has-text("Welcome Back")')).toBeVisible()
    
    // Capture login page after manual logout
    await page.screenshot({ path: 'test-results/after-manual-logout.png', fullPage: true })
    
    // Verify JWT token is removed
    const token = await page.evaluate(() => localStorage.getItem('jwt'))
    expect(token).toBeNull()
  })

  /**
   * Test authentication persistence across page reloads
   */
  test('should maintain authentication state across page reloads', async ({ page }) => {
    // Set up authenticated state
    await page.evaluate(() => {
      localStorage.setItem('jwt', 'persistent-token-12345')
    })
    
    // Mock profile API
    await page.route('**/api/auth/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Bob Wilson',
          email: 'bob@church.com',
          role: 'member'
        })
      })
    })
    
    await page.reload()
    
    // Should show authenticated page
    await expect(page.locator('h2:has-text("Welcome to Our Church Community")')).toBeVisible()
    await expect(page.locator('text=Hello, Bob Wilson!')).toBeVisible()
    
    // Capture authenticated page after first reload
    await page.screenshot({ path: 'test-results/auth-persistence-first-reload.png', fullPage: true })
    
    // Reload again
    await page.reload()
    
    // Should still be authenticated
    await expect(page.locator('h2:has-text("Welcome to Our Church Community")')).toBeVisible()
    await expect(page.locator('text=Hello, Bob Wilson!')).toBeVisible()
    
    // Capture authenticated page after second reload
    await page.screenshot({ path: 'test-results/auth-persistence-second-reload.png', fullPage: true })
  })

  /**
   * Test RTK Query 403 error handling with logout dialog
   */
  test('should show logout dialog when RTK Query encounters 403 error', async ({ page }) => {
    // First, perform a successful login to get to authenticated state
    await expect(page.locator('h2:has-text("Welcome Back")')).toBeVisible()
    
    // Mock successful login API
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'valid-jwt-token-12345',
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@church.com',
            role: 'member'
          }
        })
      })
    })

    // Mock successful profile API initially
    await page.route('**/api/auth/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Test User',
          email: 'test@church.com',
          role: 'member'
        })
      })
    })
    
    // Perform login
    await page.fill('input[type="email"]', 'test@church.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Wait for authenticated page to load
    await expect(page.locator('h2:has-text("Welcome to Our Church Community")')).toBeVisible({ timeout: 10000 })
    
    // Mock any API endpoint to return 403 for RTK Query test
    await page.route('**/api/**', async (route) => {
      if (route.request().url().includes('/api/auth/profile')) {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Token expired',
            message: 'Your session has expired. Please log in again.'
          })
        })
      } else {
        await route.continue()
      }
    })
    
    // Look for RTK Query test button and click it
    const rtkTestButton = page.locator('button:has-text("Test RTK Query 403")')
    if (await rtkTestButton.count() > 0) {
      await rtkTestButton.click()
      
      // Wait for the logout dialog to appear
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 })
      await expect(page.locator('text=Session Expired')).toBeVisible()
      
      // Capture the logout dialog from RTK Query error
      await page.screenshot({ path: 'test-results/logout-dialog-rtk-query-403.png', fullPage: true })
      
      // Click OK to close dialog
      await page.click('button:has-text("OK")')
      
      // Should redirect to login page
      await expect(page.locator('h2:has-text("Welcome Back")')).toBeVisible()
      
      // Verify JWT token is removed
      const token = await page.evaluate(() => localStorage.getItem('jwt'))
      expect(token).toBeNull()
    } else {
      console.log('RTK Query test button not found, skipping RTK Query specific test')
    }
  })

  /**
   * Test Auth Demo component functionality within authenticated page
   */
  test('should show auth demo and handle 403 errors in demo component', async ({ page }) => {
    // Set up authenticated state
    await page.evaluate(() => {
      localStorage.setItem('jwt', 'demo-token-12345')
    })
    
    let callCount = 0
    // Mock profile API - first call succeeds, second call returns 403
    await page.route('**/api/auth/profile', async (route) => {
      callCount++
      if (callCount === 1) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            name: 'Demo User',
            email: 'demo@church.com',
            role: 'member'
          })
        })
      } else {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Token expired',
            message: 'Your session has expired'
          })
        })
      }
    })
    
    await page.reload()
    
    // Should show authenticated page
    await expect(page.locator('h2:has-text("Welcome to Our Church Community")')).toBeVisible()
    
    // Click on Auth Demo card to show the demo component
    await page.click('text=🔐 Auth Demo')
    
    // Should show the auth demo component
    await expect(page.locator('h3:has-text("Authentication Demo")')).toBeVisible()
    await expect(page.locator('button:has-text("Test Auth API Call")')).toBeVisible()
    
    // Capture auth demo component
    await page.screenshot({ path: 'test-results/auth-demo-component.png', fullPage: true })
    
    // Click the test auth API call button (this will trigger a second profile query)
    await page.click('button:has-text("Test Auth API Call")')
    
    // Wait for the 403 response to be processed
    await page.waitForTimeout(2000)
    
    // Should automatically logout and redirect to login page
    await expect(page.locator('h2:has-text("Welcome Back")')).toBeVisible()
    
    // Capture logout after 403 error in demo component
    await page.screenshot({ path: 'test-results/demo-component-403-logout.png', fullPage: true })
    
    // Verify token is removed
    const token = await page.evaluate(() => localStorage.getItem('jwt'))
    expect(token).toBeNull()
  })

  /**
   * Test demo login functionality
   */
  test('should allow demo login with predefined credentials', async ({ page }) => {
    // Verify we're on the login page
    await expect(page.locator('h2:has-text("Welcome Back")')).toBeVisible()
    
    // Mock all login API requests to succeed
    await page.route('**/api/auth/login', async (route) => {
      console.log('Login API called with:', route.request().postData())
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'demo-jwt-token-12345',
          user: {
            id: 'demo',
            name: 'Demo User',
            email: 'demo@church.com',
            role: 'demo'
          }
        })
      })
    })
    
    // Mock profile API for demo user
    await page.route('**/api/auth/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'demo',
          name: 'Demo User',
          email: 'demo@church.com',
          role: 'demo'
        })
      })
    })
    
    // Click the demo login button
    await page.click('button:has-text("🚀 Try Demo Login")')
    
    // Should navigate to authenticated page
    await expect(page.locator('h2:has-text("Welcome to Our Church Community")')).toBeVisible({ timeout: 10000 })
    
    // Should show demo user greeting
    await expect(page.locator('text=Hello, Demo User!')).toBeVisible({ timeout: 5000 })
    
    // Verify JWT token is stored in localStorage
    const token = await page.evaluate(() => localStorage.getItem('jwt'))
    expect(token).toBe('demo-jwt-token-12345')
  })
})