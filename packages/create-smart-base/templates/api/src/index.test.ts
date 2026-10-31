import { describe, expect, it } from "vitest"
import app from "./index"

describe("API", () => {
  it("returns a health response", async () => {
    const response = await app.request("/health")
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: "ok" })
  })

  it("returns 404 for an unknown route", async () => {
    expect((await app.request("/unknown")).status).toBe(404)
  })
})
