# Start a product from Smart Base

Use this checklist in a new copy of the repository. The starter contains no product domain or production service credentials.

## 1. Identify the product

- [ ] Choose the repository and product names. Complete the [product brief template](product-brief.md) for the first workflow and share it with the coding agent.
- [ ] Update `.codex/project-state.md` with the product goal, domain, current integrations, and real deployment decisions. Update the root `AGENTS.md` introduction when the product is no longer domain-neutral; retain the rules that still apply.
- [ ] Replace the starter description in `README.md`. Update the page content in `apps/web/src/app/page.tsx`, metadata and language in `apps/web/src/app/layout.tsx`, and the related unit and browser test expectations.

## 2. Name the workspaces

The root package is `smart-base`; the web and database workspaces are `@smart-base/web` and `@smart-base/database`. Renaming them is a deliberate choice, not required for the app to run. If renaming:

- [ ] Change package names in the root, `apps/web/package.json`, and `packages/database/package.json` together.
- [ ] Update root `pnpm --filter` scripts and every actual workspace dependency, import, test, CI command, and documentation example that uses the old names. The database workspace is not currently an app dependency; add it only when needed.
- [ ] Search for old references with `rg -n --hidden -g '!.git' -g '!node_modules' -g '!pnpm-lock.yaml' '(@smart-base/|smart-base|Smart Base)' .`. Review each match rather than replacing blindly: historical plans, examples, and generated files may need different treatment.
- [ ] Run `pnpm install` to regenerate the lockfile after changing package names; review the diff and then confirm `pnpm install --frozen-lockfile` succeeds.

## 3. Configure only what the product uses

- [ ] Keep `.env.example` as the list of non-secret names and placeholders. Database and AI values are optional for the starter; set real credentials locally and in the hosting provider only when the product uses those integrations. Never commit secrets.
- [ ] Add the first real feature and its domain in the owning FSD layers. Use the [feature workflow](../.agents/skills/feature-development/SKILL.md) and existing UI and data helpers before introducing new dependencies.
- [ ] Configure Vercel, Workers, queues, Redis, or Terraform only for real needs. Follow the [deployment guide](deployment.md), [Worker guide](../apps/workers/README.md), and [infrastructure guide](../infra/README.md).

## 4. Verify the new project

Run from the repository root after installing dependencies:

```bash
pnpm format:check
pnpm lint
pnpm knip
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

Start the app with `pnpm dev` and check the first workflow in a browser. The Playwright configuration uses port 3100 and may reuse an existing server outside CI: make sure that server belongs to this checkout. A second Next.js dev server in the same checkout can conflict with the existing server's lock; stop the first one before starting the test server. Install Chromium as described in the [testing guide](testing.md) if necessary.

After deployment is configured, verify the preview deployment and environment-specific secrets separately. Local checks do not prove that the cloud deployment or external integrations work.
