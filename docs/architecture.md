# Architecture

Smart Base uses the Next.js App Router with Feature-Sliced Design (FSD). Routes are thin composition roots; domains and user workflows live in separate layers so they are easier to change and test.

## Layers and ownership

| Layer | What belongs here | Location or guidance |
|---|---|---|
| `app/` | Routes, metadata, root layout, and connections between pages and URLs | `apps/web/src/app` |
| `_app/` | App-level providers and composition logic | Create when the app has its own providers |
| `_pages/` | Route-level screen content composed from widgets, features, and entities | Create for the first product page |
| `_widgets/` | Large UI blocks that compose lower-level layers | Create when composition needs reuse |
| `_features/` | User actions/workflows that can be expressed as verbs | Create as product needs arise |
| `_entities/` | Domain-related models, schemas, and data operations | `apps/web/src/_entities/ai` |
| `_shared/` | Domain-independent UI, API clients, and libraries | `apps/web/src/_shared` |

Higher layers may import lower layers: `app → _pages → _widgets → _features → _entities → _shared`. Do not import in the reverse direction or across sibling features/entities. ESLint checks these layer boundaries. `app/` is a Next.js-specific exception and should only contain route/layout wiring.

Create FSD layers only when a feature needs them. Add other shared packages only when they have a real consumer; keep code used in one place with its owner. The starter's `packages/database` is pre-provided infrastructure, not a pattern for adding unused product code. The `_app`, `_pages`, and similar folder names avoid collisions with Next.js route conventions.

## Workspace layout

FSD applies to the Next.js app under `apps/web/src/`. The monorepo also has separate deployment and infrastructure areas:

| Path | Ownership |
|---|---|
| `apps/web/` | Next.js routes, UI, and product FSD slices |
| `apps/workers/<name>/` | One independently deployed Cloudflare Worker package per real background workload; see [`apps/workers/README.md`](../apps/workers/README.md) |
| `packages/database/` | Shared server-only PostgreSQL connection and Drizzle schema entry point |
| `packages/<name>/` | Code with real consumers in more than one app |
| `drizzle/` | Generated SQL migrations and Drizzle snapshots |

The database package contains infrastructure only. Add product tables to `packages/database/src/schema/` when the application defines its domain, then generate and review a migration. Do not put worker jobs or product workflows in shared packages.

## Adding a feature

1. A route in `app/` calls the corresponding page; routes contain no queries or business logic.
2. A page composes widgets, features, and entities without owning them.
3. Put user actions in features. Put domain schemas, models, and data in entities.
4. Move reusable code to `_shared` only when it is independent of the domain.
5. Keep tests close to their modules. Test API and AI behavior through dependency injection or mocks; unit tests must not call live services.
6. Keep persistence schemas in `packages/database`; keep repositories and domain behavior in their owning FSD slices. Keep background jobs in their own `apps/workers/<name>/` workspace.

A product list screen might use `app/products/page.tsx`, `_pages/products/ui/products-page.tsx`, `_widgets/product-list/`, `_features/search-products/`, `_entities/product/`, and `_shared/ui/table`. This is a structural example; the starter does not include this product behavior.

