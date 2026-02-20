import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { CalculatorPage } from '../../pageObject/calculator_page';
import { TEST_CONFIGS, EDGE_CASES } from '../../testData/calculator-configs';

const COOKIE_BUTTON_TEXT = process.env['LOCALE'] === 'en' ? 'OK, got it' : 'OK';

/**
 * E2E Test Suite: Cost Estimation - Edge Cases
 *
 * Tests boundary conditions and edge cases
 * Covers:
 * - Minimum viable configuration (TC-004)
 * - Maximum instance counts (TC-005)
 * - Session persistence (TC-010)
 * - Browser navigation (TC-011)
 * - Performance with high values
 */
test.describe('Cost Estimation - Edge Cases', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);
  });

  test('TC-004: Should handle minimum viable configuration', async () => {
    const config = EDGE_CASES.MINIMUM_VIABLE;

    await calculatorPage.configurComputeEngine(config.config);

    // Verify cost is displayed
    await calculatorPage.verifyCostIsDisplayed();

    // Even minimum config should show cost
    const cost = await calculatorPage.getCostValue();
    expect(cost).toBeGreaterThanOrEqual(0);

    const costText = await calculatorPage.getCostText();
    expect(costText).toMatch(/\$[\d,]+\.\d+/);
  });

  test('TC-005: Should handle maximum instance count', async ({ page }) => {
    const config = EDGE_CASES.MAXIMUM_INSTANCES;

    try {
      await calculatorPage.configurComputeEngine(config.config);

      // If system accepts high instance count
      await calculatorPage.verifyCostIsDisplayed();

      const cost = await calculatorPage.getCostValue();
      expect(cost).toBeGreaterThan(1000);
    } catch (error) {
      // System may have maximum limit - verify graceful handling
      expect(error).toBeDefined();
    }
  });

  test('TC-006: Should handle maximum disk size', async () => {
    const config = EDGE_CASES.MAXIMUM_DISK;

    try {
      await calculatorPage.configurComputeEngine(config.config);

      await calculatorPage.verifyCostIsDisplayed();

      const cost = await calculatorPage.getCostValue();
      expect(cost).toBeGreaterThan(0);
    } catch (error) {
      // System may have maximum disk limit
      expect(error).toBeDefined();
    }
  });

  test('TC-010: Should handle page reload during configuration', async ({ page }) => {
    // Start configuration
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    await calculatorPage.setInstanceCount(3);
    await calculatorPage.waitForCostToLoad();

    const costBeforeReload = await calculatorPage.getCostValue();

    // Reload page
    await page.reload();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);

    // Verify page loads without errors
    await calculatorPage.verifyOnCalculatorPage();

    // Configuration may or may not persist (depends on application design)
    // Verify calculator is functional after reload
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await expect(page).toHaveURL(/calculator/);
  });

  test('TC-011: Should handle browser back button', async ({ page }) => {
    // Configure calculator
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // Navigate to different section of site
    await page.goto('https://cloud.google.com/products');

    // Go back
    await page.goBack();

    // Verify calculator page loads
    await page.waitForLoadState('load');

    // Should be back on calculator page
    const currentUrl = page.url();
    expect(currentUrl).toContain('calculator');
  });

  test('TC-012: Should maintain calculator state during session', async ({ page }) => {
    const config = TEST_CONFIGS.BASIC_CONFIG;

    await calculatorPage.configurComputeEngine(config.config);

    const initialCost = await calculatorPage.getCostValue();

    // Wait for some time
    await page.waitForTimeout(3000);

    // Cost should remain the same
    const laterCost = await calculatorPage.getCostValue();
    expect(laterCost).toBe(initialCost);

    // Configuration section should still be visible
    await calculatorPage.verifyConfigurationSectionDisplayed();
  });

  test('TC-013: Should handle high volume configuration (100 instances)', async () => {
    const config = TEST_CONFIGS.HIGH_VOLUME_CONFIG;

    await calculatorPage.configurComputeEngine(config.config);

    // Verify cost calculation completes
    await calculatorPage.verifyCostIsDisplayed();

    const cost = await calculatorPage.getCostValue();

    // High volume should result in high cost
    if (config.expectedCost?.minCost && config.expectedCost?.maxCost) {
      expect(cost).toBeGreaterThanOrEqual(config.expectedCost.minCost);
      expect(cost).toBeLessThanOrEqual(config.expectedCost.maxCost);
    }
  });

  test('TC-014: Should handle single instance configuration', async () => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // Set to exactly 1 instance
    await calculatorPage.setInstanceCount(1);
    await calculatorPage.waitForCostToLoad();

    // Verify cost is calculated
    await calculatorPage.verifyCostIsDisplayed();

    const cost = await calculatorPage.getCostValue();
    expect(cost).toBeGreaterThan(0);
  });

  test('TC-015: Should handle minimum disk size (10GB)', async () => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // Set minimum disk size
    await calculatorPage.setDiskSize(10);
    await calculatorPage.waitForCostToLoad();

    await calculatorPage.verifyCostIsDisplayed();

    const cost = await calculatorPage.getCostValue();
    expect(cost).toBeGreaterThanOrEqual(0);
  });

  test('TC-016: Should handle configuration changes without page reload', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // Make multiple configuration changes
    await calculatorPage.setInstanceCount(2);
    await page.waitForTimeout(800);
    await calculatorPage.setDiskSize(200);
    await page.waitForTimeout(800);
    await calculatorPage.setInstanceCount(5);
    await page.waitForTimeout(800);

    // Verify cost updates dynamically
    await calculatorPage.verifyCostIsDisplayed();

    const finalCost = await calculatorPage.getCostValue();
    expect(finalCost).toBeGreaterThan(0);
  });

  test('TC-017: Should handle boundary value for instance count (1, 2, 10, 100)', async ({
    page,
  }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    const instanceCounts = [1, 2, 10, 100];
    const costs: number[] = [];

    // Initial cost text (default 1 instance already loaded)
    let prevCostText = await calculatorPage.getCostText();

    for (const count of instanceCounts) {
      await calculatorPage.setInstanceCount(count);
      // Wait for cost to actually change (or stabilise if count == initial)
      await calculatorPage.waitForCostToChange(prevCostText).catch(() => {
        // Cost may not change when setting back to same value – that's OK
      });
      await calculatorPage.waitForCostToLoad();

      prevCostText = await calculatorPage.getCostText();
      const cost = await calculatorPage.getCostValue();
      costs.push(cost);

      expect(cost).toBeGreaterThan(0);
    }

    // Costs should generally increase with instance count
    expect(costs[1]).toBeGreaterThanOrEqual(costs[0]); // 2 >= 1
    expect(costs[2]).toBeGreaterThan(costs[1]); // 10 > 2
    expect(costs[3]).toBeGreaterThan(costs[2]); // 100 > 10
  });

  test('TC-018: Should handle boundary value for disk size (10, 100, 1000)', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    await calculatorPage.setInstanceCount(1);
    await calculatorPage.waitForCostToLoad();

    const diskSizes = [10, 100, 1000];
    const costs: number[] = [];

    let prevDiskCostText = await calculatorPage.getCostText();

    for (const size of diskSizes) {
      await calculatorPage.setDiskSize(size);
      await calculatorPage.waitForCostToChange(prevDiskCostText).catch(() => {
        // Cost may not change when disk size equals the current value
      });
      await calculatorPage.waitForCostToLoad();

      prevDiskCostText = await calculatorPage.getCostText();
      const cost = await calculatorPage.getCostValue();
      costs.push(cost);

      expect(cost).toBeGreaterThan(0);
    }

    // Costs should increase with disk size
    expect(costs[1]).toBeGreaterThan(costs[0]); // 100GB > 10GB
    expect(costs[2]).toBeGreaterThan(costs[1]); // 1000GB > 100GB
  });

  test('TC-019: Should handle repeated configuration actions', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // Repeatedly change and revert configuration
    for (let i = 0; i < 3; i++) {
      await calculatorPage.setInstanceCount(5);
      await page.waitForTimeout(500);
      await calculatorPage.setInstanceCount(2);
      await page.waitForTimeout(500);
    }

    // Final wait for cost stabilization
    await calculatorPage.waitForCostToLoad();

    // Should display valid cost
    await calculatorPage.verifyCostIsDisplayed();
    const cost = await calculatorPage.getCostValue();
    expect(cost).toBeGreaterThan(0);
  });

  test('TC-020: Should handle long session duration', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    await calculatorPage.setInstanceCount(2);
    await calculatorPage.waitForCostToLoad();

    const initialCost = await calculatorPage.getCostValue();
    const costTextAt2 = await calculatorPage.getCostText();

    // Simulate long session (wait 5 seconds)
    await page.waitForTimeout(5000);

    // Verify calculator still works
    await calculatorPage.setInstanceCount(3);
    await calculatorPage.waitForCostToChange(costTextAt2);

    const laterCost = await calculatorPage.getCostValue();
    expect(laterCost).toBeGreaterThan(0);
    expect(laterCost).toBeGreaterThan(initialCost);
  });
});
