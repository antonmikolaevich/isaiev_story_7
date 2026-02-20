/**
 * Locale configurations for localization testing.
 *
 * Each locale entry defines:
 *  - The URL path for the localized version of the page
 *  - Cookie consent button text specific to that locale
 *  - Expected translated text for Header navigation items
 *  - Expected translated text for Footer links
 *
 * To add a new language, append a new entry to SUPPORTED_LOCALES.
 * No changes to test code are required.
 */

export interface LocaleConfig {
  /** BCP 47 language code */
  code: string;
  /** Human-readable language name used in test descriptions */
  name: string;
  /** Relative URL path for the localized calculator page */
  urlPath: string;
  /** Cookie consent button label for this locale */
  cookieButtonText: string;
  /**
   * Expected translated text visible in the page Header navigation.
   * Keys are semantic labels; values are the expected displayed text.
   */
  header: Record<string, string>;
  /**
   * Expected translated text visible in the page Footer.
   * Keys are semantic labels; values are the expected displayed text.
   */
  footer: Record<string, string>;
}

export const SUPPORTED_LOCALES: LocaleConfig[] = [
  {
    code: 'en',
    name: 'English',
    urlPath: '/products/calculator',
    cookieButtonText: 'OK, got it',
    header: {
      products: 'Products',
      solutions: 'Solutions',
      pricing: 'Pricing',
    },
    footer: {
      privacy: 'Privacy',
      terms: 'Site terms',
    },
  },
  {
    code: 'es',
    name: 'Español',
    urlPath: '/intl/es/products/calculator',
    cookieButtonText: 'OK',
    header: {
      products: 'Productos',
      solutions: 'Soluciones',
      pricing: 'Precios',
    },
    footer: {
      privacy: 'Privacidad',
      terms: 'Términos',
    },
  },
  {
    code: 'ja',
    name: '日本語',
    urlPath: '/intl/ja/products/calculator',
    cookieButtonText: 'OK',
    header: {
      products: 'プロダクト',
      solutions: 'ソリューション',
      pricing: '料金',
    },
    footer: {
      privacy: 'プライバシー',
      terms: '利用規約',
    },
  },
];
