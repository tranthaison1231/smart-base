import { cp, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { includeTemplatePath } from "../src/template-filter.mjs"

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const repositoryRoot = path.resolve(packageRoot, "../..")
const destination = path.join(packageRoot, "templates/base")
const paths = [
  ".codex",
  ".github",
  ".prettierrc.json",
  "AGENTS.md",
  "LICENSE",
  "README.md",
  "pnpm-lock.yaml",
  "tsconfig.json",
  "turbo.json",
]
const templatePaths = [
  "docs",
  ".agents",
  ".env.example",
  "gitignore.template",
  "prettierignore.template",
  "knip.template.jsonc",
  "pnpm-workspace.template.yaml",
  "package.template.json",
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
    filter: (entry) =>
      path.relative(repositoryRoot, entry) !== ".github/workflows/publish-cli.yml" &&
      includeTemplatePath(path.relative(repositoryRoot, entry)),
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
for (const [from, to] of [
  ["prettierignore.template", ".prettierignore"],
  ["knip.template.jsonc", "knip.jsonc"],
  ["pnpm-workspace.template.yaml", "pnpm-workspace.yaml"],
  ["package.template.json", "package.json"],
]) {
  await rename(path.join(destination, from), path.join(destination, to))
}
await rename(
  path.join(destination, "infra/.gitignore"),
  path.join(destination, "infra/gitignore.template"),
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
          .replaceAll("](../../../AGENTS.md", "](../AGENTS.md")
          .replaceAll("](../../../.codex/", "](../.codex/")
          .replaceAll("](../../../.github/", "](../.github/")
          .replaceAll("`templates/base/docs/", "`docs/")
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
