# Implementation Workflow

- Start with [project-state.md](project-state.md), the repository guidance in `AGENTS.md`, and the relevant module tests.
- Choose layers according to `docs/architecture.md`; keep routes thin and respect FSD boundaries.
- Preserve FSD dependency direction: higher layers may import lower layers only. Slices on the same layer cannot import one another; imports into another slice must use its public entry point (`index.ts`, `index.tsx`, `index.server.ts`, or `index.server.tsx`).
- Write behavior-focused tests for each runtime module before or alongside implementation. Cover success, failure, and relevant optional branches. Prefer the existing dependency injection patterns over new mock infrastructure.
- Reuse `_shared/ui`, `fetchJson`, and the existing AI service when their contracts fit. Never call external APIs from client code.
- Before adding client-side remote data or a data table, follow [the data-fetching and tables guide](../docs/data-fetching-and-tables.md). Prefer server loading or `fetchJson` for simple requests, use the existing TanStack Query provider for client-side server-state caching or synchronization, and use the shared `DataTable` for common sortable tables. For complex or server-managed tables, use TanStack Table with the shared `Table` primitives. Reuse the existing dependencies and `AppProviders`; do not add a duplicate provider or another table abstraction without a current feature need.
- Keep errors at trust boundaries clear; do not log or return secrets or upstream payloads.
- Keep database access in `packages/database` and server-only modules. Review generated Drizzle SQL before applying migrations; never point setup or tests at production.
- Put each real background workload in its own `apps/workers/<name>/` workspace. Do not create a no-op worker.
- Deploy the web app through Vercel Git integration and add a Cloudflare deployment workflow only alongside a real worker. Follow [deployment guidance](../docs/deployment.md); keep provider credentials in Vercel or GitHub environment settings.
- Run `pnpm format` to apply the pinned Prettier rules, then run `pnpm format:check`; CI enforces the check.
- After changes, run the relevant commands from `docs/testing.md`. The root `pnpm test` command runs fresh coverage suites in `apps/web` and `packages/database`, enforcing 100% global line, statement, function, and branch coverage in each workspace. Run all quality checks before declaring a feature complete.
- For each future worker or shared package with runtime code, add a Turbo-visible `test` script, the Vitest coverage provider matching the workspace Vitest version, an explicit runtime include, and the same four 100% thresholds.
- Update documentation when paths, contracts, or operations change. Do not add Codex model, approval, or sandbox configuration to the repository.
