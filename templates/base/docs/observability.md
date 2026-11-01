# Observability

Use the hosting platform's built-in logs and metrics first. Add a third-party SDK or log destination only when the application needs cross-platform error grouping, alerts, longer retention, or a shared view across services. Smart Base has no observability SDK or worker package configured.

## Vercel web app

Vercel provides project Observability and runtime logs for deployed functions. Open the project in the Vercel dashboard and use **Observability** to inspect traffic, errors, and function behavior, then use **Logs** to inspect individual runtime output. These platform views do not require a repository dependency.

Use the shared Pino logger for concise server-side operational events. It writes JSON to stdout for info and stderr for warnings and errors, for example:

```ts
import { logger } from "@/_shared/lib/logger"

logger.error({ event: "profile.save_failed", requestId, errorCode: "DATABASE_UNAVAILABLE" })
```

Use `logger.info`, `logger.warn`, or `logger.error` with a stable event name and safe context. This Node.js server-only logger does not configure automatic redaction: do not log credentials, authorization headers, full request bodies, personal data, raw errors, or raw upstream responses. Return safe error messages to clients and keep detailed diagnostics in server-side logs. On Vercel, stderr can be classified as an error even for warning events; use the JSON `level` field to distinguish them.

## Route errors and missing pages

The root `app/error.tsx` displays a generic message and offers a retry for uncaught errors in child route segments. It does not display or report the error itself. Log safe context where a server operation fails, and use platform logs for uncaught server errors. The error boundary is a Client Component, so do not import the server-only Pino logger into it. Add a client error-reporting integration only when the product needs one and has reviewed event scrubbing.

The root boundary does not catch failures in the root layout or template, event handlers, or arbitrary asynchronous callbacks. Handle expected failures in the owning feature; add `global-error.tsx` if a product needs a custom fallback for root-layout failures. `app/not-found.tsx` provides the shared missing-page UI; features can call Next.js `notFound()` when the requested resource does not exist.

If a product needs error grouping, release tracking, alerts, or one view spanning Vercel and Cloudflare, evaluate Sentry or another provider and follow its current Next.js setup guide. Configure any upload token as a Vercel build secret; never put it in source control or a `NEXT_PUBLIC_` variable. Review source-map access and event scrubbing before enabling client-side capture.

## Cloudflare Workers

Add observability configuration to the real worker's `wrangler.jsonc` when creating that worker. For example:

```jsonc
{
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1,
    "traces": {
      "enabled": true,
      "head_sampling_rate": 0.05,
    },
  },
}
```

Deploy the worker, then open **Workers & Pages → your worker → Observability** in the Cloudflare dashboard. Use `wrangler tail` for live logs during diagnosis. Log structured objects with stable event names, and include a safe request or job identifier when it helps correlate events.

Sampling rates are between `0` and `1`; `1` records all matching requests and `0.05` samples about five percent. Choose rates for the real workload and review Cloudflare's current retention and pricing before enabling high-volume logs or traces. Workers can also export logs and traces using Cloudflare's [OpenTelemetry export](https://developers.cloudflare.com/workers/observability/opentelemetry-export/) when a product has selected an external destination.

## Operational checklist

- Record failures with a stable event name and enough non-sensitive context to identify the operation.
- Do not catch and discard failures that should fail the request or job; preserve a safe error response and a useful server-side record.
- Keep credentials in Vercel project settings or the Cloudflare Worker secret store. Use GitHub environment secrets only for deployment credentials.
- Add alerts and uptime checks when the product defines its service-level needs and support ownership.

## Platform references

- [Vercel Observability](https://vercel.com/docs/observability)
- [Vercel runtime logs](https://vercel.com/docs/logs/runtime)
- [Cloudflare Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [Cloudflare Workers traces](https://developers.cloudflare.com/workers/observability/traces/)
- [Cloudflare Workers OpenTelemetry export](https://developers.cloudflare.com/workers/observability/opentelemetry-export/)
