# ESLint and Prettier Setup

This document describes the ESLint and Prettier configuration for this project.

## Installed Tools

### ESLint

- **eslint** - Core linting tool
- **@eslint/js** - ESLint recommended rules
- **typescript-eslint** - TypeScript support for ESLint
- **eslint-plugin-playwright** - Playwright-specific linting rules
- **eslint-plugin-prettier** - Prettier integration
- **eslint-config-prettier** - Disables ESLint rules that conflict with Prettier

### Prettier

- **prettier** - Code formatter

## Configuration Files

### eslint.config.mjs

Main ESLint configuration using the flat config format (ESLint 9+).

**Key features:**

- TypeScript support with type-aware linting
- Playwright plugin for test files
- Prettier integration
- Custom rules with different severity levels

### .prettierrc.json

Prettier formatting rules:

- Single quotes
- Semicolons
- 2-space indentation
- 100 character line width
- Trailing commas

### .prettierignore

Files and directories ignored by Prettier:

- node_modules
- playwright-report
- test-results
- build artifacts

## Custom Rules

### Error Level (❌ Fails lint)

- `no-console: error` - Prevents console.log in production code (allowed in tests)
- `@typescript-eslint/no-explicit-any: error` - Prevents using 'any' type
- `playwright/expect-expect: error` - Requires assertions in tests
- `playwright/prefer-web-first-assertions: error` - Enforces web-first assertions
- `playwright/no-element-handle: error` - Prevents using deprecated element handles

### Warning Level (⚠️ Shows warning)

- `@typescript-eslint/no-unused-vars: warn` - Warns about unused variables (ignored if prefixed with \_)
- `no-debugger: warn` - Warns about debugger statements
- `playwright/no-conditional-in-test: warn` - Warns about conditional logic in tests
- `playwright/no-wait-for-timeout: warn` - Warns about using waitForTimeout

### Disabled Rules

- `@typescript-eslint/explicit-function-return-type: off` - Return types are optional
- `@typescript-eslint/no-non-null-assertion: off` - Non-null assertions are allowed

## Ignored Patterns

The following are excluded from linting:

- `node_modules/`
- `playwright-report/`
- `test-results/`
- `dist/` and `build/`
- `coverage/`
- `*.config.ts/js/mjs` files
- `wdio.conf.js` (legacy WebDriverIO config)
- Log files

## NPM Scripts

### Linting

```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors
```

### Formatting

```bash
npm run format        # Format all files with Prettier
npm run format:check  # Check if files are formatted correctly
```

### Combined Check

```bash
npm run check         # Run format check and lint together
```

## Usage Examples

### Check code before commit:

```bash
npm run check
```

### Fix all auto-fixable issues:

```bash
npm run lint:fix
npm run format
```

### Verify specific file:

```bash
npx eslint src/tests/sample/playwright-sample.spec.ts
```

## CI/CD Integration

Add to your CI pipeline:

```bash
npm run check  # Verifies formatting and linting
npm run test   # Runs tests
```

## IDE Integration

### VS Code

Install the following extensions:

- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "typescript"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Troubleshooting

### ESLint errors in test files

Make sure your test files are in the correct directory patterns:

- `src/tests/**/*.ts`
- `**/*.spec.ts`
- `**/*.test.ts`

### Prettier conflicts with ESLint

The `eslint-config-prettier` package is configured to disable conflicting rules. If you see conflicts, ensure both are up to date.

### Performance issues

ESLint with TypeScript type checking can be slow on large projects. Consider:

- Using `--max-warnings 0` in CI only
- Running type checking separately: `npm run type-check`
