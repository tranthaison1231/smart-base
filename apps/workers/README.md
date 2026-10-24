# Background worker apps

Create one independently deployable Cloudflare Worker package under `apps/workers/<worker-name>/` for each real background workload.

Each worker package owns its `package.json`, `wrangler.jsonc`, TypeScript configuration, `src/index.ts`, tests, and deployment scripts. Use Wrangler for local development and deployment, and Vitest for deterministic handler tests. Add a `triggers.crons` entry only when the workload has a defined schedule.

Store deployment secrets with the worker platform's secret manager. Do not commit credentials or share mutable runtime state between workers. Import from `packages/*` only when the code is genuinely shared with another app.

Do not import `@smart-base/database` into a Cloudflare Worker: its PostgreSQL.js client uses the Node server runtime and is marked `server-only`. If a worker needs persistence, choose a database driver supported by both the Worker runtime and the database provider.

No worker package is included because the starter has no background workload to run. The pnpm workspace glob already includes future worker packages added under this directory.
