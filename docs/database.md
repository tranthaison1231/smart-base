# Database

The `@smart-base/database` workspace package provides the shared PostgreSQL connection and Drizzle entry point. It contains infrastructure only: the starter has no product tables, seed data, or migrations.

## Connection

Import the database only from server-side code. Before using it in the web app, add the workspace dependency:

```bash
pnpm --filter @smart-base/web add '@smart-base/database@workspace:*'
```

```ts
import { getDb } from "@smart-base/database/server"

const db = getDb()
```

`getDb()` reads and trims `DATABASE_URL` only when first called, then creates and reuses one Drizzle/PostgreSQL.js client per process. The PostgreSQL.js client uses `max: 1` and `prepare: false` for serverless compatibility. Importing the package during build or tests does not open a database connection. Missing or blank `DATABASE_URL` fails at the first call with a clear configuration error.

The `server-only` marker protects this export from client bundles. Never pass the database URL or connection object to Client Components.

## Schema and migrations

Add Drizzle tables under `packages/database/src/schema/` after the application has a defined domain. The schema entry point is intentionally empty. Keep repositories and domain behavior in their owning FSD slices; the database package owns connection and shared schema definitions.

Generate migration files from local schema sources:

```bash
pnpm db:generate
```

Generation does not connect to a database. Review the SQL and snapshot files under `drizzle/`, then commit them together. Applying migrations changes the target database:

```bash
DATABASE_URL=postgres://user:password@localhost:5432/app pnpm db:migrate
```

Set `DATABASE_URL` explicitly for the intended environment. Do not run migrations against production during setup, tests, or routine verification. The starter's test suite does not apply migrations or need a live database.

## Optional Supabase PostgreSQL

[Supabase](https://supabase.com/docs/guides/database/overview) is one managed PostgreSQL option for a real product. The existing Drizzle package can connect to it using a PostgreSQL connection string; the Supabase SDK is not required for Drizzle queries. Add an SDK only when the product needs Supabase services such as Auth or Storage.

- For serverless application queries, choose the [shared pooler in transaction mode](https://supabase.com/docs/guides/database/connecting-to-postgres). The current client already sets `max: 1` and `prepare: false`; verify TLS and the connection string against the provider's current guidance. These settings alone do not prove the connection is production-ready.
- For migrations, Supabase recommends a direct connection. Check network compatibility (including IPv6) or the provider's documented session-mode alternative. Supply the intended migration connection as `DATABASE_URL` only to the migration command; keep runtime and migration credentials server-side and use separate environments. Review generated SQL before applying it.
- Drizzle does not automatically act as the signed-in Supabase user. A privileged PostgreSQL role can bypass Row Level Security (RLS), so authenticate and authorize server requests explicitly, or deliberately configure a suitable role and user context. Never assume a Supabase Auth session automatically protects a Drizzle query.
- If an application also exposes tables through the Supabase Data API, configure least-privilege grants and RLS policies for every exposed table, then test access for anonymous, authorized, and unauthorized users. A Supabase secret or service-role key bypasses RLS and must never be exposed to a client. See [Supabase data security](https://supabase.com/docs/guides/database/secure-data).

This starter does not provision Supabase, install its SDK, or configure its services. Check current limits, backups, and pricing for the chosen environment before deployment.

## Optional Redis

When an application has a concrete need for shared caching or distributed rate limiting, evaluate [Upstash Redis](https://upstash.com/docs/redis/overall/getstarted) first. Its HTTP-based client works with serverless environments, including Next.js and Cloudflare Workers. Redis is not installed or configured in the starter, and it does not replace PostgreSQL as the source of truth or [Cloudflare Queues](../apps/workers/README.md#queued-workloads) for background jobs.

Add the integration in the feature that needs it:

1. Review the current [pricing and limits](https://upstash.com/pricing/redis), region, availability, retention, and security requirements. Use separate databases or isolated credentials for development and production where appropriate.
2. Create a database only for the real application. Install `@upstash/redis` in the workspace that uses it, following the [official client guide](https://upstash.com/docs/redis/howto/connect-with-upstash-redis).
3. Store the REST URL and token as server-side environment variables or Worker secrets. Document their names and empty placeholders in that application's environment example. Never commit credentials, expose the token through `NEXT_PUBLIC_`, or send it to a browser.
4. Keep integration code and cache keys with the owning feature or entity. For caching, define expiry and invalidation, avoid storing unnecessary sensitive data, and decide whether a Redis failure should fall back to the source of truth.
5. For rate limiting, enforce it on the server and explicitly choose how the endpoint behaves if Redis is unavailable or quota is exhausted. Security-sensitive endpoints may need to reject requests rather than silently allow them. Test normal operation, expiry, failures, and the chosen fallback without requiring live credentials in the test suite.

Monitor command usage, bandwidth, and storage against the selected plan; check limits again before deployment rather than relying on a fixed quota in this document. Promote a setup into an optional recipe only after the same approach has been used by another product.
