# Codex and Agent Workflow

Codex reads repository guidance in this order:

1. [`AGENTS.md`](../AGENTS.md): durable repository rules.
2. [`.codex/AGENT.md`](../.codex/AGENT.md): how to make changes in the starter.
3. [`.codex/project-state.md`](../.codex/project-state.md): current domain and project state.
4. [`.agents/skills/feature-development/SKILL.md`](../.agents/skills/feature-development/SKILL.md): workflow for adding product features.

Before making a change, identify the layer that owns the code, read the relevant module and tests, write a test first for new behavior, then run the appropriate lint/typecheck/test/build commands. Afterward, update documentation if a contract or structure changed. See [testing](testing.md).

For persisted features, use [`database.md`](database.md) and keep schema/migration work separate from repository/business logic. For background work, follow the per-worker workspace convention in [`apps/workers/README.md`](../apps/workers/README.md).

The repository intentionally does not set a default model, approval policy, sandbox, or plugin marketplace. Those choices belong to each user's environment; do not commit credentials or personal configuration to the starter.

When copying the starter for a new product, update `project-state.md`, `README.md`, and the domain documentation before asking an agent to build the first feature.

