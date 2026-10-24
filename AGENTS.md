# Agent Instructions

Smart Base is a product-neutral starter with no product domain yet. Read [project state](.codex/project-state.md) and the [Codex documentation](docs/codex.md) before making major changes.

- Preserve FSD dependency direction: higher layers may import lower layers only. `app/` handles route and layout wiring; do not put business logic there.
- Add shared UI to `apps/web/src/_shared/ui` only when it is domain-independent. Check for an existing component before creating another one.
- Call external APIs from server-side code and validate responses at trust boundaries with schemas. Never expose credentials to the client.
- The AI service is server-only. Add authentication, rate limiting, and budget limits before creating a public route.
- Keep PostgreSQL connections and credentials in `packages/database` server-side. Review generated Drizzle SQL before applying it; never run migrations against production as part of setup or tests.
- Put each real background workload in its own package under `apps/workers/`; do not add placeholder jobs.
- For behavior changes, write a regression test. Before finishing, run the relevant checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
- Do not add product logic, environment variables, dependencies, or abstractions "for later" when the current feature does not need them.
- If the repository has `.codegraph/`, use CodeGraph to trace symbols/call paths before using grep or reading many files. Do not initialize an index yourself.
- Read the [feature-development](.agents/skills/feature-development/SKILL.md) skill when adding a new product workflow.

