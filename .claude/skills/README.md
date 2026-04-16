# `.claude/skills/`

Claude Code [skills](https://docs.anthropic.com/claude/docs/skills) available to every session in this repo. Some are vendored from the official Anthropic skills repo; two are authored locally for next-shell.

## Vendored from `anthropics/skills`

Source: https://github.com/anthropics/skills — pinned to commit
[`0f7c287eaf0d4fa511cb871bb55e2a7862251fbb`](https://github.com/anthropics/skills/commit/0f7c287eaf0d4fa511cb871bb55e2a7862251fbb) (April 2026, current `main` HEAD at vendor time; the repo has no tagged releases).

Each vendored skill keeps its upstream `LICENSE.txt`. To update, re-copy the folder from the upstream repo and bump the commit SHA above.

| Skill                                        | Why we vendored it                                                   |
| -------------------------------------------- | -------------------------------------------------------------------- |
| [`frontend-design`](./frontend-design)       | Production-grade UI creation; avoids generic AI aesthetics           |
| [`web-artifacts-builder`](./web-artifacts-builder) | Multi-component React + Vite + Tailwind + shadcn/ui scaffolding |
| [`webapp-testing`](./webapp-testing)         | Playwright-based UI testing, screenshots, DOM inspection             |
| [`theme-factory`](./theme-factory)           | Color + typography theming; useful for Tailwind v4 token work        |

We deliberately skipped the non-frontend skills (`algorithmic-art`, `claude-api`, `docx`, `pdf`, `pptx`, `slack-gif-creator`, `xlsx`, `internal-comms`, `doc-coauthoring`, `canvas-design`, `brand-guidelines`, `mcp-builder`, `skill-creator`) — they're not relevant to this package's design-system scope.

## Vendored from `shadcn-ui/ui`

Source: https://github.com/shadcn-ui/ui — pinned to commit
[`84d1d476b1d1c6a01c6eeadd95885ce109969b08`](https://github.com/shadcn-ui/ui/commit/84d1d476b1d1c6a01c6eeadd95885ce109969b08) (April 2026, current `main` HEAD at vendor time).

Upstream `LICENSE.md` (MIT) is preserved inside the skill directory. To update, re-copy `skills/shadcn/` from the upstream repo and bump the commit SHA above.

| Skill                       | Why we vendored it                                                             |
| --------------------------- | ------------------------------------------------------------------------------ |
| [`shadcn`](./shadcn)        | Official shadcn/ui skill — project-aware component add/search/compose/debug via `shadcn@latest` CLI; auto-activates on any project with a `components.json`. Pairs with the `shadcn` MCP server wired in `.mcp.json` |

The skill reads `components.json` (when present) via `npx shadcn@latest info --json` and injects the project's framework, aliases, installed components, icon library, and base library into the assistant's context. Complements our locally-authored [`shadcn-next-shell`](./shadcn-next-shell) skill, which layers next-shell-specific conventions (semantic tokens, client/server split, motion tokens) on top of the upstream shadcn rules.

## Authored locally

| Skill                                                   | Purpose                                                                |
| ------------------------------------------------------- | ---------------------------------------------------------------------- |
| [`shadcn-next-shell`](./shadcn-next-shell)              | Repo-specific rules for vendoring shadcn primitives + semantic tokens  |
| [`next-shell-contributor`](./next-shell-contributor)    | Phase workflow, branching, commit, and PR conventions for this repo    |
