import { EventEmitter } from "node:events"
import { describe, expect, it, vi } from "vitest"

import { installProject } from "./install.mjs"

function spawnWith(results) {
  return vi.fn(() => {
    const child = new EventEmitter()
    const result = results.shift()
    queueMicrotask(() => child.emit(result === "error" ? "error" : "exit", result))
    return child
  })
}

describe("installProject", () => {
  it("installs dependencies and formats the generated product", async () => {
    const spawn = spawnWith([0, 0])
    await installProject({ cwd: "/tmp/project", spawn })
    expect(spawn).toHaveBeenNthCalledWith(1, "pnpm", ["install"], {
      cwd: "/tmp/project",
      stdio: "inherit",
    })
    expect(spawn).toHaveBeenNthCalledWith(2, "pnpm", ["format"], {
      cwd: "/tmp/project",
      stdio: "inherit",
    })
  })

  it.each([
    [["error"], "Could not run pnpm"],
    [[1], "pnpm install failed"],
    [[0, 1], "pnpm format failed"],
  ])("reports a failed command", async (results, message) => {
    await expect(
      installProject({ cwd: "/tmp/project", spawn: spawnWith(results) }),
    ).rejects.toThrow(message)
  })
})
