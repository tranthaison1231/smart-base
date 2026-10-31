#!/usr/bin/env node
import { spawn } from "node:child_process"
import * as prompt from "@clack/prompts"

import { run } from "../src/cli.mjs"
import { installProject } from "../src/install.mjs"
import { createProject } from "../src/scaffold.mjs"

process.exitCode = await run({
  prompt,
  create: createProject,
  install: (cwd) => installProject({ cwd, spawn }),
  root: process.cwd(),
})
