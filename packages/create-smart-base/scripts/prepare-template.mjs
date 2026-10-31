import { cp, mkdir, rename, rm } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { includeTemplatePath } from "../src/template-filter.mjs"

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const repositoryRoot = path.resolve(packageRoot, "../..")
const destination = path.join(packageRoot, "templates/base")
const paths = [
  ".agents",
  ".codex",
  ".github",
  ".env.example",
  ".prettierignore",
  ".prettierrc.json",
  "AGENTS.md",
  "README.md",
  "apps/web",
  "apps/workers",
  "docs",
  "drizzle",
  "drizzle.config.ts",
  "infra",
  "knip.jsonc",
  "package.json",
  "packages/README.md",
  "packages/database",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "tsconfig.json",
  "turbo.json",
]
await rm(destination, { recursive: true, force: true })
await mkdir(destination, { recursive: true })
for (const item of paths) {
  const from = path.join(repositoryRoot, item)
  const to = path.join(destination, item)
  await mkdir(path.dirname(to), { recursive: true })
  await cp(from, to, {
    recursive: true,
    filter: (entry) => includeTemplatePath(path.relative(repositoryRoot, entry)),
  })
}
await cp(path.join(repositoryRoot, ".gitignore"), path.join(destination, "gitignore.template"))
await rename(
  path.join(destination, "infra/.gitignore"),
  path.join(destination, "infra/gitignore.template"),
)
