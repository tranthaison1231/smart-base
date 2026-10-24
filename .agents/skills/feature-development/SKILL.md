---
name: feature-development
description: Add or change a user-facing product feature in this starter, such as a workflow, page, or domain capability. Do not use for isolated UI primitives, dependency upgrades, or documentation-only changes.
---

# Feature Development Workflow

## Workflow

1. Read `AGENTS.md`, `.codex/project-state.md`, and `docs/architecture.md`. Summarize the user behavior, required loading/empty/error states, and the layer that owns the feature.
2. Find existing modules, components, and tests before adding files. Keep routes thin. Put composition in pages/widgets, actions in features, domain models and data contracts in entities, and shared primitives in `_shared`.
3. Identify trust boundaries before fetching data: validate incoming data against a schema; keep database queries and all secrets/provider credentials on the server. Client code may call public APIs without credentials when CORS and data policies allow it. Add a failing test for the new behavior before implementation.
4. Implement in the chosen layer using the existing `fetchJson`, UI primitives, and dependency injection. Handle loading, empty, error, and success states in the layer that owns the workflow.
5. If the feature persists data, add its Drizzle schema under `packages/database/src/schema/`, test repository behavior without a live database, then generate and review the migration. Apply migrations only to an explicitly selected environment.
6. Run the relevant tests, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`. Update documentation when contracts or structure change, and summarize the results and any checks not run.

## API and AI Integrations

- Call external APIs that require secrets only from server code. Validate responses before they enter the domain or UI.
- Use the AI service through its server-only export. Add an AI route only after the app has suitable authentication/authorization, rate limiting, budget controls, and timeout/cancellation. Otherwise, defer the route instead of exposing an anonymous endpoint. Use a fake model through dependency injection in tests; do not call a real provider. Never expose keys or upstream errors/payloads.

