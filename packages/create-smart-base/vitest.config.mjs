import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["src/**/*.test.mjs"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.mjs", "bin/**/*.mjs"],
      exclude: ["src/**/*.test.mjs"],
      thresholds: { lines: 100, statements: 100, functions: 100, branches: 100 },
    },
  },
})
