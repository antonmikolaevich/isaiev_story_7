import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { CalculatorPage } from '../../pageObject/calculator_page';
import { COMPARISON_SCENARIOS, MACHINE_TYPES } from '../../testData/calculator-configs';

const COOKIE_BUTTON_TEXT = process.env['LOCALE'] === 'en' ? 'OK, got it' : 'OK';

/**
 * E2E Test Suite: Cost Estimation - Comparison Scenarios
 *
 * Tests cost comparison functionality for different configurations
 * Covers:
 * - Instance count comparison
 * - Cost scaling validation
 * - Dynamic cost updates
 *
 * Note: Machine type, region, OS comparisons require accurate locators.
 * These tests focus on instance count variations which are currently supported.
 */
test.describe('Cost Estimation - Comparison Scenarios', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);
  });

  test('TC-002: Should show higher cost for more instances', async () => {
    // Start with single instance
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();
    await calculatorPage.waitForCostToLoad();

    const cost1Text = await calculatorPage.getCostText();
    const cost1 = await calculatorPage.getCostValue();

    // Increment to 2 instances and wait for the displayed value to actually change
    await calculatorPage.incrementInstances(1);
    await calculatorPage.waitForCostToChange(cost1Text);

    const cost2 = await calculatorPage.getCostValue();

    // 2 instances should cost more than 1
    expect(cost2).toBeGreaterThan(cost1);
  });

  test('TC-003: Should show proportional cost increase with instance count', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();
    await calculatorPage.waitForCostToLoad();

    const cost1 = await calculatorPage.getCostValue();

    // Increment to 3 instances
    await calculatorPage.incrementInstances(2);
    await page.waitForTimeout(1500);
    await calculatorPage.waitForCostToLoad();

    const cost3 = await calculatorPage.getCostValue();

    // 3 instances should cost more than 1
    expect(cost3).toBeGreaterThan(cost1 * 2);
  });

  test('TC-004: Should update cost dynamically when incrementing instances', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();
    await calculatorPage.waitForCostToLoad();

    const initialCostText = await calculatorPage.getCostText();
    const initialCost = await calculatorPage.getCostValue();

    // Increment once and wait for the displayed value to actually change
    await calculatorPage.incrementInstances(1);
    await calculatorPage.waitForCostToChange(initialCostText);

    const afterIncrement = await calculatorPage.getCostValue();

    // Cost should increase
    expect(afterIncrement).toBeGreaterThan(initialCost);
  });

  test('TC-005: Should maintain cost for same configuration', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();
    await calculatorPage.waitForCostToLoad();

    const initialCost = await calculatorPage.getCostValue();

    // Wait and verify cost remains stable
    await page.waitForTimeout(2000);

    const laterCost = await calculatorPage.getCostValue();
    expect(laterCost).toBe(initialCost);
  });

  test('TC-006: Should calculate cost for 4 instances correctly', async ({ page }) => {
    const config = { instances: 4 };

    await calculatorPage.configurComputeEngine(config);
    await calculatorPage.verifyCostIsDisplayed();

    const cost = await calculatorPage.getCostValue();
    expect(cost).toBeGreaterThan(0);

    // 4 instances should cost more than minimum
    expect(cost).toBeGreaterThan(50);
  });

  test('TC-007: Should calculate cost for 6 instances correctly', async ({ page }) => {
    const config = { instances: 6 };

    await calculatorPage.configurComputeEngine(config);
    await calculatorPage.verifyCostIsDisplayed();

    const cost = await calculatorPage.getCostValue();
    expect(cost).toBeGreaterThan(0);
  });
});
