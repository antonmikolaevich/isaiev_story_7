import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pageObject/calculator_page';

const COOKIE_BUTTON_TEXT = process.env['LOCALE'] === 'en' ? 'OK, got it' : 'OK';

test.describe('Visual Screenshot Tests', () => {
  test.setTimeout(60 * 1000);

  test('TC-VIS-001: Calculator page matches baseline screenshot', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveScreenshot('calculator-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('TC-VIS-002: Add to estimate button matches baseline screenshot', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);

    const addToEstimateButton = page.locator('span', { hasText: 'Add to estimate' }).first();
    await expect(addToEstimateButton).toBeVisible();

    await expect(addToEstimateButton).toHaveScreenshot('add-to-estimate-button.png');
  });

  test('TC-VIS-003: Service selection modal matches baseline screenshot', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);

    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();

    const modal = page.locator('[aria-label="Add to this estimate"]');
    await expect(modal).toBeVisible();

    await expect(modal).toHaveScreenshot('service-selection-modal.png', {
      animations: 'disabled',
    });
  });
});
