# Smart Base — Design

## Intent

Build a copyable starter repository for new product apps and Codex-assisted development. It should preserve the reusable engineering patterns found in Smart Stock, Smart Idea, and Smart Shop while leaving product behavior out, so a new project can add its domain without first rebuilding the UI, API, AI, test, and repository-guidance foundations.

## Goals

- Start a Next.js App Router application from a pnpm/Turborepo workspace.
- Keep the Feature-Sliced Design layout used by Smart Stock and Smart Idea: `app`, `_app`, `_pages`, `_widgets`, `_features`, `_entities`, `_shared`.
- Keep the reusable UI primitives from Smart Stock's `_shared/ui`, based on shadcn components and Base UI.
- Provide a schema-checked API fetch helper and document the route, query, and service boundaries.
- Provide a server-only, environment-configured AI text service using the OpenAI-compatible LangChain adapter pattern, with an injectable model for tests. Do not add a public, unauthenticated AI endpoint.
- Include strict TypeScript, ESLint with FSD import-boundary rules, Vitest/Testing Library, and a small Playwright smoke test.
- Include Vietnamese-first onboarding and architecture documentation, plus repo-local Codex guidance and one feature-development skill.

## Non-goals

- No Smart Stock, Smart Idea, or Smart Shop domain behavior, data, branding, routes, or fixtures.
- No authentication, database, migrations, deployment configuration, or production observability stack.
- No provider-management UI, stored credentials, OAuth, agent runtime, or public AI endpoint.
- No Storybook or duplicate component catalogue application; component usage is documented and covered by focused tests.
- No project-level Codex model, approval, or sandbox overrides. Those settings belong to each user's Codex configuration.

## Approaches

1. **Copyable starter repo — selected.** A single Next.js app in a pnpm/Turborepo workspace, with FSD boundaries and ready-to-use UI, API, AI, testing, and Codex patterns. Copying it gives each product independent ownership and avoids shared-package release work.
2. **Shared-package monorepo.** Split UI, configs, and services into packages for several apps to import. This improves cross-app reuse but adds package boundaries and version maintenance before there are multiple consumers.
3. **Codex harness only.** Add repository instructions and prompts without a real app foundation. This is smaller but does not meet the request for reusable components and API/AI patterns.

The user chose the copyable starter repo and asked to keep the general structure of Smart Stock/Idea while removing product logic.

## Architecture and implementation calls

- Use `apps/web` for the Next.js application. Keep route files in `apps/web/src/app` thin; compose route screens from `_pages` and lower FSD layers.
- Keep `packages/*` available in the workspace glob but create no placeholder packages. Add a package only when real shared code needs one.
- Follow the source repositories' observed stack: Node.js `>=20.18`, pnpm `10.32.1`, Turborepo `2.11.5`, Next.js `16.3.2`, React `19.2.8`, TypeScript `5.9.3`, Tailwind CSS `4.3.3`, and ESLint 9. Pin the lockfile and resolve compatible component/test versions from the source repos.
- Keep the generic Smart Stock shared UI set under `_shared/ui`: avatar, badge, button, calendar, card, chart, dialog, dropdown menu, field, input, label, popover, separator, sheet, sidebar, skeleton, sonner, spinner, table, theme provider, toggle, toggle group, and tooltip. Use Base UI and existing project dependencies; do not add a new UI framework.
- Keep API calls small and explicit: a shared `fetchJson` helper accepts a response schema, timeout/cancellation, method/body, and injected `fetch` for tests. Keep request schemas and query hooks in their owning slices; keep Next route handlers as adapters.
- Keep AI server-only. Read the API key/model/base URL from environment variables, validate configuration before constructing a model, expose a small text-generation service, and allow a fake model to be injected. Tests must never make live provider requests. Add `.env.example`, never real credentials.
- Use Vitest, jsdom, Testing Library, and user-event for unit/component/route tests; keep Playwright as a separate smoke-test command so the fast suite does not require a browser install.
- Add root `AGENTS.md`, `.codex/AGENT.md`, `.codex/project-state.md`, `.codex/README.md`, and one focused skill under `.agents/skills/`. Explain that repository-local skills live under `.agents/skills`; keep Codex model and safety preferences user-owned. Do not create an empty `.codex/config.toml` or configure a plugin without an actual project setting.
- Write `README.md` and focused Vietnamese docs for architecture, UI, API, AI, Codex setup, and testing. Keep each file scoped to the decisions and workflow it owns.

## Constraints and safety

- Preserve server/client boundaries; API keys and model construction stay in server-only modules.
- Do not ship an anonymous endpoint that can spend the operator's AI budget. A future product must add its own authorization and rate limits before exposing AI generation.
- Avoid copying product-specific labels, routes, database schemas, agents, and test fixtures from the source repositories.
- Keep the package set limited to what the base examples actually use.

## Acceptance criteria

- A fresh `pnpm install` followed by `pnpm dev` starts the starter app without product secrets.
- `pnpm lint`, `pnpm typecheck`, and `pnpm test` each run successfully; `pnpm test:e2e` has a separate smoke-test path.
- Tests cover API response validation/error behavior, AI config and fake-model behavior, and representative UI interaction/rendering.
- FSD lint rules catch imports from a higher layer into a lower layer.
- Docs explain where code belongs, how to add a component/API/AI use case, how to run checks, and what the repo Codex files do.
- No domain feature, database, auth flow, or live AI call is included.
