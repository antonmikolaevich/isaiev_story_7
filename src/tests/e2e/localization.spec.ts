import { test } from '@playwright/test';
import { LocalizationPage } from '../../pageObject/localization_page';
import { SUPPORTED_LOCALES } from '../../testData/locale-configs';

/**
 * Localization Test Suite - Header and Footer translations
 *
 * Verifies that the page Header and Footer display correctly translated content
 * for each supported language.
 *
 * Data-driven: all language-specific values are defined in locale-configs.ts.
 * To add a new language, add an entry to SUPPORTED_LOCALES — no changes here needed.
 *
 * Languages covered:
 *   - English (en)
 *   - Español (es)
 *   - 日本語 (ja)
 */
for (const locale of SUPPORTED_LOCALES) {
  test.describe(`Localization [${locale.code}] - ${locale.name}`, () => {
    let locPage: LocalizationPage;

    test.beforeEach(async ({ page }) => {
      locPage = new LocalizationPage(page, locale.urlPath);
      await locPage.open();
      await locPage.handleCookieConsent(locale.cookieButtonText);
    });

    test('TC-LOC-001: Header should display translated navigation items', async () => {
      for (const expectedText of Object.values(locale.header)) {
        await locPage.verifyHeaderContains(expectedText);
      }
    });

    test('TC-LOC-002: Footer should display translated links', async () => {
      for (const expectedText of Object.values(locale.footer)) {
        await locPage.verifyFooterContains(expectedText);
      }
    });
  });
}
