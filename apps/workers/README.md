# Background worker apps

Create one independently deployable Cloudflare Worker package under `apps/workers/<worker-name>/` for each real background workload.

Each worker package owns its `package.json`, `wrangler.jsonc`, TypeScript configuration, `src/index.ts`, tests, and deployment scripts. Use Wrangler for local development and deployment, and Vitest for deterministic handler tests. Add a `triggers.crons` entry only when the workload has a defined schedule.

## Testing and coverage

Every worker package that adds runtime code must expose a `test` script that Turbo can discover and that runs coverage, for example:

```json
{
  "scripts": {
    "test": "vitest run --coverage"
  },
  "devDependencies": {
    "vitest": "<workspace Vitest version>",
    "@vitest/coverage-v8": "<same version as vitest>"
  }
}
```

Configure Vitest to include every runtime TypeScript and TSX file under `src/`, excluding test/spec files, `src/test/**`, declarations, and generated files. Set global thresholds to 100% for lines, statements, functions, and branches. Keep external calls injected or mocked so worker tests remain deterministic and offline. The root Turbo `test` task disables caching, so the root `pnpm test` command will run the worker's coverage gate on every invocation. Follow the [testing guide](../../docs/testing.md) for the repository-wide contract.

Store deployment secrets with the worker platform's secret manager. Do not commit credentials or share mutable runtime state between workers. Import from `packages/*` only when the code is genuinely shared with another app.

Do not import `@smart-base/database` into a Cloudflare Worker: its PostgreSQL.js client uses the Node server runtime and is marked `server-only`. If a worker needs persistence, choose a database driver supported by both the Worker runtime and the database provider.

No worker package is included because the starter has no background workload to run. The pnpm workspace glob already includes future worker packages added under this directory.
