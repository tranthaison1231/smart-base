import { afterEach, describe, expect, it, vi } from "vitest"

import { logger } from "./logger"

describe("logger", () => {
  afterEach(() => vi.restoreAllMocks())

  it.each([
    ["info", 30, "stdout"],
    ["warn", 40, "stderr"],
    ["error", 50, "stderr"],
  ] as const)("writes %s as structured JSON", (level, severity, stream) => {
    const output = vi.spyOn(process[stream], "write").mockImplementation(() => true)

    logger[level]({ event: "operation.completed", requestId: "123" })

    expect(output).toHaveBeenCalledOnce()
    expect(JSON.parse(String(output.mock.calls[0][0]))).toMatchObject({
      level: severity,
      event: "operation.completed",
      requestId: "123",
    })
  })
})
