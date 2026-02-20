# Test Plan: GCP Pricing Calculator - Cost Estimation

## Overview
This document outlines the comprehensive test strategy for the "Estimate Monthly Cost of Specific GCP Service" user story. It includes manual test cases, automated test scenarios, and test coverage analysis.

## Scope
- **Application Under Test**: Google Cloud Pricing Calculator
- **Primary Focus**: Compute Engine cost estimation
- **URL**: https://cloud.google.com/products/calculator
- **Test Types**: E2E, UI, Integration

---

## Manual Test Cases

### TC-001: Basic Compute Engine Cost Estimation
**Priority**: High
**Type**: Positive

**Preconditions**:
- Browser is open
- Internet connection is available

**Steps**:
1. Navigate to https://cloud.google.com/products/calculator
2. Dismiss cookie consent if displayed
3. Click "Add to estimate" button
4. Select "Compute Engine" from the service list
5. Configure the following:
   - Machine type: n1-standard-1
   - Number of instances: 2
   - Operating system: Ubuntu Pro
   - Disk size: 100GB SSD
   - Region: Frankfurt (europe-west3)
6. Observe the cost calculation

**Expected Results**:
- Calculator displays estimated monthly cost
- Cost is displayed in format: $XXX.XX
- Cost updates automatically when configuration changes
- All selected options are reflected in the estimate summary

**Test Data**:
- Machine Type: n1-standard-1
- Instances: 2
- OS: Ubuntu Pro
- Disk: 100GB
- Region: europe-west3

---

### TC-002: Compare Different Machine Types
**Priority**: High
**Type**: Positive

**Preconditions**:
- Calculator is loaded with initial configuration (TC-001)

**Steps**:
1. Complete TC-001 steps 1-6
2. Note the displayed cost for n1-standard-1
3. Change machine type to n1-standard-2
4. Wait for cost recalculation
5. Compare costs between configurations

**Expected Results**:
- Cost for n1-standard-2 is higher than n1-standard-1
- Cost updates without page reload
- Configuration change is reflected immediately
- No error messages appear

---

### TC-003: Multiple Regions Comparison
**Priority**: Medium
**Type**: Positive

**Preconditions**:
- Calculator is loaded

**Steps**:
1. Configure Compute Engine with:
   - Machine type: n1-standard-1
   - Instances: 1
   - Region: Frankfurt (europe-west3)
2. Note the cost
3. Change region to Iowa (us-central1)
4. Note the new cost
5. Change region to Tokyo (asia-northeast1)
6. Note the new cost

**Expected Results**:
- Costs vary by region
- All regions are selectable
- Cost updates for each region change
- No errors occur during region changes

---

### TC-004: Minimum Configuration
**Priority**: Medium
**Type**: Edge Case

**Preconditions**:
- Calculator is loaded

**Steps**:
1. Configure Compute Engine with minimum values:
   - Machine type: Smallest available
   - Instances: 1
   - Disk: Minimum size
   - Free tier OS if available
2. Verify cost calculation

**Expected Results**:
- Calculator accepts minimum configuration
- Valid cost is displayed (may be $0.00 for free tier)
- No validation errors appear

---

### TC-005: Maximum Instances
**Priority**: Medium
**Type**: Edge Case

**Preconditions**:
- Calculator is loaded

**Steps**:
1. Configure Compute Engine
2. Set instances to maximum allowed value (e.g., 1000)
3. Observe cost calculation

**Expected Results**:
- Calculator accepts high instance count
- Cost scales appropriately
- Performance remains acceptable
- No errors or crashes

---

### TC-006: Invalid Instance Count - Zero
**Priority**: High
**Type**: Negative

**Preconditions**:
- Calculator is loaded with Compute Engine selected

**Steps**:
1. Set instance count to 0
2. Attempt to calculate cost

**Expected Results**:
- Validation error appears or
- Field doesn't accept 0 or
- Calculator displays appropriate message

---

### TC-007: Invalid Instance Count - Negative
**Priority**: High
**Type**: Negative

**Preconditions**:
- Calculator is loaded with Compute Engine selected

**Steps**:
1. Attempt to enter negative value (-5) in instances field
2. Observe system behavior

**Expected Results**:
- System prevents negative input or
- Validation error message appears
- Cost calculation doesn't proceed with invalid data

---

### TC-008: Special Characters in Instance Field
**Priority**: Medium
**Type**: Negative

**Preconditions**:
- Calculator is loaded with Compute Engine selected

**Steps**:
1. Attempt to enter special characters (!@#$%) in instances field
2. Attempt to enter letters (abc) in instances field
3. Observe system behavior

**Expected Results**:
- System prevents non-numeric input or
- Validation error appears
- Field only accepts valid numeric values

---

### TC-009: Empty Required Fields
**Priority**: High
**Type**: Negative

**Preconditions**:
- Calculator is loaded

**Steps**:
1. Select Compute Engine
2. Leave instance count empty
3. Leave other required fields empty
4. Attempt to view cost estimate

**Expected Results**:
- System requires all mandatory fields or
- Provides default values
- Clear validation messages if fields are required

---

### TC-010: Page Reload Persistence
**Priority**: Medium
**Type**: Functional

**Preconditions**:
- Calculator is configured with specific values

**Steps**:
1. Configure Compute Engine with custom settings
2. Note the configuration and cost
3. Reload the page (F5)
4. Check if configuration persists

**Expected Results**:
- Configuration behavior matches application design
- No unexpected errors
- User experience is consistent

---

### TC-011: Browser Back Button
**Priority**: Medium
**Type**: Functional

**Preconditions**:
- Calculator is configured

**Steps**:
1. Configure Compute Engine
2. Navigate to another page
3. Click browser back button
4. Observe calculator state

**Expected Results**:
- Application handles navigation gracefully
- No broken states
- Consistent user experience

---

### TC-012: Multiple Service Estimates
**Priority**: Low
**Type**: Positive

**Preconditions**:
- Calculator is loaded

**Steps**:
1. Add Compute Engine estimate
2. Add another service estimate (e.g., Cloud Storage)
3. Verify both estimates appear
4. Check total cost calculation

**Expected Results**:
- Multiple services can be added
- Individual costs are displayed
- Total cost is sum of all services
- Each service can be configured independently

---

### TC-013: Different Operating Systems Cost Comparison
**Priority**: Medium
**Type**: Positive

**Preconditions**:
- Calculator is loaded

**Steps**:
1. Configure Compute Engine with Ubuntu Pro
2. Note the cost
3. Change OS to Windows Server
4. Note the cost
5. Change OS to Red Hat Enterprise Linux
6. Note the cost

**Expected Results**:
- Costs vary by operating system
- Premium OS (like Windows) cost more than free OS
- Cost updates immediately upon OS change
- All OS options are selectable

---

### TC-014: Disk Size Variations
**Priority**: Medium
**Type**: Positive

**Preconditions**:
- Calculator is loaded

**Steps**:
1. Configure Compute Engine
2. Set disk size to 100GB
3. Note the cost
4. Change disk size to 500GB
5. Note the cost
6. Change disk size to 1TB
7. Note the cost

**Expected Results**:
- Cost increases with disk size
- All disk sizes are configurable
- Cost calculation reflects storage pricing
- No errors during disk size changes

---

### TC-015: Responsive Design - Mobile View
**Priority**: Low
**Type**: UI/UX

**Preconditions**:
- Calculator URL is accessible

**Steps**:
1. Open calculator in browser
2. Resize browser to mobile dimensions (375x667)
3. Attempt to configure Compute Engine
4. Verify cost calculation

**Expected Results**:
- UI remains functional on mobile view
- All controls are accessible
- Cost is visible
- User can complete configuration

---

### TC-016: Responsive Design - Tablet View
**Priority**: Low
**Type**: UI/UX

**Preconditions**:
- Calculator URL is accessible

**Steps**:
1. Open calculator in browser
2. Resize browser to tablet dimensions (768x1024)
3. Configure Compute Engine
4. Verify all functionality

**Expected Results**:
- UI adapts to tablet viewport
- All features remain accessible
- Cost calculation works correctly
- Layout is appropriate for screen size

---

## Test Coverage Matrix

| Test Scenario | Positive | Negative | Edge Case | Priority |
|--------------|----------|----------|-----------|----------|
| Basic cost estimation | ✓ | | | High |
| Machine type comparison | ✓ | | | High |
| Region comparison | ✓ | | | Medium |
| Minimum configuration | | | ✓ | Medium |
| Maximum instances | | | ✓ | Medium |
| Zero instances | | ✓ | | High |
| Negative instances | | ✓ | | High |
| Special characters input | | ✓ | | Medium |
| Empty required fields | | ✓ | | High |
| Page reload | ✓ | | | Medium |
| Browser navigation | ✓ | | | Medium |
| Multiple services | ✓ | | | Low |
| OS comparison | ✓ | | | Medium |
| Disk size variations | ✓ | | | Medium |
| Mobile responsive | ✓ | | | Low |
| Tablet responsive | ✓ | | | Low |

---

## Automated Test Scenarios

The following scenarios are implemented as automated tests:

### E2E Test Suite Structure
```
src/tests/e2e/
├── cost-estimation-positive.spec.ts    # Positive scenarios (TC-001, TC-002, TC-003)
├── cost-estimation-comparison.spec.ts  # Configuration comparisons (TC-013, TC-014)
├── cost-estimation-negative.spec.ts    # Negative scenarios (TC-006, TC-007, TC-008)
├── cost-estimation-edge-cases.spec.ts  # Edge cases (TC-004, TC-005)
└── cost-estimation-ui.spec.ts          # UI/Responsive tests (TC-015, TC-016)
```

### Automation Priority
1. **High Priority** (Must automate): TC-001, TC-002, TC-006, TC-007, TC-009
2. **Medium Priority** (Should automate): TC-003, TC-004, TC-005, TC-008, TC-013, TC-014
3. **Low Priority** (Can be manual): TC-010, TC-011, TC-012, TC-015, TC-016

---

## Test Data

### Machine Types
- n1-standard-1 (1 vCPU, 3.75 GB memory)
- n1-standard-2 (2 vCPU, 7.5 GB memory)
- n1-standard-4 (4 vCPU, 15 GB memory)
- e2-medium (2 vCPU, 4 GB memory)

### Regions
- us-central1 (Iowa)
- us-east1 (South Carolina)
- europe-west3 (Frankfurt)
- asia-northeast1 (Tokyo)

### Operating Systems
- Ubuntu Pro
- Windows Server
- Red Hat Enterprise Linux
- Free (Debian, Ubuntu, CentOS)

### Disk Sizes
- 10 GB (minimum)
- 100 GB
- 500 GB
- 1000 GB (1 TB)

---

## Entry Criteria
- Test environment is accessible
- Required browser versions are installed
- Test data is prepared
- Page Object Model is implemented
- Playwright is configured

## Exit Criteria
- All high-priority test cases executed
- 90%+ test pass rate achieved
- All critical defects resolved
- Test report generated
- Code review completed

## Test Environment
- **Browsers**: Chromium (primary), Firefox, Safari
- **Viewport**: 1280x720 (default), responsive testing for mobile/tablet
- **Network**: Stable internet connection
- **Framework**: Playwright with TypeScript
- **CI/CD**: Compatible with pipeline integration

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dynamic pricing changes | Test data becomes outdated | Use relative assertions (greater than, not equal to) |
| UI changes by Google | Tests break | Use semantic locators, Page Object pattern |
| Network instability | Flaky tests | Implement retry logic, proper waits |
| Popup/modal variations | Test failures | Handle multiple scenarios with try-catch |
| Regional content differences | Localization issues | Parameterize locale-specific content |

---

## Manual Testing Checklist

### Pre-Execution Checklist
- [ ] Test environment URL is accessible
- [ ] Test data is prepared and documented
- [ ] Expected results are clearly defined
- [ ] Browser is updated to latest version
- [ ] Clear browser cache and cookies

### During Execution Checklist
- [ ] Follow test steps exactly as written
- [ ] Document any deviations or observations
- [ ] Capture screenshots for failures
- [ ] Note actual vs expected results
- [ ] Record execution time
- [ ] Log any defects found

### Post-Execution Checklist
- [ ] All test cases executed
- [ ] Results documented in test management tool
- [ ] Defects logged with reproduction steps
- [ ] Test summary report created
- [ ] Stakeholders notified of results
- [ ] Lessons learned documented

---

## Approval

This test plan should be reviewed and approved by:
- [ ] QA Lead
- [ ] Development Team Lead
- [ ] Project Manager
- [ ] Mentor/Technical Reviewer

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-16 | QA Team | Initial test plan creation |
