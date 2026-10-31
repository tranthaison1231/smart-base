# Codex and Agent Workflow

Read the repository guidance in this order:

1. [`AGENTS.md`](../AGENTS.md): durable repository rules.
2. [`.codex/AGENT.md`](../.codex/AGENT.md): how to make changes in the starter.
3. [`.codex/project-state.md`](../.codex/project-state.md): current domain and project state.
4. [`.agents/skills/feature-development/SKILL.md`](../.agents/skills/feature-development/SKILL.md): workflow for adding product features.

Before making a change, identify the layer that owns the code and read the relevant module and tests. For remote data or tabular UI, follow the [data-fetching and tables guide](data-fetching-and-tables.md). Add behavior-focused tests for every runtime module and write a regression test first for new behavior. Run `pnpm format` to apply the pinned formatting rules, then run `pnpm format:check`, lint, typecheck, tests, and build as appropriate; the root `pnpm test` command enforces 100% global line, statement, function, and branch coverage in each current test workspace. Update the documentation if a contract or structure changes. See [testing](testing.md).

For features that persist data, use [`database.md`](database.md) and keep schema and migration work separate from repository and business logic. For background work, follow the per-worker workspace convention in [`apps/workers/README.md`](../apps/workers/README.md).

For a product with both web and mobile, prefer a separate backend as described in [architecture](architecture.md#choosing-a-backend) and follow [mobile guidance](mobile.md). A web-only product can keep its backend in Next.js. Keep route and UI code in its app; extract platform-neutral types, validation, or business logic only when both apps use it. Mobile must access server-owned behavior through an authenticated API, not import server-only database or AI code. Treat each API and direct database access path as a separate authorization boundary.

The repository intentionally does not set a default model, approval policy, sandbox, or plugin marketplace. Those choices belong to each user's environment; do not commit credentials or personal configuration to the starter.

When copying the starter for a new product, update `project-state.md`, `README.md`, and the domain documentation before asking an agent to build the first feature.

## Reusing capabilities across products

- Implement a capability in the product app on its first use.
- After a second product uses the same approach, document the proven setup as an optional recipe under `docs/recipes/`.
- After a third use, if the setup is stable, consider an opt-in template or scaffold. Keep its dependencies out of the starter defaults.
- Add a capability to the core only when nearly every new product needs it and the maintenance cost is justified.

Do not add a plugin registry or runtime feature flags to this copy-based starter.
