# Chemveric Automation (Playwright + TypeScript)

UI + API + basic E2E flows for https://chemveric.dev.gdev.group

## Quick Start

```bash
npm ci
npm run prepare
cp .env.example .env  # and edit credentials
npm test              # run all tests
```

### Run specific suites
- `npm run test:ui`
- `npm run test:api`
- `npm run test:e2e`

## Project layout
- `src/config` — env + test data
- `src/pages` — Page Objects
- `src/api` — lightweight API clients
- `tests/ui` — UI tests
- `tests/api` — API tests
- `tests/integration` — E2E flows

## Git: Create repo and push
```bash
git init
git add .
git commit -m "chemveric: initial test framework (ui+api+e2e)"
gh repo create chemveric-automation --private --source=. --remote=origin --push  # or create manually
# fallback without GitHub CLI:
# 1) create empty repo on github.com
# 2) git remote add origin <repo-url>
# 3) git push -u origin main
```
