import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"

import { createProject } from "./scaffold.mjs"

const temporaryDirectories = []

async function directory() {
  const dir = await mkdtemp(path.join(tmpdir(), "smart-base-test-"))
  temporaryDirectories.push(dir)
  return dir
}

async function exists(file) {
  try {
    await readFile(file)
    return true
  } catch (error) {
    if (error.code === "ENOENT") return false
    throw error
  }
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  )
})

describe("createProject", () => {
  it.each([
    [["web"], true, false, false],
    [["mobile"], false, true, false],
    [["web", "mobile"], true, true, true],
  ])("creates only the requested workspaces for %j", async (platforms, web, mobile, api) => {
    const root = await directory()
    const project = await createProject({ root, name: "my-product", platforms })

    expect(project).toBe(path.join(root, "my-product"))
    expect(await exists(path.join(project, "apps/web/package.json"))).toBe(web)
    expect(await exists(path.join(project, "apps/mobile/package.json"))).toBe(mobile)
    expect(await exists(path.join(project, "apps/api/package.json"))).toBe(api)
    expect(await readFile(path.join(project, ".gitignore"), "utf8")).toContain(".env")
    expect(await exists(path.join(project, "infra/.gitignore"))).toBe(web)
    const manifest = JSON.parse(await readFile(path.join(project, "package.json"), "utf8"))
    expect(manifest.name).toBe("my-product")
    expect(manifest.scripts["create:app"]).toBeUndefined()
    expect(manifest.scripts.dev).toContain(web ? "@smart-base/web" : "@smart-base/mobile")
    expect(await exists(path.join(project, "pnpm-lock.yaml"))).toBe(web && !mobile)
    if (web) {
      expect(await readFile(path.join(project, ".codex/project-state.md"), "utf8")).not.toContain(
        "create-smart-base",
      )
      expect(await readFile(path.join(project, "AGENTS.md"), "utf8")).not.toContain(
        "packages/create-smart-base",
      )
      expect(await readFile(path.join(project, "README.md"), "utf8")).not.toContain(
        "packages/create-smart-base",
      )
      expect(await readFile(path.join(project, "docs/testing.md"), "utf8")).not.toContain(
        "packages/create-smart-base",
      )
    }
    if (mobile) {
      const config = JSON.parse(await readFile(path.join(project, "apps/mobile/app.json"), "utf8"))
      expect(config.expo.slug).toBe("my-product")
      expect(config.expo.name).toBe("my-product")
    }
    if (api) {
      expect(manifest.scripts["dev:api"]).toContain("@smart-base/api")
      expect(await readFile(path.join(project, ".codex/project-state.md"), "utf8")).toContain(
        "apps/mobile",
      )
      expect(await readFile(path.join(project, "README.md"), "utf8")).toContain("pnpm dev:api")
      expect(await readFile(path.join(project, "docs/mobile.md"), "utf8")).toContain(
        "This product includes an Expo app",
      )
      expect(await readFile(path.join(project, "docs/mobile.md"), "utf8")).not.toContain(
        "create `apps/mobile`",
      )
      expect(await readFile(path.join(project, "docs/architecture.md"), "utf8")).not.toContain(
        "An independent API is not included",
      )
      expect(await readFile(path.join(project, "docs/deployment.md"), "utf8")).not.toContain(
        "This starter does not include an API workspace",
      )
    }
  })

  it("rejects invalid names, empty or unknown selections", async () => {
    const root = await directory()
    for (const [name, platforms] of [
      ["../other", ["web"]],
      ["My App", ["web"]],
      ["app", []],
      ["app", ["other"]],
    ]) {
      await expect(createProject({ root, name, platforms })).rejects.toThrow()
    }
  })

  it("does not overwrite an existing directory", async () => {
    const root = await directory()
    const target = path.join(root, "already-here")
    await mkdir(target)
    await writeFile(path.join(target, "important.txt"), "keep")
    await expect(
      createProject({ root, name: "already-here", platforms: ["web"] }),
    ).rejects.toThrow()
    expect(await readFile(path.join(target, "important.txt"), "utf8")).toBe("keep")
  })
})
