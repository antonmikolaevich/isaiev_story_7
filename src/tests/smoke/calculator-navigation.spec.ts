import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { CalculatorPage } from '../../pageObject/calculator_page';

const COOKIE_BUTTON_TEXT = process.env['LOCALE'] === 'en' ? 'OK, got it' : 'OK';

/**
 * Navigation and UI Test Suite
 *
 * Tests calculator page navigation and UI elements
 * Demonstrates:
 * - Page navigation
 * - Element visibility checks
 * - URL verification
 * - Screenshot capabilities
 */
test.describe('Calculator Navigation and UI', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
  });

  test('Should navigate to calculator page successfully', async ({ page }) => {
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);

    // Verify URL
    await calculatorPage.verifyOnCalculatorPage();

    // Verify page loaded
    await expect(page).toHaveTitle(/.*Calculator.*/i);
  });

  test('Should display "Add to estimate" button on page load', async ({ page }) => {
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);

    // Use page-level locator for direct element check - use .first() for multiple matches
    const addButton = page.locator('span', { hasText: 'Add to estimate' }).first();
    await expect(addButton).toBeVisible();
  });

  test('Should open estimation modal when clicking Add to estimate', async () => {
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);

    await calculatorPage.clickAddToEstimate();

    // Verify modal appears
    await calculatorPage.verifyEstimationModalDisplayed();
  });

  test('Should display Compute Engine option in modal', async () => {
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);

    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();

    // Use page-level check for the option
    await calculatorPage.verifyEstimationModalDisplayed();
  });

  test('Should handle page reload gracefully', async ({ page }) => {
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);

    // Reload page
    await page.reload();

    // Verify page still works
    await calculatorPage.verifyOnCalculatorPage();
  });

  test('Should maintain responsive layout', async ({ page }) => {
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);

    // Test different viewport sizes
    await page.setViewportSize({ width: 1920, height: 1080 });
    await calculatorPage.verifyOnCalculatorPage();

    await page.setViewportSize({ width: 1280, height: 720 });
    await calculatorPage.verifyOnCalculatorPage();
  });
});
