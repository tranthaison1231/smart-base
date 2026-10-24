import { ESLint } from "eslint"
import { describe, expect, it } from "vitest"

const eslint = new ESLint({ cwd: process.cwd() })

async function restrictedImports(source: string, filePath = "src/_shared/api/boundary-probe.ts") {
  const [result] = await eslint.lintText(source, {
    filePath,
  })

  return result.messages.filter((message) => message.ruleId === "no-restricted-imports")
}

describe("FSD import boundaries", () => {
  it.each([
    ["layer alias", 'import "@/_entities/ai/index.server"', "src/_shared/api/boundary-probe.ts"],
    [
      "relative layer path",
      'import "../../_entities/ai/index.server"',
      "src/_shared/api/boundary-probe.ts",
    ],
    ["Next app route", 'import "@/app/page"', "src/_shared/api/boundary-probe.ts"],
    ["Next app route from app providers", 'import "@/app/page"', "src/_app/providers.ts"],
  ])("rejects a forbidden %s import", async (_description, source, filePath) => {
    expect(await restrictedImports(source, filePath)).not.toHaveLength(0)
  })
})
