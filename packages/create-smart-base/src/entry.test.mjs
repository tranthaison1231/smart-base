import { describe, expect, it, vi } from "vitest"

vi.mock("@clack/prompts", () => ({}))
vi.mock("node:child_process", () => ({ spawn: vi.fn() }))
vi.mock("./cli.mjs", () => ({
  run: vi.fn(async ({ install }) => {
    await install("/tmp/product")
    return 0
  }),
}))
vi.mock("./install.mjs", () => ({ installProject: vi.fn() }))
vi.mock("./scaffold.mjs", () => ({ createProject: vi.fn() }))

describe("CLI entry point", () => {
  it("connects the prompts, creator, and package installer", async () => {
    await import("../bin/create-smart-base.mjs")
    const { installProject } = await import("./install.mjs")
    expect(installProject).toHaveBeenCalledWith(expect.objectContaining({ cwd: "/tmp/product" }))
  })
})
