# Smart Base Workers and Database Foundation — Design

## Intent

Extend the copyable starter with a clear home for background-worker apps and a reusable PostgreSQL/Drizzle foundation. The starter remains free of Smart Stock, Smart Idea, and Smart Shop jobs, tables, and data.

## Goals

- Add `apps/workers/` as the group for independently deployable worker workspaces under `apps/workers/*`.
- Add a server-only `@smart-base/database` package with a lazy PostgreSQL.js/Drizzle connection.
- Add root Drizzle Kit commands and use `drizzle/` for generated migrations and metadata.
- Keep builds, tests, and migration generation independent of a live database; require `DATABASE_URL` only when connecting or applying migrations.
- Document where worker code, shared packages, schema files, and migrations belong.

## Non-goals

- No sample scheduled job, worker runtime, product schema, placeholder table, generated migration, auth system, database seed, or live database mutation.
- No Cloudflare credentials or environment-specific deployment settings.
- No additional shared package beyond the reusable database infrastructure.

## Approaches

### Worker directory

1. Add a sample Cloudflare Worker with a no-op scheduled handler. This proves deployment wiring but ships a job with no useful work.
2. Add `apps/workers/` as a documented workspace group for future per-job Cloudflare Worker packages. This provides the requested structure without copying Smart Stock's domain-specific ingestion jobs or inventing a fake job. **Selected.**

Smart Stock has independently deployed Wrangler workers under a root `workers/` directory; Smart Idea has no worker app. The starter will use the requested `apps/workers/` location and preserve the independent-package pattern.

### Database foundation

1. Add only directories/configuration. This leaves each future app to rebuild connection handling.
2. Add a small lazy database package and migration workflow, but no tables or migrations. This keeps secrets out of builds/tests and avoids product-specific schema. **Selected.**

Smart Idea's database package delays connection creation until `getDb()` is called. Smart Stock uses PostgreSQL.js with `max: 1` and `prepare: false` for serverless use. The starter will combine those patterns and keep `DATABASE_URL` optional until runtime.

## Architecture Decisions

- Root pnpm workspaces include `apps/workers/*`; each concrete worker owns its `package.json`, Wrangler config, handlers, tests, and deploy command.
- `packages/database` owns the shared database connection and an empty schema entry point. Product tables are added only when the copied app defines its domain.
- Root `drizzle.config.ts` reads schema files from `packages/database/src/schema/` and outputs to `drizzle/`. `db:generate` does not need a database; `db:migrate` requires `DATABASE_URL`.
- `getDb()` validates `DATABASE_URL` lazily, creates one Postgres.js client with `max: 1` and `prepare: false`, and reuses the Drizzle instance in the current process.
- The database package is for Node server code only. Cloudflare Workers must choose a worker-compatible serverless/HTTP driver for their provider; the starter does not guess a provider.
- No package under `apps/workers/*` is created until a real job needs a runtime. The directory README records the exact pattern to follow.

## Constraints and Safety

- Keep database URL, client, and query code server-only.
- Never connect to or mutate a live database during setup or validation.
- Do not add product tables, seed data, or sample worker jobs.
- Preserve the existing uncommitted English documentation changes.

## Acceptance Criteria

- `packages/database` is a workspace package with typed server-only exports.
- Unit tests verify missing/blank database URLs fail clearly and configured URLs are trimmed.
- `pnpm db:generate` works with the empty schema and no `DATABASE_URL` without creating a product migration.
- `pnpm db:migrate` refuses to run without `DATABASE_URL` before making a connection.
- `apps/workers/` is tracked, and future per-worker packages under it are included by pnpm workspace globs.
- Root lint, typecheck, unit tests, browser smoke test, production build, and `git diff --check` pass.
