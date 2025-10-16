# Chemveric Automation v2 (Chromium + Allure)

Production-grade Playwright framework with Auth0 UI login, Admin invitation flow (ADA-US-001), BasePage/BaseAPI, Allure, and CI.

## Quick start
```bash
npm install
npm run prepare
cp .env.example .env   # fill with real values
npm run test:ui        # UI ADA-US-001
npm run test:api       # API smoke
npm run test:e2e       # E2E invitation flow
```

## Allure report
```bash
npm run allure:generate
npm run allure:open
```

## Environment (.env)
CHEMVERIC_UI_URL, CHEMVERIC_API_URL, CHEMVERIC_ADMIN_EMAIL, CHEMVERIC_ADMIN_PASSWORD, INVITE_BUYER_EMAIL, INVITE_VENDOR_EMAIL

## CI (GitHub Actions)
Add repository secrets with the same names as .env. Workflow uploads Playwright & Allure reports as artifacts.
