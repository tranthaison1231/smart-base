import { describe, expect, it, vi } from "vitest"

import { run } from "./cli.mjs"

function prompts(answers) {
  return {
    intro: vi.fn(),
    multiselect: vi.fn(async () => answers.platforms),
    text: vi.fn(async () => answers.name),
    isCancel: (value) => value === Symbol.for("cancel"),
    cancel: vi.fn(),
    outro: vi.fn(),
    log: { error: vi.fn() },
  }
}

describe("CLI", () => {
  it("asks for platforms first, creates the project, and installs it", async () => {
    const prompt = prompts({ platforms: ["web", "mobile"], name: "my-app" })
    const create = vi.fn(async () => "/projects/my-app")
    const install = vi.fn(async () => {})
    expect(await run({ prompt, create, install, root: "/projects" })).toBe(0)
    expect(prompt.multiselect.mock.invocationCallOrder[0]).toBeLessThan(
      prompt.text.mock.invocationCallOrder[0],
    )
    expect(create).toHaveBeenCalledWith({
      root: "/projects",
      name: "my-app",
      platforms: ["web", "mobile"],
    })
    expect(install).toHaveBeenCalledWith("/projects/my-app")
    expect(prompt.outro).toHaveBeenCalled()
  })

  it.each(["platforms", "name"])("stops cleanly when %s selection is cancelled", async (field) => {
    const prompt = prompts({ platforms: ["web"], name: "app", [field]: Symbol.for("cancel") })
    const create = vi.fn()
    expect(await run({ prompt, create, install: vi.fn(), root: "/projects" })).toBe(0)
    expect(create).not.toHaveBeenCalled()
    expect(prompt.cancel).toHaveBeenCalled()
  })

  it.each(["create", "install"])("reports a %s failure", async (failure) => {
    const prompt = prompts({ platforms: ["web"], name: "app" })
    const create = vi.fn(async () => {
      if (failure === "create") throw new Error("create failed")
      return "/projects/app"
    })
    const install = vi.fn(async () => {
      if (failure === "install") throw new Error("install failed")
    })
    expect(await run({ prompt, create, install, root: "/projects" })).toBe(1)
    expect(prompt.log.error).toHaveBeenCalledWith(`${failure} failed`)
  })
})
