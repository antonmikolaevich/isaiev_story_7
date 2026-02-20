import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';
import { CalculatorPage } from '../../pageObject/calculator_page';
import { parseCsv, isValidCsv, csvContainsValue } from '../../helpers/csv-helper';

const COOKIE_BUTTON_TEXT = process.env['LOCALE'] === 'en' ? 'OK, got it' : 'OK';
const DOWNLOADS_DIR = path.join(process.cwd(), 'test-results', 'downloads');

/**
 * E2E Test Suite: CSV Export – Cost Estimation
 *
 * Scenario: Export cost estimate as CSV
 *   Given I am a user of the Google Pricing Calculator
 *   When I estimate the cost of a Compute Engine Instance
 *   Then I should be able to export the estimated cost as a CSV file
 *   And The file contains the same information that is present on UI
 *
 * Covers:
 * - TC-CSV-001: File is downloaded successfully (TC-CSV-001)
 * - TC-CSV-002: File has valid CSV format
 * - TC-CSV-003: File has correct structure (headers, row count, data format)
 * - TC-CSV-004: File content matches the UI estimate information
 */
test.describe('CSV Export – Cost Estimation', () => {
  let calculatorPage: CalculatorPage;
  let uiCostValue: number;
  const downloadedFiles: string[] = [];

  test.beforeAll(() => {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  });

  test.afterAll(() => {
    for (const filePath of downloadedFiles) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  });

  test.beforeEach(async ({ page }) => {
    // Increase timeout to accommodate navigation + configuration + download
    test.setTimeout(60 * 1000);

    calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.handleCookieConsent(COOKIE_BUTTON_TEXT);

    await calculatorPage.clickAddToEstimate();
    await calculatorPage.waitForEstimationModal();
    await calculatorPage.selectComputeEngine();
    await calculatorPage.waitForConfigurationSection();
    await calculatorPage.waitForCostToLoad();

    uiCostValue = await calculatorPage.getCostValue();
  });

  test('TC-CSV-001: Should download a non-empty CSV file when exporting the estimate', async () => {
    const filePath = path.join(DOWNLOADS_DIR, `estimate-tc001-${Date.now()}.csv`);

    const downloadedPath = await calculatorPage.downloadEstimateAsCsv(filePath);
    downloadedFiles.push(downloadedPath);

    expect(fs.existsSync(downloadedPath)).toBe(true);
    expect(fs.statSync(downloadedPath).size).toBeGreaterThan(0);
  });

  test('TC-CSV-002: Downloaded file should have a valid CSV format', async () => {
    const filePath = path.join(DOWNLOADS_DIR, `estimate-tc002-${Date.now()}.csv`);

    const downloadedPath = await calculatorPage.downloadEstimateAsCsv(filePath);
    downloadedFiles.push(downloadedPath);

    expect(path.extname(downloadedPath).toLowerCase()).toBe('.csv');

    const content = fs.readFileSync(downloadedPath, 'utf-8');
    expect(isValidCsv(content)).toBe(true);
  });

  test('TC-CSV-003: CSV file should have correct structure', async () => {
    const filePath = path.join(DOWNLOADS_DIR, `estimate-tc003-${Date.now()}.csv`);

    const downloadedPath = await calculatorPage.downloadEstimateAsCsv(filePath);
    downloadedFiles.push(downloadedPath);

    const content = fs.readFileSync(downloadedPath, 'utf-8');
    const csvData = parseCsv(content);

    // Header row must exist and contain non-empty column names
    expect(csvData.headers.length).toBeGreaterThan(0);
    csvData.headers.forEach((header) => {
      expect(header.trim().length).toBeGreaterThan(0);
    });

    // At least one data row must be present
    expect(csvData.rows.length).toBeGreaterThan(0);

    // Every data row must have the same number of columns as the header
    const columnCount = csvData.headers.length;
    csvData.rows.forEach((row) => {
      expect(row.length).toBe(columnCount);
    });

    // At least one cell across all data rows must contain a numeric value
    const allCells = csvData.rows.flat();
    const hasNumericValue = allCells.some((cell) => /\d+(\.\d+)?/.test(cell));
    expect(hasNumericValue).toBe(true);
  });

  test('TC-CSV-004: CSV content should match the estimate information shown on the UI', async () => {
    const filePath = path.join(DOWNLOADS_DIR, `estimate-tc004-${Date.now()}.csv`);

    const downloadedPath = await calculatorPage.downloadEstimateAsCsv(filePath);
    downloadedFiles.push(downloadedPath);

    const content = fs.readFileSync(downloadedPath, 'utf-8');
    const csvData = parseCsv(content);

    // The CSV should reference the Compute Engine service
    expect(csvContainsValue(csvData, 'Compute Engine')).toBe(true);

    // The CSV should contain the monthly cost value displayed in the UI
    const costString = uiCostValue.toFixed(2);
    expect(csvContainsValue(csvData, costString)).toBe(true);
  });
});
