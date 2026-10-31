import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([globalIgnores(["templates/base/**", "coverage/**"])])
