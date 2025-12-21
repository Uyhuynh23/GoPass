# VnSmartBot & VnSocial Route Tests - Quick Start Guide

## ✅ What Has Been Created

I've created comprehensive test suites for all VnSmartBot and VnSocial API routes.

### Test Files

1. **`src/routes/__tests__/vnsmartbot.routes.test.js`**

   - 13 test cases covering all 5 VnSmartBot endpoints
   - Tests authentication, validation, streaming, and error handling

2. **`src/routes/__tests__/vnsocial.routes.test.js`**

   - 25 test cases covering all 8 VnSocial endpoints
   - Tests authentication, validation, search functionality, and error handling

3. **`src/routes/__tests__/README.md`**

   - Detailed documentation of test structure and patterns

4. **`vitest.config.js`**

   - Vitest configuration with coverage settings

5. **Supporting Files**
   - `TESTING_SUMMARY.md` - Overview and results
   - `run-tests.ps1` - PowerShell test runner

## 🚀 Quick Start - How to Run

### Method 1: Using the PowerShell Script (Recommended)

```powershell
cd c:\LEARNING\GoPass\backend
.\run-tests.ps1
```

### Method 2: Using npm scripts

```bash
# Run tests once
npm test -- --run

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run with interactive UI
npm run test:ui
```

### Method 3: Direct vitest command

```bash
# Run all tests
npx vitest run

# Run specific test file only
npx vitest run src/routes/__tests__/vnsmartbot.routes.test.js
npx vitest run src/routes/__tests__/vnsocial.routes.test.js

# Run with coverage
npx vitest run --coverage

# Clear cache if needed
npx vitest run --no-cache
```

## 📊 Test Coverage

### VnSmartBot Routes - 5 Endpoints, 13 Tests

| Method | Endpoint                                    | Test Cases                        |
| ------ | ------------------------------------------- | --------------------------------- |
| GET    | `/api/smartbot/health`                      | Health check (no auth required)   |
| POST   | `/api/smartbot/conversation/stream`         | Streaming, Auth required          |
| POST   | `/api/smartbot/conversation`                | Success, Validation, Auth         |
| POST   | `/api/smartbot/conversation-with-variables` | Variables support, Auth           |
| POST   | `/api/smartbot/button-action`               | Button handling, Validation, Auth |

### VnSocial Routes - 8 Endpoints, 25 Tests

| Method | Endpoint                                | Test Cases                         |
| ------ | --------------------------------------- | ---------------------------------- |
| GET    | `/api/vnsocial/topics`                  | Success, Type filtering, Auth      |
| POST   | `/api/vnsocial/topics/sync`             | Sync operation, Auth               |
| POST   | `/api/vnsocial/posts/search-by-keyword` | Search, Validation, Auth           |
| POST   | `/api/vnsocial/posts/search-by-source`  | Search by source, Validation, Auth |
| POST   | `/api/vnsocial/keywords/hot`            | Hot keywords, Validation, Auth     |
| POST   | `/api/vnsocial/posts/hot`               | Trending posts, Auth               |
| POST   | `/api/vnsocial/statistics`              | Statistics, Auth                   |
| POST   | `/api/vnsocial/social-debates`          | Debates (student accessible), Auth |

## 📦 Dependencies Installed

All necessary testing dependencies have been added to `package.json`:

```json
{
  "devDependencies": {
    "vitest": "^1.0.4", // Fast test framework
    "@vitest/ui": "^1.0.4", // Interactive UI
    "@vitest/coverage-v8": "^1.0.4", // Coverage reporting
    "supertest": "^6.3.3" // HTTP testing
  }
}
```

Run `npm install` if dependencies are not yet installed.

## 🎯 What Each Test Does

### Authentication Tests

- ✅ Verifies protected endpoints require authentication
- ✅ Tests 401 Unauthorized responses for missing auth
- ✅ Confirms authenticated requests succeed

### Validation Tests

- ✅ Checks required fields are enforced
- ✅ Tests 400 Bad Request for invalid input
- ✅ Verifies error messages are descriptive

### Success Tests

- ✅ Tests happy path scenarios
- ✅ Validates response structure
- ✅ Confirms controller methods are called
- ✅ Checks response status codes (200, 201, etc.)

### Error Handling Tests

- ✅ Tests server error responses (500)
- ✅ Validates error message format

## 🔍 Example Test Output

```
✓ src/routes/__tests__/vnsmartbot.routes.test.js (13)
  ✓ VnSmartBot Routes (13)
    ✓ GET /api/smartbot/health (1)
      ✓ should check health without authentication
    ✓ POST /api/smartbot/conversation/stream (2)
      ✓ should stream conversation with authentication
      ✓ should require authentication
    ✓ POST /api/smartbot/conversation (3)
      ✓ should send conversation message successfully
      ✓ should validate required fields
      ✓ should require authentication
    ...

✓ src/routes/__tests__/vnsocial.routes.test.js (25)
  ✓ VnSocial Routes (25)
    ✓ GET /api/vnsocial/topics (3)
    ✓ POST /api/vnsocial/topics/sync (2)
    ✓ POST /api/vnsocial/posts/search-by-keyword (3)
    ...

Test Files  2 passed (2)
     Tests  38 passed (38)
  Start at  15:52:00
  Duration  1.23s
```

## 🐛 Troubleshooting

### Issue: "0 tests" or tests not found

**Solution**: Clear the vitest cache

```bash
npx vitest run --no-cache --clearCache
```

### Issue: Tests timeout

**Solution**: Increase timeout in `vitest.config.js`

```javascript
testTimeout: 20000, // Increase from 10000 to 20000
```

### Issue: Module not found errors

**Solution**: Install dependencies

```bash
npm install
```

### Issue: Tests keep running in watch mode

**Solution**: Use `--run` flag or press 'q' to quit

```bash
npm test -- --run
```

## 📝 Test File Structure

Each test file follows this pattern:

```javascript
describe("Route Group", () => {
  beforeEach(() => {
    // Setup mocks and express app
  });

  afterEach(() => {
    // Cleanup mocks
  });

  describe("Specific Endpoint", () => {
    it("should handle success case", async () => {
      // Test implementation
    });

    it("should validate required fields", async () => {
      // Test validation
    });

    it("should require authentication", async () => {
      // Test auth
    });
  });
});
```

## 💡 Tips

1. **Run specific tests**: Add `.only` to focus on one test

   ```javascript
   it.only('should test this one thing', async () => { ... });
   ```

2. **Skip tests**: Use `.skip` to temporarily disable tests

   ```javascript
   it.skip('should test this later', async () => { ... });
   ```

3. **Debug tests**: Add `console.log()` statements in tests

   ```javascript
   console.log("Response:", response.body);
   ```

4. **View coverage**: Open `coverage/index.html` after running coverage

5. **Interactive UI**: Run `npm run test:ui` and open browser at http://localhost:51204/**vitest**/

## 🎓 Learning Resources

- **Vitest Docs**: https://vitest.dev/
- **Supertest Docs**: https://github.com/visionmedia/supertest
- **Test README**: [src/routes/**tests**/README.md](src/routes/__tests__/README.md)

## ✨ Next Steps

1. **Run the tests**: `.\run-tests.ps1` or `npm test -- --run`
2. **Check coverage**: `npm run test:coverage`
3. **Add more tests**: Follow the patterns for other routes
4. **Integrate CI/CD**: Add to GitHub Actions or other CI pipeline

---

**Total Tests Created**: 38 tests across 2 test suites
**Endpoints Covered**: 13 endpoints (5 VnSmartBot + 8 VnSocial)
**Test Types**: Authentication, Validation, Success paths, Error handling
