# Smart Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a copyable Next.js starter repo with reusable UI, API and AI foundations, documented FSD structure, and a ready Codex workflow.

**Architecture:** A pnpm/Turborepo workspace containing one Next.js app under `apps/web`. The app follows the Smart Stock/Idea FSD layers; shared UI and API helpers live in `_shared`, while the server-only AI service lives in `_entities/ai`. Product logic, auth, and database packages are intentionally absent.

**Tech Stack:** Node.js 20.18+, pnpm 10.32.1, Turborepo 2.11.5, Next.js 16.3.2, React 19.2.8, TypeScript 5.9.3, Tailwind CSS 4.3.3, shadcn/Base UI, ESLint 9, Vitest, Testing Library, and Playwright.

**Spec:** `docs/superpowers/specs/2026-10-24-smart-base-design.md`

## Global Constraints

- Node.js `>=20.18`; pnpm `10.32.1`; Turborepo `2.11.5`.
- Next.js `16.3.2`; React `19.2.8`; TypeScript `5.9.3`; Tailwind CSS `4.3.3`.
- Keep Next routes thin and follow `app`, `_app`, `_pages`, `_widgets`, `_features`, `_entities`, `_shared` dependency direction.
- Keep AI keys and model construction server-side; do not add a public unauthenticated AI endpoint.
- Tests use fake `fetch` and fake AI models; never make a live provider request.
- Do not add auth, database, migration, product-domain, or provider-management code.
- Do not set repository model, sandbox, or approval preferences in Codex config.

## Review Focus

1. Invalid or non-JSON API responses must fail schema validation without leaking raw provider data; cover in Task 4 tests.
2. Missing AI credentials or an unsafe/invalid provider URL must fail before constructing a model; cover in Task 5 tests.
3. Provider errors and aborted AI calls must remain observable to callers; cover with fake-model tests in Task 5.
4. Core interactive UI must preserve keyboard behavior and accessible names; cover dialog/button interactions in Task 3 tests.
5. A lower FSD layer must not import from a higher layer; prove the ESLint rule rejects a temporary forbidden import in Task 2.

---

## File map

- Root manifests and `turbo.json`: workspace membership and root commands.
- `apps/web/`: Next.js app, lint/type/test configs, and e2e smoke test.
- `apps/web/src/app/`: route entry points, root layout, and global CSS.
- `apps/web/src/_app/` and `apps/web/src/_pages/`: app shell and the small starter home page.
- `apps/web/src/_shared/ui/`: the reusable Smart Stock UI primitive set.
- `apps/web/src/_shared/api/`: typed `fetchJson` helper and focused tests.
- `apps/web/src/_entities/ai/`: server-only env config and injectable AI text service.
- `AGENTS.md`, `.codex/`, `.agents/skills/`: repository guidance, current template state, and one feature-development skill.
- `docs/`: Vietnamese architecture, UI, API, AI, Codex, and testing guides.

## Task 1: Create the workspace and minimal Next.js app

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.json`, `.gitignore`, `pnpm-lock.yaml`
- Create: `apps/web/package.json`, `apps/web/next.config.ts`, `apps/web/tsconfig.json`, `apps/web/postcss.config.mjs`
- Create: `apps/web/src/app/layout.tsx`, `apps/web/src/app/page.tsx`, `apps/web/src/app/globals.css`
- Create: `apps/web/src/app/page.test.tsx`

**Interfaces:**
- Root scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, and `test:e2e` delegate to `@smart-base/web` or Turborepo.
- Workspace app name: `@smart-base/web`.

- [ ] **Step 1: Add the root and web manifests** with the pinned framework versions from the spec, workspace globs `apps/*` and `packages/*`, and Turborepo tasks for build, lint, typecheck, test, and dev.
- [ ] **Step 2: Write the starter page test** for a `main` landmark and an `h1` named “Smart Base”.
- [ ] **Step 3: Install and lock dependencies** with `pnpm install`; verify the lockfile can be reused with `pnpm install --frozen-lockfile`.
- [ ] **Step 4: Add the minimal App Router shell** with a neutral “Smart Base” heading, metadata, and Tailwind 4 PostCSS setup. Do not add product navigation or sample business data.
- [ ] **Step 5: Verify the shell** with `pnpm --filter @smart-base/web build`; expected result: successful Next.js production build without environment secrets.

## Task 2: Add quality gates, FSD boundaries, and the fast test runner

**Files:**
- Create: `apps/web/eslint.config.mjs`, `apps/web/vitest.config.mts`, `apps/web/src/test/setup.ts`
- Modify: root and web `package.json`, `turbo.json`, `apps/web/tsconfig.json`

**Interfaces:**
- `pnpm lint`, `pnpm typecheck`, and `pnpm test` are root checks.
- `apps/web` uses strict TypeScript and Vitest with jsdom and Testing Library.
- ESLint blocks imports from lower FSD layers into higher layers.

- [ ] **Step 1: Add ESLint, strict typecheck, Vitest, Testing Library, and FSD import rules** to the web configuration. Keep global ignores limited to generated and dependency directories.
- [ ] **Step 2: Run the page test and quality commands** with `pnpm --filter @smart-base/web exec vitest run src/app/page.test.tsx`, `pnpm lint`, `pnpm typecheck`, and `pnpm test`.
- [ ] **Step 3: Probe the FSD boundary** by linting a temporary shared-layer source that imports `@/_features/example`; expect ESLint's explicit boundary rule to reject it, then remove the probe.

## Task 3: Add reusable UI components

**Files:**
- Create under `apps/web/src/_shared/ui/`: `avatar.tsx`, `badge.tsx`, `button.tsx`, `calendar.tsx`, `card.tsx`, `chart.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `field.tsx`, `input.tsx`, `label.tsx`, `popover.tsx`, `separator.tsx`, `sheet.tsx`, `sidebar.tsx`, `skeleton.tsx`, `sonner.tsx`, `spinner.tsx`, `table.tsx`, `theme-provider.tsx`, `toggle.tsx`, `toggle-group.tsx`, `tooltip.tsx`
- Create: `apps/web/src/_shared/lib/utils.ts` and `apps/web/src/_shared/hooks/use-mobile.ts` only if required by the copied wrappers
- Create: `apps/web/components.json`
- Create tests: `button.test.tsx`, `dialog.test.tsx`, and `table.test.tsx` beside their components
- Modify: `apps/web/package.json`, `apps/web/src/app/globals.css`

**Interfaces:**
- Components are imported from `@/_shared/ui/<component>` and keep the API of the Smart Stock wrappers.
- Styling uses Tailwind 4 tokens, `cn`, and Base UI; no second component framework is introduced.

- [ ] **Step 1: Write component tests** asserting button accessible name/disabled behavior, dialog opens and closes from the keyboard, and table headers/cells render with semantic table roles.
- [ ] **Step 2: Run the focused tests** with `pnpm --filter @smart-base/web exec vitest run src/_shared/ui/button.test.tsx src/_shared/ui/dialog.test.tsx src/_shared/ui/table.test.tsx`; confirm they fail because the components are not present.
- [ ] **Step 3: Port the 23 reusable wrappers** from Smart Stock, remove brand/product imports, add only dependencies referenced by those components, and include the small `cn` utility/mobile hook only where required.
- [ ] **Step 4: Run focused component tests, `pnpm lint`, and `pnpm typecheck`**; expected result: all pass with no app-specific dependency imports.

## Task 4: Add the typed API fetch pattern

**Files:**
- Create: `apps/web/src/_shared/api/fetch-json.ts`
- Create: `apps/web/src/_shared/api/fetch-json.test.ts`
- Modify: `apps/web/package.json` only if a required schema dependency is not already present

**Interfaces:**
- `fetchJson<T>(options: FetchJsonOptions<T>): Promise<T>`
- Options: `url`, `schema.parse(unknown)`, `errorMessage`, optional `method` (`GET | POST | PUT`), `body`, injected `fetchImpl`, `signal`, `cache`, and `acceptResponse`.

- [ ] **Step 1: Write tests** for a successful typed response, JSON request body and content-type, non-OK response rejection, accepted status override, invalid JSON, schema rejection, injected abort signal, and the 5-second default timeout.
- [ ] **Step 2: Run `pnpm --filter @smart-base/web exec vitest run src/_shared/api/fetch-json.test.ts`**; confirm the tests fail because `fetchJson` is missing.
- [ ] **Step 3: Implement `fetchJson`** with the source pattern's 5-second default timeout, injected `fetch`, JSON parsing, and schema validation; normalize parse failures to the caller's safe error message without including response contents.
- [ ] **Step 4: Re-run the focused API tests and all three quality commands**; expected result: pass without network access.

## Task 5: Add a server-only AI text service

**Files:**
- Create: `apps/web/src/_entities/ai/server/ai-config.ts`, `apps/web/src/_entities/ai/server/ai-text-service.ts`, `apps/web/src/_entities/ai/index.server.ts`
- Create: `apps/web/src/_entities/ai/server/ai-text-service.test.ts`
- Create: `.env.example`
- Modify: `apps/web/package.json`

**Interfaces:**
- `readAiConfig(env: NodeJS.ProcessEnv): AiConfig` validates `AI_API_KEY`, `AI_MODEL`, and optional `AI_BASE_URL`.
- `createAiTextService(model: AiTextModel)` returns `generateText({ systemPrompt, userPrompt, signal? }): Promise<string>`.
- `createConfiguredAiTextService(env, modelFactory?)` validates config before constructing a model; the default factory uses `ChatOpenAI` from `@langchain/openai`, and tests inject a fake model factory/model.

- [ ] **Step 1: Write tests** for missing credentials, invalid/unsafe base URL, model factory not called on invalid config, successful fake-model output, provider rejection, and abort propagation.
- [ ] **Step 2: Run `pnpm --filter @smart-base/web exec vitest run src/_entities/ai/server/ai-text-service.test.ts`**; confirm the tests fail before the service is implemented.
- [ ] **Step 3: Implement env validation and the injectable server-only service**. Permit HTTPS provider URLs and loopback HTTP only for local development; reject URL-embedded credentials; never expose the key or model object to client modules.
- [ ] **Step 4: Add placeholder variable names to `.env.example`** and document that no key is required for build or tests.
- [ ] **Step 5: Run focused AI tests, lint, and typecheck**; expected result: all pass with fake models and no provider request.

## Task 6: Add Codex guidance and Vietnamese documentation

**Files:**
- Create: `AGENTS.md`
- Create: `.codex/AGENT.md`, `.codex/project-state.md`, `.codex/README.md`
- Create: `.agents/skills/feature-development/SKILL.md`
- Create: `docs/architecture.md`, `docs/ui-components.md`, `docs/api.md`, `docs/ai-service.md`, `docs/codex.md`, `docs/testing.md`
- Modify: root `README.md`

**Interfaces:**
- Root `AGENTS.md` is the durable repository entry point and links to the docs and focused skill.
- `.codex/AGENT.md` owns implementation workflow details; `.codex/project-state.md` describes the blank-domain starter state.
- The feature-development skill triggers only when adding a product feature to this starter.

- [ ] **Step 1: Write the root README and architecture guide** with quick start, exact commands, FSD layer ownership, and the rule to add packages only when shared code exists.
- [ ] **Step 2: Document UI, API, and AI patterns** with imports and short examples that match the implemented interfaces; explicitly state the server-only and auth/rate-limit requirements before exposing AI.
- [ ] **Step 3: Add Codex files and one concise skill**. Keep model, approval, and sandbox choices user-owned; do not add an empty config or plugin marketplace.
- [ ] **Step 4: Review all Markdown links, paths, commands, and examples** against the final tree; run `git diff --check`.

## Task 7: Add a browser smoke test and verify the complete base

**Files:**
- Create: `apps/web/playwright.config.ts`, `apps/web/e2e/home.spec.ts`
- Modify: root and web `package.json`, `turbo.json`, `README.md`, `docs/testing.md`

**Interfaces:**
- `pnpm test:e2e` runs separately from the fast unit/component suite and starts the app without a database or AI credentials.

- [ ] **Step 1: Write the Playwright smoke test** that opens `/` and checks the “Smart Base” heading and main landmark.
- [ ] **Step 2: Run `pnpm test:e2e`**; install Chromium with `pnpm exec playwright install chromium` only if the browser is missing.
- [ ] **Step 3: Run final checks**: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, and `pnpm build`.
- [ ] **Step 4: Inspect the full tree and `git diff --check`**; confirm no `.env`, product-domain files, database/auth code, or live AI requests were added.
