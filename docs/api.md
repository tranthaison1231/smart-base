# API client

`fetchJson` in `apps/web/src/_shared/api/fetch-json.ts` is a client/server helper for HTTP JSON requests. It validates responses with `schema.parse` and maps HTTP, JSON, and schema errors to a caller-provided message.

```ts
import { fetchJson } from "@/_shared/api/fetch-json"
import { z } from "zod"

const UserSchema = z.object({ id: z.string(), name: z.string() })

const user = await fetchJson({
  url: "/api/users/123",
  schema: UserSchema,
  errorMessage: "Could not load user",
})
// user is inferred as { id: string; name: string }
```

Options: `method` (defaults to `GET`; also supports `POST` and `PUT`), `body`, `fetchImpl` (inject for tests), `signal`, `cache`, and `acceptResponse` for special statuses where the endpoint intentionally returns JSON. The body is JSON-serialized and a content type is added automatically. The helper applies a 5-second timeout by default; when a `signal` is provided, the timeout is combined with the caller's abort signal.

Non-2xx responses, malformed JSON, and schema failures all throw `Error(errorMessage)` so upstream payloads are not exposed. Network and abort errors from `fetch` are preserved. Endpoints that accept a valid status other than 2xx must declare it through `acceptResponse`.

Keep schemas near the contract that owns them and validate data at the point of entry. Do not use type assertions as a substitute for runtime checks. Routes that handle secrets or sensitive data must enforce authorization on the server; this helper does not add authentication, retries, or logging.

