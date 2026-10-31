import path from "node:path"

const ignored = new Set([
  ".git",
  ".next",
  ".turbo",
  ".vercel",
  ".wrangler",
  ".expo",
  "node_modules",
  "coverage",
  "dist",
  "build",
  "playwright-report",
  "test-results",
])

export function includeTemplatePath(entry) {
  const name = path.basename(entry)
  if (entry.split(path.sep).some((part) => ignored.has(part))) return false
  if (name.startsWith(".env") && name !== ".env.example") return false
  if (name.startsWith(".dev.vars") && name !== ".dev.vars.example") return false
  if (name === ".npmrc" || /\.(pem|key|p12)$/.test(name)) return false
  return !name.endsWith(".tsbuildinfo")
}
