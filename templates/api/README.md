# API

`GET /health` returns `200` and `{ "status": "ok" }`. Unknown routes return `404`.
Run `pnpm dev:api` from the workspace root; the local server listens on port 3001.

This is an unauthenticated liveness check only. Add authentication, authorization, validation,
rate limiting, and a documented contract before exposing product operations. Database access
requires a server entry point and connection strategy compatible with the chosen runtime.
Deploy this workspace as a separate Vercel project when the product is ready.
