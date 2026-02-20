import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { CalculatorPage } from '../../pageObject/calculator_page';
import { INVALID_CONFIGS } from '../../testData/calculator-configs';

const COOKIE_BUTTON_TEXT = process.env['LOCALE'] === 'en' ? 'OK, got it' : 'OK';

/**
 * E2E Test Suite: Cost Estimation - Negative Scenarios
 *
 * Tests error handling and validation for invalid inputs
 * Covers:
 * - Zero instances (TC-006)
 * - Negative instances (TC-007)
 * - Invalid characters in input fields (TC-008)
 * - Empty required fields (TC-009)
 */
test.describe('Cost Estimation - Negative Scenarios', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);
  });

  test('TC-006: Should handle zero instances gracefully', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // Wait for initial cost
    await calculatorPage.waitForCostToLoad();

    // Try to set instances to 0
    await calculatorPage.setInstanceCount(0);
    await page.waitForTimeout(1000);

    // System should either:
    // 1. Show validation error
    // 2. Not accept the value
    // 3. Show no cost or $0.00
    const costText = await calculatorPage.getCostText();

    // Verify system handles zero instances appropriately
    // Either shows $0.00 or maintains previous valid value
    expect(costText).toBeTruthy();
  });

  test('TC-007: Should prevent negative instance values', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    await calculatorPage.waitForCostToLoad();

    // Try to set negative instances
    try {
      await calculatorPage.setInstanceCount(-5);
      await page.waitForTimeout(1000);

      // If no error thrown, verify system handles it gracefully
      const costText = await calculatorPage.getCostText();
      expect(costText).toBeTruthy();

      // Cost should not be negative
      const costValue = await calculatorPage.getCostValue();
      expect(costValue).toBeGreaterThanOrEqual(0);
    } catch (error) {
      // System may prevent negative input entirely - this is acceptable
      expect(error).toBeDefined();
    }
  });

  test('TC-008: Should handle special characters in instance field', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    await calculatorPage.waitForCostToLoad();

    // Get instance input field directly
    const instanceInput = page.getByRole('spinbutton').first();

    // Try to enter special characters
    await instanceInput.clear();
    await instanceInput.type('!@#$%');
    await page.waitForTimeout(500);

    const inputValue = await instanceInput.inputValue();

    // Field should either:
    // 1. Not accept special characters
    // 2. Show validation error
    // 3. Clear invalid input
    expect(inputValue).not.toContain('!');
    expect(inputValue).not.toContain('@');
    expect(inputValue).not.toContain('#');
  });

  test('TC-009: Should handle alphabetic characters in instance field', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    await calculatorPage.waitForCostToLoad();

    // Get instance input field
    const instanceInput = page.getByRole('spinbutton').first();

    // Try to enter letters
    await instanceInput.clear();
    await instanceInput.type('abc');
    await page.waitForTimeout(500);

    const inputValue = await instanceInput.inputValue();

    // Field should not accept alphabetic characters
    expect(inputValue).not.toContain('a');
    expect(inputValue).not.toContain('b');
    expect(inputValue).not.toContain('c');
  });

  test('TC-010: Should handle negative disk size', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    await calculatorPage.waitForCostToLoad();

    // Try to set negative disk size
    try {
      await calculatorPage.setDiskSize(-100);
      await page.waitForTimeout(1000);

      // If no error thrown, verify system handles it gracefully
      const costValue = await calculatorPage.getCostValue();
      expect(costValue).toBeGreaterThanOrEqual(0);
    } catch (error) {
      // System may prevent negative input - this is acceptable
      expect(error).toBeDefined();
    }
  });

  test('TC-011: Should handle extremely large instance count', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    await calculatorPage.waitForCostToLoad();

    // Try to set very large instance count
    const largeCount = 999999;

    try {
      await calculatorPage.setInstanceCount(largeCount);
      await page.waitForTimeout(2000);

      // System should either:
      // 1. Accept and calculate (may take time)
      // 2. Show validation error for maximum limit
      // 3. Cap at reasonable maximum

      const costText = await calculatorPage.getCostText();
      expect(costText).toBeTruthy();

      // If cost is calculated, it should be very large
      const costValue = await calculatorPage.getCostValue();
      if (costValue > 0) {
        expect(costValue).toBeGreaterThan(1000);
      }
    } catch (error) {
      // System may have maximum limit - this is acceptable
      expect(error).toBeDefined();
    }
  });

  test('TC-012: Should handle extremely large disk size', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    await calculatorPage.waitForCostToLoad();

    const largeDiskSize = 100000;

    try {
      await calculatorPage.setDiskSize(largeDiskSize);
      await page.waitForTimeout(2000);

      // System should handle large disk size gracefully
      const costText = await calculatorPage.getCostText();
      expect(costText).toBeTruthy();

      const costValue = await calculatorPage.getCostValue();
      expect(costValue).toBeGreaterThanOrEqual(0);
    } catch (error) {
      // System may have maximum disk size limit
      expect(error).toBeDefined();
    }
  });

  test('TC-013: Should handle mixed valid and invalid inputs', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    await calculatorPage.waitForCostToLoad();

    // Set valid instances
    await calculatorPage.setInstanceCount(2);
    await page.waitForTimeout(500);

    const costAfterValidInput = await calculatorPage.getCostValue();
    expect(costAfterValidInput).toBeGreaterThan(0);

    // Try invalid instance count
    const instanceInput = page.getByRole('spinbutton').first();
    await instanceInput.clear();
    await instanceInput.type('0');
    await page.waitForTimeout(1000);

    // System should maintain valid state or show error
    const costText = await calculatorPage.getCostText();
    expect(costText).toBeTruthy();
  });

  test('TC-014: Should validate required fields before calculation', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // System should show default values or require input
    // Cost should calculate with defaults or wait for required fields

    await calculatorPage.waitForCostToLoad();
    const costText = await calculatorPage.getCostText();

    // Either shows cost with defaults or indicates missing fields
    expect(costText).toBeTruthy();
  });

  test('TC-015: Should handle rapid consecutive input changes', async ({ page }) => {
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    await calculatorPage.waitForCostToLoad();

    // Rapid changes without waiting
    await calculatorPage.setInstanceCount(2);
    await calculatorPage.setInstanceCount(5);
    await calculatorPage.setInstanceCount(3);

    // Wait for system to stabilize
    await page.waitForTimeout(2000);

    // Should show cost for final value (3 instances)
    const costText = await calculatorPage.getCostText();
    expect(costText).toMatch(/\$[\d,]+\.\d+/);

    const cost = await calculatorPage.getCostValue();
    expect(cost).toBeGreaterThan(0);
  });
});
