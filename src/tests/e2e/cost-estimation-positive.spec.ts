import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { CalculatorPage } from '../../pageObject/calculator_page';
import { TEST_CONFIGS } from '../../testData/calculator-configs';

const COOKIE_BUTTON_TEXT = process.env['LOCALE'] === 'en' ? 'OK, got it' : 'OK';

/**
 * E2E Test Suite: Cost Estimation - Positive Scenarios
 *
 * Tests the successful flow of estimating monthly costs for GCP Compute Engine
 * Covers:
 * - Basic cost estimation (TC-001)
 * - Instance count variations
 * - Cost display validation
 * - Configuration state management
 *
 * Note: Advanced configurations (machine type, OS, region, disk) require
 * accurate UI locators to be implemented in Page Object.
 */
test.describe('Cost Estimation - Positive Scenarios', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);
  });

  test('TC-001: Should estimate cost for basic Compute Engine configuration', async () => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // Wait for initial cost (default 1 instance)
    await calculatorPage.waitForCostToLoad();

    // Verify cost is displayed
    await calculatorPage.verifyCostIsDisplayed();

    // Verify cost format
    const costText = await calculatorPage.getCostText();
    expect(costText).toMatch(/\$\d+\.\d+/);

    // Verify cost is positive
    const cost = await calculatorPage.getCostValue();
    expect(cost).toBeGreaterThan(0);
  });

  test('TC-002: Should estimate cost for 2 instances configuration', async () => {
    const config = { instances: 2 };

    await calculatorPage.configurComputeEngine(config);

    // Verify cost is displayed
    await calculatorPage.verifyCostIsDisplayed();

    // Verify cost is positive and reasonable
    const cost = await calculatorPage.getCostValue();
    expect(cost).toBeGreaterThan(0);
    expect(cost).toBeLessThan(10000);

    // Verify cost format
    const costText = await calculatorPage.getCostText();
    expect(costText).toMatch(/\$\d+\.\d+/);
  });

  test('TC-003: Should estimate cost for 3 instances configuration', async () => {
    const config = { instances: 3 };

    await calculatorPage.configurComputeEngine(config);

    // Verify cost is displayed
    await calculatorPage.verifyCostIsDisplayed();

    const cost = await calculatorPage.getCostValue();
    expect(cost).toBeGreaterThan(0);
  });

  test('TC-004: Should estimate cost for 5 instances configuration', async () => {
    const config = { instances: 5 };

    await calculatorPage.configurComputeEngine(config);

    // Verify cost is displayed
    await calculatorPage.verifyCostIsDisplayed();

    const cost = await calculatorPage.getCostValue();
    expect(cost).toBeGreaterThan(0);
  });

  test('TC-005: Should estimate cost for 10 instances configuration', async () => {
    const config = { instances: 10 };

    await calculatorPage.configurComputeEngine(config);

    // Verify cost is displayed
    await calculatorPage.verifyCostIsDisplayed();

    const cost = await calculatorPage.getCostValue();
    expect(cost).toBeGreaterThan(0);
    expect(cost).toBeGreaterThan(100);
  });

  test('TC-006: Should display cost immediately after configuration', async () => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // Wait for initial cost (default configuration)
    await calculatorPage.waitForCostToLoad();

    // Verify cost is displayed
    await calculatorPage.verifyCostIsDisplayed();

    const costText = await calculatorPage.getCostText();
    expect(costText).not.toBe('--');
    expect(costText).not.toBe('');
  });

  test('TC-007: Should show cost for single instance (default)', async () => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    await calculatorPage.waitForCostToLoad();

    // Verify cost is displayed for single instance
    await calculatorPage.verifyCostIsDisplayed();

    const cost = await calculatorPage.getCostValue();
    expect(cost).toBeGreaterThan(0);
    expect(cost).toBeLessThan(1000);
  });

  test('TC-008: Should maintain calculator state after cost calculation', async () => {
    const config = { instances: 2 };

    await calculatorPage.configurComputeEngine(config);

    // Verify cost is displayed
    await calculatorPage.verifyCostIsDisplayed();

    // Verify configuration section is still accessible
    await calculatorPage.verifyConfigurationSectionDisplayed();

    // Verify cost remains displayed
    const costText = await calculatorPage.getCostText();
    expect(costText).toMatch(/\$\d+\.\d+/);
  });
});
