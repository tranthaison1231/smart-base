# Quality Checks

## Available Commands

```bash
pnpm lint       # ESLint, including FSD import boundaries
pnpm typecheck  # Strict TypeScript check, no emit
pnpm test       # Vitest unit/component tests
pnpm test:e2e   # Playwright browser smoke test on Chromium
pnpm build      # Next.js production build
pnpm db:generate # Generate Drizzle SQL from local schema files; no database required
pnpm db:migrate  # Apply generated SQL to DATABASE_URL
```

To run one test file during development:

```bash
pnpm --filter @smart-base/web exec vitest run src/_shared/api/fetch-json.test.ts
```

Unit tests use Vitest, Testing Library, and jsdom. The database package uses Vitest in Node. Inject `fetchImpl`/an AI model when needed; tests do not depend on the network, secrets, a live database, or a real provider. Test UI behavior and semantics/accessibility rather than implementation details.

Playwright starts the Next dev server on port `3100` and checks route `/`. If Chromium is not installed on the machine, install it once:

```bash
pnpm --filter @smart-base/web exec playwright install chromium
```

## When Adding Code

- For behavior changes: add a regression test first, confirm it fails, then implement the change and run the test again.
- For components: check the primary interactions, keyboard/accessibility behavior, and empty or error states when the component owns them.
- At data boundaries: test valid and invalid responses; errors must not expose sensitive response data.
- For database changes: test schema/repository behavior without a live database, generate and review the migration, and apply it only to an explicitly selected environment.
- Before completing a feature: run lint, typecheck, unit tests, and the production build.

The browser smoke test covers only the default app shell. Add browser scenarios for new features when they have important interactions.

