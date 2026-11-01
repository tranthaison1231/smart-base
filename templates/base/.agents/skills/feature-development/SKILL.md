---
name: feature-development
description: Add or change a user-facing product feature in this starter, such as a workflow, page, or domain capability. Do not use for isolated UI primitives, dependency upgrades, or documentation-only changes.
---

# Feature Development Workflow

## Workflow

1. Read `AGENTS.md`, `.codex/project-state.md`, and `docs/architecture.md`. Summarize the user behavior, required loading, empty, and error states, and the layer that owns the feature.
2. Find existing modules, components, and tests before adding files. Keep routes thin. Put composition in pages and widgets, actions in features, domain models and data contracts in entities, and shared primitives in `_shared`.
3. Identify trust boundaries before fetching data: validate incoming data against a schema, and keep database queries, external API calls, and all secrets and provider credentials on the server. Add a failing test for the new behavior before implementation.
4. Implement in the chosen layer using the existing `fetchJson`, UI primitives, and dependency injection. Handle loading, empty, error, and success states in the layer that owns the workflow.
5. If the feature persists data, add its Drizzle schema under `packages/database/src/schema/`, test repository behavior without a live database, then generate and review the migration. Apply migrations only to an explicitly selected environment.
6. Add behavior-focused tests for each runtime module, covering success, error, and relevant optional branches. Run focused tests while developing, then run `pnpm test`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`. The root test command enforces 100% global line, statement, function, and branch coverage in every current test workspace. Update documentation when contracts or structure change, and summarize the results and any checks not run.

When a future worker or shared package adds runtime code, give it a Turbo-visible `test` script, a Vitest coverage provider matching its Vitest version, an explicit runtime include, and the same four 100% thresholds before relying on the root `pnpm test` command.

## API and AI Integrations

- Call external APIs only from server-side code. Validate responses before they enter the domain or UI.
- Use the AI service through its server-only export. Add an AI route only after the app has suitable authentication and authorization, rate limits, budget controls, and timeout and cancellation handling. Otherwise, defer the route instead of exposing an anonymous endpoint. Use a fake model through dependency injection in tests; do not call a live provider. Never expose keys or upstream errors or response payloads.
