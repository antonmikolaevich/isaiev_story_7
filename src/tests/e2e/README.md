# E2E Test Suite: GCP Pricing Calculator Cost Estimation

This directory contains comprehensive end-to-end test scenarios for the "Estimate Monthly Cost of Specific GCP Service" user story.

## Test Organization

### Test Files

| File | Description | Test Cases |
|------|-------------|------------|
| `cost-estimation-positive.spec.ts` | Positive path scenarios | TC-001 to TC-008 |
| `cost-estimation-comparison.spec.ts` | Configuration comparison tests | TC-002, TC-003, TC-013-017 |
| `cost-estimation-negative.spec.ts` | Negative path and validation tests | TC-006 to TC-015 |
| `cost-estimation-edge-cases.spec.ts` | Edge cases and boundary testing | TC-004, TC-005, TC-010-020 |

## Running Tests

### Run all e2e tests
```bash
npm test src/tests/e2e
```

### Run specific test suite
```bash
npm test src/tests/e2e/cost-estimation-positive.spec.ts
npm test src/tests/e2e/cost-estimation-comparison.spec.ts
npm test src/tests/e2e/cost-estimation-negative.spec.ts
npm test src/tests/e2e/cost-estimation-edge-cases.spec.ts
```

### Run in headed mode (see browser)
```bash
npm run test:headed src/tests/e2e
```

### Run with UI mode (interactive)
```bash
npm run test:ui
```

### Debug specific test
```bash
npm run test:debug src/tests/e2e/cost-estimation-positive.spec.ts
```

## Test Coverage

### Positive Scenarios (8 tests)
- Basic configuration with n1-standard-1 machine type
- Upgraded configuration with n1-standard-2
- Minimal configuration testing
- Premium Windows Server configuration
- Regional variations (Tokyo, Frankfurt, etc.)
- Large disk configurations
- Immediate cost display validation
- State persistence after calculation

### Comparison Scenarios (7 tests)
- Machine type cost comparison (n1-standard-1 vs n1-standard-2 vs n1-standard-4)
- Regional cost differences (US, Europe, Asia)
- Operating system pricing (Free vs Ubuntu Pro vs Windows Server)
- Disk size impact on cost (100GB vs 500GB vs 1TB)
- Instance count proportionality
- Dynamic cost updates
- Cost relationship consistency

### Negative Scenarios (10 tests)
- Zero instance handling
- Negative instance prevention
- Special character validation
- Alphabetic character rejection
- Negative disk size handling
- Extremely large values (instances, disk)
- Mixed valid/invalid inputs
- Required field validation
- Rapid consecutive changes
- Input field restrictions

### Edge Cases (15 tests)
- Minimum viable configuration
- Maximum instance counts (1000+)
- Maximum disk sizes (10TB+)
- Page reload behavior
- Browser navigation handling
- Session state maintenance
- High volume configurations (100 instances)
- Single instance edge case
- Minimum disk size (10GB)
- Configuration changes without reload
- Boundary value testing
- Repeated configuration actions
- Long session duration
- Multiple rapid changes

## Test Data

Test configurations are centralized in `src/testData/calculator-configs.ts`:
- Machine types (n1-standard-1, n1-standard-2, e2-medium, etc.)
- Operating systems (Free, Ubuntu Pro, Windows Server, RHEL)
- Regions (US, Europe, Asia Pacific)
- Predefined test configurations
- Invalid configurations for negative testing
- Comparison scenarios
- Edge case data

## Page Object Model

Tests use the Page Object Model pattern with `CalculatorPage` class:

**Key Methods:**
- `configurComputeEngine(config)` - Complete configuration in one call
- `selectMachineType(type)` - Select machine type
- `setInstanceCount(count)` - Set number of instances
- `selectOperatingSystem(os)` - Choose operating system
- `setDiskSize(gb)` - Configure disk size
- `selectRegion(region)` - Pick region
- `getCostValue()` - Get cost as number
- `verifyCostIsDisplayed()` - Verify cost shows
- `verifyCostRange(min, max)` - Validate cost range

## Expected Results

All tests should:
- ✓ Execute without errors
- ✓ Validate cost calculations
- ✓ Handle edge cases gracefully
- ✓ Verify UI responsiveness
- ✓ Check input validation
- ✓ Confirm cost updates dynamically

## Test Stability

Tests include:
- Proper wait mechanisms
- Retry logic via Playwright config
- Error handling for edge cases
- Timeout configurations
- Cookie consent handling

## Reporting

Test results are available in multiple formats:
- HTML report: `playwright-report/index.html`
- Console output: Real-time during execution
- JUnit XML: `test-results/junit.xml`
- Report Portal: Configured via environment variables

View HTML report:
```bash
npm run report
```

## Environment Configuration

Required environment variables (`.env` file):
```
LOCALE=en
RP_ENDPOINT=https://reportportal.epam.com/api/v1
RP_API_KEY=your_api_key
RP_PROJECT=your_project
RP_LAUNCH=Playwright E2E Tests
```

## Best Practices

1. **Run smoke tests first** - Verify basic functionality
2. **Run e2e tests on stable environment** - Ensure GCP Calculator is accessible
3. **Check test data** - Costs may vary, tests use ranges
4. **Review failures** - Check screenshots and traces in test-results
5. **Update locators** - If GCP UI changes, update Page Objects

## Known Limitations

1. **Dynamic Pricing** - GCP prices may change, tests use cost ranges
2. **UI Changes** - Google may update calculator UI
3. **Network Dependency** - Tests require stable internet
4. **Regional Variations** - Some features may vary by region

## Maintenance

When GCP calculator changes:
1. Update locators in `src/pageObject/calculator_page.ts`
2. Update test data in `src/testData/calculator-configs.ts`
3. Update cost expectations if pricing changes
4. Re-run all tests to verify changes

## Contributing

When adding new tests:
1. Follow existing naming conventions
2. Use Page Object Model pattern
3. Add test data to `calculator-configs.ts`
4. Document test purpose and coverage
5. Ensure proper assertions
6. Update this README

---

For complete test plan and manual test cases, see: `TEST_PLAN.md` in project root
