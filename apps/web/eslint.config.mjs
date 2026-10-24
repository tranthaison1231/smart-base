import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

const forbiddenLayers = {
  _app: ["app"],
  _shared: ["app", "_app", "_pages", "_widgets", "_features", "_entities"],
  _entities: ["app", "_app", "_pages", "_widgets", "_features"],
  _features: ["app", "_app", "_pages", "_widgets"],
  _widgets: ["app", "_app", "_pages"],
  _pages: ["app", "_app"],
}

const layerBoundaries = Object.entries(forbiddenLayers).map(([layer, forbidden]) => ({
  files: [`src/${layer}/**/*.{ts,tsx}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: forbidden.map((name) => ({
          group: [`@/${name}/**`, `**/${name}/**`],
          message: `${layer} cannot import from the higher ${name} layer.`,
        })),
      },
    ],
  },
}))

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  ...layerBoundaries,
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
])
