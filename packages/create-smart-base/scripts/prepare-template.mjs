import { cp, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises"
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
  "docs",
  "knip.jsonc",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "tsconfig.json",
  "turbo.json",
]
const templatePaths = [
  "apps/web",
  "apps/workers",
  "drizzle",
  "drizzle.config.ts",
  "infra",
  "packages/README.md",
  "packages/database",
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
for (const item of templatePaths) {
  const from = path.join(repositoryRoot, "templates/base", item)
  const to = path.join(destination, item)
  await mkdir(path.dirname(to), { recursive: true })
  await cp(from, to, {
    recursive: true,
    filter: (entry) => includeTemplatePath(path.relative(repositoryRoot, entry)),
  })
}
for (const item of ["mobile", "mobile-root", "api"]) {
  await cp(
    path.join(repositoryRoot, "templates", item),
    path.join(packageRoot, "templates", item),
    { recursive: true },
  )
}
await cp(path.join(repositoryRoot, ".gitignore"), path.join(destination, "gitignore.template"))
await rename(
  path.join(destination, "infra/.gitignore"),
  path.join(destination, "infra/gitignore.template"),
)
const manifestPath = path.join(destination, "package.json")
const manifest = JSON.parse(await readFile(manifestPath, "utf8"))
manifest.scripts["db:generate"] = "drizzle-kit generate"
manifest.scripts["db:migrate"] = "drizzle-kit migrate"
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
const workspacePath = path.join(destination, "pnpm-workspace.yaml")
await writeFile(
  workspacePath,
  (await readFile(workspacePath, "utf8"))
    .replaceAll("templates/base/apps/", "apps/")
    .replace("  - templates/base/packages/*\n", ""),
)
const knipPath = path.join(destination, "knip.jsonc")
await writeFile(
  knipPath,
  (await readFile(knipPath, "utf8"))
    .replace('"templates/base/apps/web"', '"apps/web"')
    .replace(
      /  \/\/ These are standalone generated workspaces; validate them after scaffolding\.\n  "ignore": \[[\s\S]*?\],\n/,
      "",
    ),
)
for (const item of ["AGENTS.md", ".codex/project-state.md", "README.md"]) {
  const file = path.join(destination, item)
  let contents = (await readFile(file, "utf8")).replaceAll("templates/base/", "")
  if (item === "AGENTS.md")
    contents = contents.replace(
      "Starter source paths such as `apps/web` and `packages/database` are under `` in this repository. Generated products place them at the workspace root.\n\n",
      "",
    )
  if (item === "README.md")
    contents = contents.replace(/## Repository structure\n[\s\S]*?(?=## Structure)/, "")
  if (item === ".codex/project-state.md") {
    contents = contents.replace(
      "pnpm/Turborepo monorepo; starter sources live in `templates/base`, and Mobile and API templates live in `templates/mobile` and `templates/api`.",
      "pnpm/Turborepo monorepo; web app at `apps/web`, future independent worker packages under `apps/workers/*`, and shared infrastructure under `packages/*`.",
    )
    contents = contents.replace(
      "Current workspace packages are `apps/web`, `packages/database`, and the `create-smart-base` CLI in `packages/create-smart-base`. The workers directory has guidance only; no worker package is included.",
      "Current workspace packages are `apps/web`, `packages/database`, and the `create-smart-base` CLI in `packages/create-smart-base`. `apps/workers/` has guidance only; no worker package is included.",
    )
  }
  await writeFile(file, contents)
}
async function normalizeLinks(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) await normalizeLinks(file)
    else if (entry.name.endsWith(".md")) {
      const contents = await readFile(file, "utf8")
      await writeFile(
        file,
        contents
          .replaceAll("](../templates/base/", "](../")
          .replaceAll("](templates/base/", "](")
          .replace(
            "Paths such as `apps/web` and `packages/database` below describe a generated product. In this repository their source lives under `templates/base/`; the CLI is maintained separately in `packages/create-smart-base/`.\n\n",
            "",
          )
          .replace(
            "In this repository the web and database workspaces are under `templates/base/`; generated products place them at `apps/web` and `packages/database`.\n\n",
            "",
          ),
      )
    }
  }
}
await normalizeLinks(path.join(destination, "docs"))
await normalizeLinks(path.join(destination, ".codex"))
for (const [item, from, to] of [
  ["apps/workers/README.md", "](../../../../docs/", "](../../docs/"],
  ["packages/README.md", "](../../../docs/", "](../docs/"],
  ["infra/README.md", "](../../../docs/", "](../docs/"],
]) {
  const file = path.join(destination, item)
  await writeFile(file, (await readFile(file, "utf8")).replaceAll(from, to))
}
