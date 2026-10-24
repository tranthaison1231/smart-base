# Smart Base

A Next.js starter to copy when creating a new product. It includes a Feature-Sliced Design (FSD) structure, shared UI, a schema-checked API client, a server-only AI text service, a lazy PostgreSQL/Drizzle package, and lint, typecheck, and test tooling. It contains no Smart Stock, Smart Idea, or Smart Shop product logic.

## Getting Started

Requires Node.js `>=22.22.2` and pnpm `10.32.1` (pinned in `packageManager`).

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. No API key is required to run the app, build, or tests.

## Quality Gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

`pnpm test:e2e` runs a browser smoke test with Chromium and starts the app on port `3100`. If Chromium is not installed, run `pnpm --filter @smart-base/web exec playwright install chromium`.

## Database

`@smart-base/database` creates a PostgreSQL connection only when `getDb()` is called. Add product tables under `packages/database/src/schema/`, generate and review migrations with `pnpm db:generate`, then apply them explicitly with `DATABASE_URL=... pnpm db:migrate`. See the [database guide](docs/database.md).

## Building a Product

1. Read the [architecture guide](docs/architecture.md) and identify the owning route, page, widget, feature, or entity.
2. Read the [Codex workflow](docs/codex.md) and the [feature-development](.agents/skills/feature-development/SKILL.md) skill.
3. Add the first domain model under `_entities`; do not add a placeholder domain to the starter.
4. Review [UI components](docs/ui-components.md), [API](docs/api.md), [AI service](docs/ai-service.md), [database](docs/database.md), and [testing](docs/testing.md) before adding the corresponding layer.
5. Put independent background workloads under [`apps/workers/`](apps/workers/README.md); add a worker package only when a real job needs one.

## Structure

```text
apps/
├── web/                    # Next.js app with FSD layers under src/
└── workers/                # One independent worker package per real workload
packages/
└── database/               # Shared server-only PostgreSQL/Drizzle connection
drizzle/                    # Generated SQL migrations and Drizzle metadata
```

The web app's FSD layers live under `apps/web/src/`:

```text
app/ → _pages/ → _widgets/ → _features/ → _entities/ → _shared/
```

ESLint checks import direction between layers. See [architecture.md](docs/architecture.md) for boundaries and examples.

See [apps/workers/README.md](apps/workers/README.md) for worker placement and [packages/README.md](packages/README.md) for shared-package ownership.

## Codex

`AGENTS.md` is the agent entry point. `.codex/` contains workflow guidance and the starter's current state; `.agents/skills/feature-development/` describes the feature-development process. Model, approval, and sandbox settings remain user-managed.

