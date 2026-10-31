import { describe, expect, it } from "vitest"
import { includeTemplatePath } from "./template-filter.mjs"

describe("template packaging", () => {
  it.each([
    ["/repo/apps/web/src/page.tsx", true],
    ["/repo/.env.example", true],
    ["/repo/apps/worker/.dev.vars.example", true],
    ["/repo/apps/web/.env.local", false],
    ["/repo/apps/web/.env", false],
    ["/repo/apps/web/.npmrc", false],
    ["/repo/apps/web/private.pem", false],
    ["/repo/apps/worker/.dev.vars", false],
    ["/repo/apps/web/node_modules/a.js", false],
    ["/repo/apps/web/.next/a.js", false],
    ["/repo/apps/mobile/.expo/a.js", false],
    ["/repo/apps/web/cache.tsbuildinfo", false],
  ])("filters %s", (file, expected) => {
    expect(includeTemplatePath(file)).toBe(expected)
  })
})
