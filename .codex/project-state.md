# Project State

## Goal

Smart Base is a copyable starter repository for new applications. It provides Next.js, FSD, UI primitives, a JSON API client, a server-only AI text service, lazy PostgreSQL/Drizzle infrastructure, and baseline quality checks.

## Domain

There is no product domain yet. Keep product-specific logic and data from Smart Stock, Smart Idea, and Smart Shop out of this starter. The `ai` entity and `packages/database` provide integration infrastructure, not product domains. No database tables or worker jobs are included.

## Runtime and checks

- pnpm/Turborepo monorepo; web app at `apps/web`, future independent worker packages under `apps/workers/*`, and shared infrastructure under `packages/*`.
- Node.js `>=22.22.2`, pnpm `10.32.1`.
- `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build`.
- `pnpm db:generate` works from local schema files; `pnpm db:migrate` requires an explicit `DATABASE_URL`.
- Database schema entry point: `packages/database/src/schema/`; migration output: `drizzle/`.
- AI requires `AI_API_KEY` and `AI_MODEL` when calling a provider; they are not needed for build or tests.

## Decisions when copying

Rename the repository and package for the new product, add its domain model and product state to this file, then update the README and domain documentation. Add a worker package only for a real background workload and other shared packages only when they have a real consumer.

