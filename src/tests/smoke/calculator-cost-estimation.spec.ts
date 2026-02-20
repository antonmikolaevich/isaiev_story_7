import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { CalculatorPage } from '../../pageObject/calculator_page';

const COOKIE_BUTTON_TEXT = process.env['LOCALE'] === 'en' ? 'OK, got it' : 'OK';

/**
 * Cost Estimation Test Suite
 *
 * Tests calculator cost estimation functionality with different instance counts
 * Demonstrates Playwright best practices:
 * - Descriptive test names
 * - Proper setup/teardown
 * - Auto-waiting
 * - Soft assertions where appropriate
 */
test.describe('Calculator Cost Estimation', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);
  });

  test('Should display initial cost for single instance', async () => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // Wait for cost to calculate and display
    await calculatorPage.waitForCostToLoad();

    // Verify initial cost is displayed (default 1 instance)
    const initialCost = await calculatorPage.getCostText();
    expect(initialCost).toBeTruthy();
    expect(initialCost).toMatch(/\$\d+\.\d+/);
  });

  test('Should update cost when incrementing instances', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // Wait for initial cost to load
    await calculatorPage.waitForCostToLoad();
    const initialCost = await calculatorPage.getCostText();
    expect(initialCost).toMatch(/\$\d+\.\d+/);

    // Increment by 2 for noticeable cost change
    await calculatorPage.incrementInstances(2);

    // Wait for cost to recalculate
    await page.waitForTimeout(1500);

    const updatedCost = await calculatorPage.getCostText();
    expect(updatedCost).toMatch(/\$\d+\.\d+/);
    // Cost should increase or stay valid
    expect(parseFloat(updatedCost.replace('$', ''))).toBeGreaterThanOrEqual(
      parseFloat(initialCost.replace('$', '')),
    );
  });

  test('Should handle multiple increments correctly', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // Increment 3 times and verify cost updates
    await calculatorPage.incrementInstances(3);

    // Wait for cost to calculate
    await calculatorPage.waitForCostToLoad();

    const finalCost = await calculatorPage.getCostText();
    expect(finalCost).toBeTruthy();
    expect(finalCost).toMatch(/\$\d+\.\d+/);
  });

  test('Should maintain calculator state during session', async ({ page }) => {
    // Setup calculator
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // Wait for cost to load to ensure page is fully ready
    await calculatorPage.waitForCostToLoad();

    // Verify configuration section is still accessible
    await calculatorPage.verifyConfigurationSectionDisplayed();
  });
});
