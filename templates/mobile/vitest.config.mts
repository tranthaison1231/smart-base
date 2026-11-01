import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["**/*.test.{ts,tsx}", "src/test/**", "**/*.d.ts"],
      thresholds: { lines: 100, statements: 100, functions: 100, branches: 100 },
    },
  },
})
