# CalorEase Testing Implementation Plan

## Overview

This document outlines the comprehensive testing strategy for the CalorEase frontend application, covering unit tests, integration tests, and end-to-end testing to ensure robust functionality and user experience.

## Current Testing Infrastructure

- ✅ **Jest** configured with Next.js integration
- ✅ **React Testing Library** for component testing
- ✅ **jsdom** environment for DOM testing
- ✅ **SVG mocking** configured
- ✅ **Path aliases** configured for imports

## Testing Dependencies

### Additional Dependencies Required

```bash
# Core testing utilities
pnpm add -D @testing-library/user-event msw axios-mock-adapter

# E2E testing (choose one)
pnpm add -D @playwright/test  # OR cypress

# Additional testing utilities
pnpm add -D jest-environment-jsdom @types/jest
```

## Test Architecture & Organization

### Directory Structure

```
src/
├── __tests__/
│   ├── __mocks__/
│   │   ├── api.ts
│   │   ├── localStorage.ts
│   │   └── nextRouter.ts
│   ├── fixtures/
│   │   ├── testData.ts
│   │   └── mockResponses.ts
│   ├── utils/
│   │   ├── testHelpers.ts
│   │   └── renderWithProviders.tsx
│   ├── lib/
│   │   ├── searchHistory.test.ts
│   │   ├── mealPlan.test.ts
│   │   ├── auth.test.ts
│   │   └── api.test.ts
│   ├── components/
│   │   ├── auth/
│   │   ├── calorie/
│   │   ├── mealPlan/
│   │   ├── ui/
│   │   └── layout/
│   ├── pages/
│   │   ├── dashboard.test.tsx
│   │   ├── calories.test.tsx
│   │   ├── history.test.tsx
│   │   └── mealPlans.test.tsx
│   └── integration/
│       ├── authFlow.test.tsx
│       ├── calorieTracking.test.tsx
│       └── mealPlanning.test.tsx
├── e2e/
│   ├── auth.spec.ts
│   ├── calorieTracking.spec.ts
│   └── mealPlanning.spec.ts
```

## Testing Priorities & Coverage

### Tier 1: Critical Business Logic (Must Test)

#### Service Layer Tests
- **SearchHistoryService**
  - Add search to history
  - Prevent duplicate searches
  - Paginate history correctly
  - Calculate statistics accurately
  - Handle localStorage errors gracefully

- **MealPlanService**
  - Create meal plan with correct structure
  - Add items to specific meals
  - Calculate total calories correctly
  - Handle serving overrides
  - Set active meal plan

- **AuthUtils**
  - Validate JWT tokens correctly
  - Handle expired tokens
  - Store/retrieve tokens from cookies

#### API Integration Tests
- **API Client**
  - Add auth headers to requests
  - Handle 401 responses correctly
  - Format API errors properly
  - Mock all backend endpoints

### Tier 2: User Interface Components (Should Test)

#### Form Component Tests
- **LoginForm**
  - Render login form fields
  - Validate email format
  - Show loading state during submission
  - Call login function with form data
  - Redirect to dashboard on success

- **CalorieSearchForm**
  - Validate dish name requirements
  - Validate serving size limits
  - Call API with correct data
  - Add successful searches to history
  - Handle API errors gracefully

#### UI Component Tests
- **Pagination**
  - Render correct page numbers
  - Handle first/last page states
  - Show ellipsis for large page counts
  - Call onPageChange with correct page

- **MealPlanCard**
  - Display meal plan information
  - Show active badge for active plans
  - Calculate meal calories correctly
  - Handle delete confirmation

### Tier 3: User Experience Features (Nice to Test)

- Pagination functionality
- Search and filtering
- Statistics calculation and display
- Export/Import features
- Loading states and transitions

## Mock Strategy

### API Mocking with MSW

```typescript
// Mock all backend API endpoints
- POST /auth/login
- POST /auth/register  
- POST /get-calories

// Mock different response scenarios
- Success responses
- Validation errors (400)
- Authentication errors (401)
- Not found errors (404)
- Server errors (500)
```

### Browser API Mocking

```typescript
// Mock browser APIs
- localStorage (with quota limits)
- sessionStorage
- navigator.clipboard
- window.location
- File download APIs
```

### Next.js Mocking

```typescript
// Mock Next.js features
- useRouter hook
- usePathname hook
- useSearchParams hook
- Image component
- Link component
```

## Test Data Management

### Test Fixtures

```typescript
// Create realistic test data
- Sample calorie search responses
- Mock meal plans with various configurations
- User authentication tokens
- Search history with different patterns
- Error response scenarios
```

### Data Factory Functions

```typescript
// Flexible test data creation
export const createMockSearchHistoryItem = (overrides = {}) => ({
  id: 'test-id',
  dish_name: 'Test Dish',
  servings: 1,
  calories_per_serving: 250,
  total_calories: 250,
  source: 'Test Source',
  timestamp: Date.now(),
  searchQuery: 'test dish',
  ...overrides,
});

export const createMockMealPlan = (overrides = {}) => ({
  id: 'test-plan-id',
  name: 'Test Meal Plan',
  description: 'Test Description',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  meals: { breakfast: [], lunch: [], dinner: [] },
  totalCalories: 0,
  isActive: false,
  ...overrides,
});
```

## Testing Utilities

### Custom Render Helper

```typescript
// renderWithProviders.tsx
// Wrap components with all necessary providers
- AuthProvider with mock auth state
- LoadingProvider for route loading
- Toast provider for notifications
```

### Test Helpers

```typescript
// Common testing utilities
- waitForApiCall()
- fillForm()
- expectToastMessage()
- expectRouteNavigation()
- mockLocalStorage()
```

## Integration Tests

### Authentication Flow Tests

```typescript
describe('Authentication Flow', () => {
  test('should complete registration flow')
  test('should complete login flow')
  test('should redirect unauthenticated users')
  test('should persist auth state across page refreshes')
  test('should handle token expiration')
})
```

### Calorie Tracking Flow Tests

```typescript
describe('Calorie Tracking Flow', () => {
  test('should search for calories and display results')
  test('should add successful searches to history')
  test('should handle API errors appropriately')
  test('should allow adding items to meal plans')
})
```

### Meal Planning Flow Tests

```typescript
describe('Meal Planning Flow', () => {
  test('should create new meal plan')
  test('should add items from history to meal plan')
  test('should calculate total calories correctly')
  test('should handle meal plan CRUD operations')
})
```

## E2E Testing

### Critical User Journeys

```typescript
// e2e/auth.spec.ts
describe('Authentication E2E', () => {
  test('should register new user and see dashboard')
  test('should login existing user')
  test('should logout and redirect to home')
})

// e2e/calorieTracking.spec.ts
describe('Calorie Tracking E2E', () => {
  test('should search for calories and see results')
  test('should view search history')
  test('should create meal plan from history')
})
```

## Test Coverage Goals

### Coverage Targets

- **Services**: 90%+ (critical business logic)
- **Components**: 80%+ (UI components)
- **Pages**: 70%+ (integration points)
- **Utils**: 95%+ (pure functions)

### Coverage Exclusions

- Type definitions (`src/lib/types.ts`)
- Configuration files
- Mock files and test utilities
- Next.js generated files

## Critical Test Cases

### Business Logic Tests

```typescript
describe('Calorie Calculation', () => {
  test('should calculate total calories with serving overrides')
  test('should handle decimal servings correctly')
  test('should update totals when items are modified')
})

describe('Meal Plan Management', () => {
  test('should prevent duplicate active meal plans')
  test('should maintain data consistency during CRUD operations')
  test('should handle localStorage quota exceeded')
})

describe('Search History', () => {
  test('should deduplicate similar searches')
  test('should maintain chronological order')
  test('should handle large datasets efficiently')
})
```

### User Experience Tests

```typescript
describe('Loading States', () => {
  test('should show loading during API calls')
  test('should show route loading during navigation')
  test('should disable buttons during async operations')
})

describe('Error Handling', () => {
  test('should display user-friendly error messages')
  test('should handle network failures gracefully')
  test('should recover from localStorage errors')
})
```

## Edge Cases to Test

- **Network Failures**: Offline scenarios, timeout handling
- **Data Corruption**: Invalid localStorage data recovery
- **Browser Compatibility**: Different storage implementations
- **Large Datasets**: Performance with 1000+ history items
- **Concurrent Operations**: Multiple tabs, race conditions
- **Token Expiration**: Mid-session authentication failures

## Test Scripts Configuration

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --watchAll=false",
    "test:unit": "jest --testPathPattern=__tests__/lib",
    "test:components": "jest --testPathPattern=__tests__/components",
    "test:integration": "jest --testPathPattern=__tests__/integration",
    "test:pages": "jest --testPathPattern=__tests__/pages",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:all": "pnpm test && pnpm test:e2e",
    "test:ci": "jest --coverage --watchAll=false --passWithNoTests"
  }
}
```

## CI/CD Integration

### GitHub Actions Updates

```yaml
# Add to existing .github/workflows/lint.yml
- name: 🧪 Run unit tests
  run: pnpm test:unit

- name: 🎭 Run component tests
  run: pnpm test:components

- name: 🔗 Run integration tests
  run: pnpm test:integration

- name: 📊 Generate coverage report
  run: pnpm test:coverage

- name: 📈 Upload coverage to Codecov
  uses: codecov/codecov-action@v3

- name: 🎬 Run E2E tests
  run: pnpm test:e2e
```

## Implementation Steps

### 1. Foundation Setup
- Install testing dependencies
- Configure test environment and mocking
- Create test utilities and helpers
- Set up coverage reporting

### 2. Service Layer Testing
- Test all business logic functions
- Mock external dependencies (localStorage, API)
- Cover edge cases and error scenarios
- Validate data transformations and calculations

### 3. Component Testing
- Test rendering with various props and states
- Test user interactions and form submissions
- Test state changes and side effects
- Test error states and loading indicators

### 4. Integration Testing
- Test component compositions and workflows
- Test data flow between services and UI
- Test API integration points and error handling
- Test navigation, routing, and route protection

### 5. E2E Testing
- Set up Playwright or Cypress
- Create critical user journey tests
- Test cross-browser compatibility
- Add performance and accessibility tests

### 6. Automation & Monitoring
- Configure CI/CD pipeline integration
- Set up coverage reporting and gates
- Implement pre-commit test hooks
- Monitor test performance and reliability

## Quality Assurance

### Automated Checks
- **Pre-commit Hooks**: Run relevant tests before commits
- **PR Checks**: Full test suite on pull requests
- **Coverage Gates**: Fail builds below coverage thresholds
- **Performance Monitoring**: Track test execution time

### Test Maintenance
- **Regular Review**: Update tests when features change
- **Flaky Test Monitoring**: Identify and fix unreliable tests
- **Performance Optimization**: Keep test suite under 2 minutes
- **Documentation**: Maintain testing guidelines and examples

## Success Metrics

- **Coverage**: Maintain minimum coverage targets
- **Reliability**: < 1% flaky test rate
- **Performance**: Test suite completes in < 2 minutes
- **Maintenance**: Tests updated within 1 day of feature changes
- **Bug Prevention**: 90%+ of bugs caught by tests before production

---

This testing plan ensures the CalorEase application maintains high quality, reliability, and user experience through comprehensive automated testing coverage.
