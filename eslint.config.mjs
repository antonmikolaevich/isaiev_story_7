import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwrightPlugin from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript ESLint recommended rules
  ...tseslint.configs.recommended,

  // Prettier config to disable conflicting rules
  prettierConfig,

  // Global ignore patterns
  {
    ignores: [
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      '*.config.ts',
      '*.config.js',
      '*.config.mjs',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.log',
      'wdio.conf.js', // Legacy WebDriverIO config
    ],
  },

  // Configuration for all TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // Custom rules with different severity levels
      // Error level rules (will fail the lint)
      'no-console': 'error', // Prevent console.log in production code
      '@typescript-eslint/no-explicit-any': 'error', // Avoid using 'any' type
      '@typescript-eslint/explicit-function-return-type': 'off', // Don't require explicit return types

      // Warning level rules (will warn but not fail)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-debugger': 'warn', // Warn about debugger statements

      // Off rules (disabled)
      '@typescript-eslint/no-non-null-assertion': 'off', // Allow non-null assertions
    },
  },

  // Configuration specifically for test files
  {
    files: ['src/tests/**/*.ts', '**/*.spec.ts', '**/*.test.ts'],
    plugins: {
      playwright: playwrightPlugin,
    },
    rules: {
      // Playwright recommended rules
      ...playwrightPlugin.configs['flat/recommended'].rules,

      // Allow console in test files for debugging
      'no-console': 'off',

      // Playwright-specific rules
      'playwright/expect-expect': [
        'error',
        {
          assertFunctionNames: [
            'expect',
            'verifyOnCalculatorPage',
            'verifyEstimationModalDisplayed',
            'verifyConfigurationSectionDisplayed',
            'verifyCostDisplayed',
            'verifyCostIsDisplayed',
          ],
        },
      ],
      'playwright/no-conditional-in-test': 'warn',
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/no-element-handle': 'error',
    },
  },
);
