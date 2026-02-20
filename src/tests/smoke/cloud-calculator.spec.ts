import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { CalculatorPage } from '../../pageObject/calculator_page';

const COOKIE_BUTTON_TEXT = process.env['LOCALE'] === 'en' ? 'OK, got it' : 'OK';
// Note: Expected cost may vary based on Google Cloud pricing changes
const EXPECTED_COST = '$201.03';

test.describe('Cloud Calculator', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);
  });

  test('Should be able to add new entities into the calculator', async () => {
    await calculatorPage.verifyOnCalculatorPage();

    await calculatorPage.clickAddToEstimate();

    await calculatorPage.waitForEstimationModal();
    await calculatorPage.verifyEstimationModalDisplayed();

    await calculatorPage.selectComputeEngine();

    await calculatorPage.waitForConfigurationSection();
    await calculatorPage.verifyConfigurationSectionDisplayed();
  });

  test('Should be able to add two new instances and verify cost', async () => {
    // First, set up the calculator (same steps as previous test)
    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();

    // Then increment instances and verify cost
    await calculatorPage.incrementInstances(2);
    await calculatorPage.verifyCostDisplayed(EXPECTED_COST);
  });
});
