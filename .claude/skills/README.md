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

## Authored locally

| Skill                                                   | Purpose                                                                |
| ------------------------------------------------------- | ---------------------------------------------------------------------- |
| [`shadcn-next-shell`](./shadcn-next-shell)              | Repo-specific rules for vendoring shadcn primitives + semantic tokens  |
| [`next-shell-contributor`](./next-shell-contributor)    | Phase workflow, branching, commit, and PR conventions for this repo    |
