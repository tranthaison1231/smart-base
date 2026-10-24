# Project State

## Goal

Smart Base is a starter repository to copy when creating a new application. It provides Next.js, FSD, UI primitives, a JSON API client, a server-only AI text service, lazy PostgreSQL/Drizzle infrastructure, and baseline quality gates.

## Domain

There is no product domain yet. Do not bring product logic or data from Smart Stock, Smart Idea, or Smart Shop into the starter. The current `ai` entity and `packages/database` are integration infrastructure, not product domains. No database tables or worker jobs are included.

## Runtime and Checks

- pnpm/Turborepo monorepo; web app at `apps/web`, future independent worker packages under `apps/workers/*`, and shared infrastructure under `packages/*`.
- Node.js `>=22.22.2`, pnpm `10.32.1`.
- `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build`.
- `pnpm db:generate` works from local schema files; `pnpm db:migrate` requires an explicit `DATABASE_URL`.
- Database schema entry point: `packages/database/src/schema/`; migration output: `drizzle/`.
- AI requires `AI_API_KEY` and `AI_MODEL` when calling a provider; they are not needed for build or tests.

## Decisions When Copying

Rename the repository and package for the new product, add its domain model and product state to this file, then update the README and domain documentation. Add a worker package only for a real background workload and other shared packages only when they have a real consumer.

