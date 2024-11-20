# StoreIt

[![E2E Tests](https://github.com/[your-username]/storeit/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/[your-username]/storeit/actions/workflows/e2e-tests.yml)

A modern file storage application built with Next.js.

## Testing

This project includes comprehensive testing:

### Unit & Integration Tests
Run unit and integration tests:
```bash
bun test
```

### End-to-End Tests
Run e2e tests with Playwright:
```bash
# Run all e2e tests
bun run test:e2e

# Run with UI mode (great for debugging)
bun run test:e2e:ui

# Run in debug mode
bun run test:e2e:debug
```

### Continuous Integration
- E2E tests run automatically on push to main and pull requests
- Test reports are available in GitHub Actions artifacts
- Coverage reports are generated and uploaded to artifacts

StoreIt is a simple and secure way to store your files on the cloud.
