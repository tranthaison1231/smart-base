# Background worker apps

Add one independently deployable Cloudflare Worker package under `apps/workers/<worker-name>/` for each real background workload. Smart Stock uses this per-worker Wrangler pattern for scheduled ingestion jobs; Smart Base keeps the requested group under `apps/` and does not copy those product-specific jobs.

Each worker package owns its `package.json`, `wrangler.jsonc`, TypeScript configuration, `src/index.ts`, tests, and deploy scripts. Use Wrangler for local development and deployment, and Vitest for deterministic handler tests. Add a `triggers.crons` entry only when the workload has a defined schedule.

Store deployment secrets with the worker platform's secret manager. Do not commit credentials or share mutable runtime state between workers. Import from `packages/*` only when the code is genuinely shared with another app.

Do not import `@smart-base/database` into a Cloudflare Worker: its PostgreSQL.js client uses the Node server runtime and is marked `server-only`. If a worker needs persistence, choose a provider-supported serverless/HTTP driver for that workload, as Smart Stock does for its Workers.

No worker package is included yet because the starter has no background job to run. The workspace glob already includes packages added under this directory.
