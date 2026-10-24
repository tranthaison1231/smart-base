# Implementation Workflow

- Start with [project-state.md](project-state.md), the repository guidance in `AGENTS.md`, and the relevant module tests.
- Choose layers according to `docs/architecture.md`; keep routes thin and respect FSD boundaries.
- Write behavior tests before adding logic. Prefer the existing dependency injection patterns over new mock infrastructure.
- Reuse `_shared/ui`, `fetchJson`, and the existing AI service when their contracts fit. Never call external APIs from client code.
- Keep errors at trust boundaries clear; do not log or return secrets or upstream payloads.
- Keep database access in `packages/database` and server-only modules. Review generated Drizzle SQL before applying migrations; never point setup or tests at production.
- Put each real background workload in its own `apps/workers/<name>/` workspace. Do not create a no-op worker.
- After changes, run the relevant commands from `docs/testing.md`. Run all quality checks before declaring a feature complete.
- Update documentation when paths, contracts, or operations change. Do not add Codex model, approval, or sandbox configuration to the repository.

