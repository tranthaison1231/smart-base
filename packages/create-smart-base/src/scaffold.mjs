import { cp, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const templates = fileURLToPath(new URL("../templates/", import.meta.url))

export async function createProject({ root, name, platforms }) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name) || name.length > 80) {
    throw new Error("Use a project name with lowercase letters, numbers, and hyphens.")
  }
  if (!platforms.length || platforms.some((platform) => !["web", "mobile"].includes(platform))) {
    throw new Error("Select Web, Mobile, or both.")
  }

  const web = platforms.includes("web")
  const mobile = platforms.includes("mobile")
  const target = path.join(root, name)
  await mkdir(target)
  await cp(path.join(templates, web ? "base" : "mobile-root"), target, { recursive: true })
  await rename(path.join(target, "gitignore.template"), path.join(target, ".gitignore"))
  if (web) {
    await rename(
      path.join(target, "infra/gitignore.template"),
      path.join(target, "infra/.gitignore"),
    )
  }

  const manifestPath = path.join(target, "package.json")
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"))
  manifest.name = name
  delete manifest.scripts["create:app"]
  if (mobile) {
    await cp(path.join(templates, "mobile"), path.join(target, "apps/mobile"), { recursive: true })
    const mobileConfigPath = path.join(target, "apps/mobile/app.json")
    const mobileConfig = JSON.parse(await readFile(mobileConfigPath, "utf8"))
    mobileConfig.expo.name = name
    mobileConfig.expo.slug = name
    mobileConfig.expo.scheme = `sb${name.replaceAll("-", "")}`
    await writeFile(mobileConfigPath, `${JSON.stringify(mobileConfig, null, 2)}\n`)
    manifest.scripts["dev:mobile"] = "pnpm --filter @smart-base/mobile dev"
    await rm(path.join(target, "pnpm-lock.yaml"), { force: true })
  }
  if (web && mobile) {
    await cp(path.join(templates, "api"), path.join(target, "apps/api"), { recursive: true })
    manifest.scripts["dev:api"] = "pnpm --filter @smart-base/api dev"
    manifest.scripts.build = "turbo run build"

    const webManifestPath = path.join(target, "apps/web/package.json")
    const webManifest = JSON.parse(await readFile(webManifestPath, "utf8"))
    webManifest.devDependencies["@types/react"] = "19.2.18"
    webManifest.devDependencies["@types/react-dom"] = "19.2.7"
    await writeFile(webManifestPath, `${JSON.stringify(webManifest, null, 2)}\n`)

    const turboPath = path.join(target, "turbo.json")
    const turbo = JSON.parse(await readFile(turboPath, "utf8"))
    turbo.tasks.build.outputs.push("dist/**")
    turbo.tasks["@smart-base/api#build"] = { outputs: [] }
    await writeFile(turboPath, `${JSON.stringify(turbo, null, 2)}\n`)

    const knipPath = path.join(target, "knip.jsonc")
    const knip = await readFile(knipPath, "utf8")
    await writeFile(
      knipPath,
      knip.replace(
        '    "apps/web": {',
        '    "apps/mobile": { "metro": false, "entry": ["metro.config.cjs"], "ignoreDependencies": ["react-native-css-interop", "expo-updates", "expo-system-ui"] },\n    "apps/web": {',
      ),
    )

    await writeFile(
      path.join(target, ".gitignore"),
      `${await readFile(path.join(target, ".gitignore"), "utf8")}\n.expo/\n`,
    )
  }
  if (web) {
    const readmePath = path.join(target, "README.md")
    let readme = await readFile(readmePath, "utf8")
    readme = readme.replace(/## Create a product\n[\s\S]*?(?=## Getting started)/, "")
    readme = readme
      .replace(", and the `create-smart-base` CLI", mobile ? ", `apps/mobile`, and `apps/api`" : "")
      .replace(
        "├── database/               # Shared server-only PostgreSQL/Drizzle infrastructure\n└── create-smart-base/      # CLI and opt-in product templates",
        "└── database/               # Shared server-only PostgreSQL/Drizzle infrastructure",
      )
      .replace(
        "The CLI is a tool for creating products; it is not copied into generated products. ",
        "",
      )
    if (mobile) {
      readme = readme
        .replace(
          "## Architecture options",
          "## Generated product\n\nThis product includes the web app, an Expo mobile app, and a minimal API. Run `pnpm dev` for web, `pnpm dev:mobile` for mobile, and `pnpm dev:api` for the API. The API exposes only `GET /health`; add product routes and authorization when needed.\n\n## Architecture options",
        )
        .replace(
          "Smart Base currently includes the web app and database package; mobile, a separate API, product business logic, and external services are added when needed.",
          "This product includes web, mobile, a minimal API, and the database package; product business logic and external services are added when needed.",
        )
        .replace(
          "├── web/                    # Next.js app with FSD layers under src/\n└── workers/",
          "├── web/                    # Next.js app with FSD layers under src/\n├── mobile/                 # Expo Router app\n├── api/                    # Minimal Hono API\n└── workers/",
        )
    }
    await writeFile(readmePath, readme)

    const statePath = path.join(target, ".codex/project-state.md")
    let state = await readFile(statePath, "utf8")
    state = state
      .replace(
        "`apps/web`, `packages/database`, and the `create-smart-base` CLI in `packages/create-smart-base`",
        mobile
          ? "`apps/web`, `apps/mobile`, `apps/api`, and `packages/database`"
          : "`apps/web` and `packages/database`",
      )
      .replace("`pnpm dev`, `pnpm create:app`,", "`pnpm dev`,")
      .replace(
        "all three test workspaces",
        mobile ? "all four test workspaces" : "both test workspaces",
      )
      .replace(" The CLI also includes its executable entry point.", "")
    if (mobile)
      state = state.replace(
        "`pnpm dev`, `pnpm format`",
        "`pnpm dev`, `pnpm dev:mobile`, `pnpm dev:api`, `pnpm format`",
      )
    await writeFile(statePath, state)

    const agentsPath = path.join(target, "AGENTS.md")
    const agents = await readFile(agentsPath, "utf8")
    await writeFile(
      agentsPath,
      agents.replace(
        ", and `packages/create-smart-base`",
        mobile ? ", `apps/mobile`, and `apps/api`" : "",
      ),
    )

    const mobileDocsPath = path.join(target, "docs/mobile.md")
    let mobileDocs = await readFile(mobileDocsPath, "utf8")
    mobileDocs = mobileDocs.replace(
      "Smart Base currently runs only a Next.js web app. The [CLI](create-project.md) can generate an Expo app for a product that needs iOS or Android; an installed mobile workspace is not included in this checkout. Keep the web-only setup usable without a mobile toolchain.",
      mobile
        ? "This product includes an Expo app in `apps/mobile` and a separate minimal API in `apps/api`. Run `pnpm dev:mobile` and `pnpm dev:api` from the workspace root. Native builds, authentication, and provider integrations require product-specific setup."
        : "This product currently includes a Next.js web app. Add an Expo app when the product needs iOS or Android.",
    )
    if (mobile) {
      mobileDocs = mobileDocs
        .replace("No API workspace is included; see", "See")
        .replace(
          /## Add Expo to a product\n[\s\S]*?(?=## Boundaries and shared code)/,
          "## Development and styling\n\nRun `pnpm dev:mobile` to start Expo. The mobile app uses Expo Router and NativeWind v4 with Tailwind CSS v3; the web app uses Tailwind CSS v4. Run `pnpm build` to export JavaScript bundles for Android and iOS, and test on both platforms before release. A bundle export is not a signed native build.\n\nConfigure app identifiers, signing, and [EAS Build](https://docs.expo.dev/build/setup/) only when preparing a release. See the [Expo monorepo guide](https://docs.expo.dev/guides/monorepos/) for workspace guidance.\n\n",
        )
    }
    await writeFile(mobileDocsPath, mobileDocs)

    const architecturePath = path.join(target, "docs/architecture.md")
    const architecture = await readFile(architecturePath, "utf8")
    let productArchitecture = architecture.replace(
      "The starter also contains the [`create-smart-base` CLI](create-project.md) under `packages/create-smart-base`; it creates products and is not part of the generated applications.\n\n",
      "",
    )
    if (mobile) {
      productArchitecture = productArchitecture
        .replace(
          "├── web/                    # Current Next.js application\n└── workers/",
          "├── web/                    # Next.js application\n├── mobile/                 # Expo Router application\n├── api/                    # Minimal Hono API\n└── workers/",
        )
        .replace(
          "| `apps/workers/<name>/`",
          "| `apps/mobile/` | Expo Router and NativeWind mobile application |\n| `apps/api/` | Independently deployable Hono API; currently exposes `GET /health` |\n| `apps/workers/<name>/`",
        )
        .replace(
          "An independent API is not included in Smart Base.",
          "This product includes a minimal independent API at `apps/api`; it currently exposes only `GET /health`.",
        )
    }
    await writeFile(architecturePath, productArchitecture)

    if (mobile) {
      const deploymentPath = path.join(target, "docs/deployment.md")
      const deployment = await readFile(deploymentPath, "utf8")
      await writeFile(
        deploymentPath,
        deployment.replace(
          "This starter does not include an API workspace or deploy one.",
          "This product includes a minimal `apps/api` workspace, but it has not been deployed.",
        ),
      )
    }

    const packageDocsPath = path.join(target, "packages/README.md")
    const packageDocs = await readFile(packageDocsPath, "utf8")
    await writeFile(
      packageDocsPath,
      packageDocs.replace(
        " `packages/create-smart-base` contains the project creation CLI and is not copied into generated products.",
        "",
      ),
    )

    const testingPath = path.join(target, "docs/testing.md")
    const testing = await readFile(testingPath, "utf8")
    await writeFile(
      testingPath,
      testing
        .replace(
          /^\| `packages\/create-smart-base`.*\|\n/m,
          mobile
            ? "| `apps/mobile` | Every first-party mobile runtime TypeScript and TSX file |\n| `apps/api` | Every first-party API runtime TypeScript file |\n"
            : "",
        )
        .replace(
          " Generated application templates are validated as generated products, not as CLI runtime modules.",
          "",
        )
        .replace(" The CLI coverage also includes its executable entry point.", ""),
    )

    const knipPath = path.join(target, "knip.jsonc")
    const knip = await readFile(knipPath, "utf8")
    await writeFile(
      knipPath,
      knip.replace(
        '  // These are standalone generated workspaces; validate them after scaffolding.\n  "ignore": ["packages/create-smart-base/templates/**"],\n',
        "",
      ),
    )

    await rm(path.join(target, "docs/create-project.md"))
  }
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  return target
}
