/**
 * Sample Playwright Test - Learning Reference
 *
 * This test demonstrates Playwright's key features:
 * - Page fixtures and test structure
 * - Locator strategies
 * - Auto-waiting capabilities
 * - Assertions
 * - Page Object Model pattern
 */

import { test, expect } from '@playwright/test';

test.describe('Playwright Sample Tests', () => {
  test('Basic navigation and interaction', async ({ page }) => {
    // Navigate to URL
    await page.goto('https://example.com');

    // Playwright auto-waits for elements
    const heading = page.locator('h1');

    // Assertion with built-in waiting
    await expect(heading).toHaveText('Example Domain');

    // Check visibility
    await expect(heading).toBeVisible();
  });

  test('Locator strategies comparison', async ({ page }) => {
    await page.goto('https://example.com');

    // CSS selector - finds first link on page
    const link1 = page.locator('a').first();

    // Text-based selector (recommended for readability)
    const link2 = page.locator('a', { hasText: 'Learn more' });

    // XPath (use sparingly, less readable)
    const link3 = page.locator('xpath=//a');

    // Verify links are found and visible
    await expect(link1).toBeVisible();
    await expect(link2).toBeVisible();
    await expect(link3.first()).toBeVisible();
  });

  test('Auto-waiting demonstration', async ({ page }) => {
    await page.goto('https://example.com');

    // No need for explicit waits - Playwright waits automatically:
    // - For element to be visible
    // - For element to be enabled
    // - For element to be stable (not animating)
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    // Verify page content loaded
    await expect(heading).toContainText('Example');
  });

  test('Working with page context', async ({ page, context }) => {
    // Page fixture is automatically provided by Playwright
    // Context allows browser-level operations

    await page.goto('https://example.com');

    // Get page title
    const title = await page.title();
    expect(title).toContain('Example');

    // Get current URL
    expect(page.url()).toContain('example.com');

    // Take screenshot (automatically saved on failure)
    await page.screenshot({ path: 'test-results/sample-screenshot.png', fullPage: true });
  });
});

/**
 * Key Differences from WebdriverIO:
 *
 * 1. Page Fixture:
 *    - WebdriverIO: global 'browser' object
 *    - Playwright: 'page' fixture passed to test
 *
 * 2. Locators:
 *    - WebdriverIO: $('selector') or $('//xpath')
 *    - Playwright: page.locator('selector') or page.getByRole()
 *
 * 3. Assertions:
 *    - WebdriverIO: expect(element).toBeDisplayed()
 *    - Playwright: await expect(element).toBeVisible()
 *
 * 4. Auto-waiting:
 *    - WebdriverIO: Often needs waitForDisplayed(), waitForClickable()
 *    - Playwright: Built-in auto-waiting for all actions
 *
 * 5. Test Structure:
 *    - WebdriverIO: describe/it from Mocha
 *    - Playwright: test.describe/test from @playwright/test
 */
