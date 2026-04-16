---
name: next-shell-contributor
description: Workflow, branching, commit, and PR conventions for the jonmatum/next-shell monorepo. Use this skill whenever starting new work on this repo, picking up a phase from the extraction plan (issue #13), authoring commit messages, or opening pull requests. Defines how to map tracking issues to branches and how to structure verification runs before committing.
license: MIT (same as the surrounding repo)
---

# Contributing to `@jonmatum/next-shell`

`next-shell` is a design-system + app-shell extraction from Smart Pad Rules. It's rolling out in phases tracked by the meta-issue [#13](https://github.com/jonmatum/next-shell/issues/13). This skill is the runbook for contributing to it.

## Phase model

Each phase has its own tracking issue and its own branch:

| Phase | Topic                                       | Tracking issue        |
| ----: | ------------------------------------------- | --------------------- |
|     0 | Monorepo scaffold + CI + publishing         | `#1`                  |
|     1 | Tokens + Tailwind preset + CSS variables    | `#2`                  |
|     2 | ThemeProvider + useTheme + ThemeToggle      | `#3`                  |
|     3 | shadcn primitives (Button, Dialog, etc.)    | `#4`                  |
|     4 | Layout primitives + AppShell                | `#5`                  |
|     5 | Auth primitives (useSession, guards)        | `#6`                  |
|     6 | Providers composer (Query, Toast, Errors)   | `#7`                  |
|     7 | Hooks grab-bag (useDebounce, useMedia, …)   | `#8`                  |
|     8 | Utilities (`cn`, formatters, guards)        | `#9`                  |
|     9 | Docs site + Storybook                       | `#10`                 |
|    10 | Publishing + changeset release workflow     | `#11`                 |
|    11 | Integration back into Smart Pad Rules       | `#12`                 |

Refer to [#13](https://github.com/jonmatum/next-shell/issues/13) for the authoritative breakdown — the numbers above may shift as issues are reorganized.

## Branch naming

- **Phase PRs**: `claude/phase-N-<slug>`  — e.g. `claude/phase-2-theme-provider`, `claude/phase-3-primitives-button-dialog`.
- **Chore / cross-cutting**: `claude/chore-<slug>` — e.g. `claude/chore-skills-shadcn-mcp-anthropic`.
- **Fix PRs**: `claude/fix-<slug>` — e.g. `claude/fix-theme-toggle-dropdown-a11y`.

Start every branch off the latest `main` unless you're explicitly stacking on another open PR.

## Commit conventions

Use conventional-commit style scoped by phase when applicable:

```
feat(phase-2): ThemeProvider, useTheme, ThemeToggle, and SSR cookie helpers
fix(primitives): Dialog close button focus trap regression
chore(skills): vendor Anthropic frontend-design + webapp-testing
docs(tokens): document brand-override API with copy-paste example
refactor(layout): collapse AppShell grid variants into cva
```

The first line is ≤ 72 characters. The body explains the **why**, lists the public surface added, and calls out anything deliberately excluded ("dropdown variant deferred to Phase 3"). Close issues with `Closes #N` and reference the meta-issue with `Refs #13`.

## PR conventions

- Open PRs as **draft** first. Flip to "ready" only after CI is green.
- Title mirrors the commit: `feat(phase-2): ThemeProvider, useTheme, ThemeToggle + SSR cookie helpers`.
- Body structure:
  1. One-line summary + issue links (`Closes #3 · Refs #13`)
  2. "What's in the box" — public API with short code samples
  3. "What is intentionally NOT in this PR" — defer items to avoid scope creep
  4. "Verification" — paste the lint/typecheck/test/build results
  5. Checklist (no raw colors, light + dark both work, SSR-safe, etc.)

Use `mcp__github__create_pull_request` from this session — GitHub MCP is restricted to `jonmatum/next-shell`, so there's no risk of opening PRs elsewhere.

## Verification run (run before every commit)

```
pnpm format      # write
pnpm lint        # --max-warnings=0
pnpm typecheck
pnpm test        # vitest run, no watch
pnpm build       # tsup + tailwind preset + DTS
```

Pre-commit runs `lint-staged` via Husky, which formats staged files and runs ESLint on TS/TSX — you still need the full `pnpm test` + `pnpm build` locally because pre-commit only checks changed files.

## Token discipline (the one rule that is NEVER negotiable)

**No raw color literals.** Every color reaches the DOM through the semantic-token CSS variables defined in `packages/next-shell/src/tokens/tokens.css`. The custom `no-raw-colors` ESLint rule in `tools/eslint-plugin-next-shell` enforces this; a regression here will fail CI immediately. If you need a brand-specific value, use the `brand` prop on `ThemeProvider` — don't hardcode it in a component.

See the companion `shadcn-next-shell` skill for the full token catalog and the Tailwind utility ↔ token mapping.

## When things break

- **`pnpm install` complains about peerDeps**: ensure React 19 + Next 15 + Tailwind 4 are installed in the consuming app.
- **`'use client'` directive missing from bundled output**: check the `CLIENT_ENTRIES` allowlist in `packages/next-shell/tsup.config.ts` — the post-build hook only re-prepends directives to listed entries.
- **Vitest can't find `matchMedia`**: the jsdom stub lives in `packages/next-shell/tests/setup.ts`. Avoid `vi.restoreAllMocks()` in `afterEach` — it wipes the stub.
- **Hydration warning in Next.js consumer**: add `suppressHydrationWarning` to the `<html>` element. next-themes writes `data-theme` before hydration; React's default hydration check flags this false positive.
