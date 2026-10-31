# Shared packages

Add code here only when multiple applications need to share it. The starter includes `@smart-base/database` for server-only PostgreSQL and Drizzle infrastructure. Keep product models and workflows in their owning app until another application has a clear need to share them.

`packages/database` is the only package currently included. There are no placeholder shared packages. Add a package only with a real consumer, a clear owner, and a documented public API.

When both web and mobile need the same code, share platform-neutral types, validation schemas, or pure business rules with an explicit public API. Keep Next.js, React Native, browser, Node-only, database, and secret-dependent code out of packages intended for both platforms. UI stays with its platform unless a real cross-platform component is proven to work in both apps. Do not import `@smart-base/database` from mobile; call an authenticated server API for server-owned work. See the [mobile guide](../docs/mobile.md).

## Possible packages for a product

The following is a reference structure, not a list of packages already present or required. Create each package in a product copy only when it has a real shared consumer, an owner, and a clear public API; combine related code when separate packages would add unnecessary overhead.

```text
packages/
├── database/     # Existing server-only PostgreSQL and Drizzle infrastructure
├── api/          # Optional shared API client and request/response contracts
├── types/        # Optional shared TypeScript types
├── validation/   # Optional shared Zod schemas
├── core/         # Optional platform-neutral business logic
└── config/       # Optional shared tool configuration or public constants
```

| Package      | Add when needed                                                                       | Boundary                                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api`        | Web and mobile call the same API with reusable client behavior or contracts.          | Accept platform-appropriate configuration and auth from the caller; never embed secrets or import server-only code. Validate responses at the trust boundary. |
| `types`      | Both apps need the same types that are not already owned by another package.          | Types alone do not validate runtime data. Infer types from shared Zod schemas when appropriate rather than maintaining duplicates.                            |
| `validation` | Both apps validate the same input or response contract.                               | Export the relevant Zod schemas and inferred types; server-side validation remains required even if the client validates.                                     |
| `core`       | Both apps need the same platform-neutral business rules.                              | Keep rules independent of UI, database connections, credentials, and platform APIs. Authorization and other trusted decisions still belong on the server.     |
| `config`     | Multiple workspaces actually share compatible tool configuration or public constants. | Keep platform-specific configuration with its app and never publish secrets as shared constants.                                                              |

## Testing and coverage

Every package that adds runtime code must expose a Turbo-discoverable `test` script that runs Vitest coverage, add `@vitest/coverage-v8` at the same version as its Vitest dependency, and explicitly include all runtime TypeScript and TSX files under `src/`. Exclude test/spec files, `src/test/**`, declarations, and generated files. Set global `lines`, `statements`, `functions`, and `branches` thresholds to `100` so the root `pnpm test` command enforces the same gate in every workspace. See the [testing guide](../docs/testing.md) for the full coverage contract.
