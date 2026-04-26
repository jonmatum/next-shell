# CLAUDE.md

Onboarding notes for Claude Code sessions working on `jonmatum/next-shell`.
Skim the sections most relevant to the task at hand; the authoritative
source for each topic is the linked skill / file / issue.

## What this repo is

`@jonmatum/next-shell` is a Next.js + shadcn/ui **app shell + design-system
extraction** from the Smart Pad Rules codebase. It's a pnpm monorepo that
publishes a single package:

- [`packages/next-shell/`](./packages/next-shell) — the library
- [`tools/eslint-plugin-next-shell/`](./tools/eslint-plugin-next-shell) —
  custom ESLint rules (`no-raw-colors` is the ground-truth enforcer of the
  semantic-token system)

The rollout is tracked by meta-issue
[#13](https://github.com/jonmatum/next-shell/issues/13) and phased
sub-issues #1 through #12. Every phase lands on its own branch and PR.

## Hard rules — never negotiable

1. **No raw color literals in library code.** Every color reaches the DOM
   through the semantic-token CSS variables declared in
   `packages/next-shell/src/styles/tokens.css`. The `next-shell/no-raw-colors`
   ESLint rule fails CI immediately on regressions. If a new token is
   genuinely needed, add it to `tokens.css` + `preset.css` + the
   `colorTokens` literal array in `src/tokens/index.ts` **first**, update
   tests, then use it.
2. **Client/server boundaries are explicit.** Client components get
   `'use client'` at the top of their source file. The tsup post-build
   hook re-prepends `'use client'` to `dist/<subpath>/index.{js,cjs}`
   for every entry in the `CLIENT_ENTRIES` allowlist in
   `packages/next-shell/tsup.config.ts`. When a new top-level subpath
   entry is a client module, add it to that list.
3. **Server-safe helpers live under `<subpath>/server/`.** See
   `src/providers/server/` — cookie readers importable from a Server
   Component without forcing a client boundary.
4. **Radix primitives are the default substrate.** Don't substitute
   homegrown equivalents without discussing trade-offs first.
5. **Accessibility is non-negotiable.** Every interactive primitive has
   an accessible name; focus rings are token-driven
   (`focus-visible:ring-ring`); Radix semantics (roles, keyboard nav)
   are preserved.

## Standing session rules

### Auto-merge green + approved PRs

When a PR the session just opened reaches **CI green + AI auto-approval**,
flip it from draft to ready-for-review and squash-merge without pausing
for human confirmation. The user has standing authorization; pausing on
every green PR wastes round-trips. Then:

1. `git checkout main`
2. `git pull origin main`
3. Continue with the next slice on a fresh branch.

Applies only to PRs the current session authored on a `claude/*` branch.
Does NOT apply to PRs opened by others, PRs with unresolved review
comments, or PRs still red/yellow in CI. If an AI review is NOT
auto-approved or a human reviewer leaves comments, pause and address them
before merging.

### Destructive-action confirmation still applies

The auto-merge rule is **specific to PR merges** on this repo. It does
NOT relax confirmation requirements for other destructive actions
(`git reset --hard`, force push, `rm -rf`, dropping tables, etc.). Ask
first for those.

## Branch / commit / PR conventions

Mirror the companion
[`next-shell-contributor`](./.claude/skills/next-shell-contributor/SKILL.md)
skill (the authoritative source):

| Kind       | Branch pattern          |
| ---------- | ----------------------- |
| Phase work | `claude/phase-N-<slug>` |
| Chore      | `claude/chore-<slug>`   |
| Fix        | `claude/fix-<slug>`     |

Commit and PR titles use conventional-commit style, scoped by phase when
applicable:

```
feat(phase-3): vendor base primitives — Button, Label, Input, …
chore(claude): vendor official shadcn/ui skill from shadcn-ui/ui
fix(primitives): Dialog close button focus trap regression
```

PR bodies follow the skill's 5-section template: one-line summary +
issue links · what's in the box · what is intentionally NOT in this PR ·
verification (paste the lint/typecheck/test/build results) · checklist.

**PRs open as draft.** Flip to ready only after CI is green (or after
the auto-approval / auto-merge standing rule fires).

**GitHub MCP is restricted to `jonmatum/next-shell`** by design, so
there's no risk of acting on another repo. Use `mcp__github__*` for all
GitHub interactions — no `gh` CLI available.

## Verification pipeline — run before every commit

```
pnpm format      # prettier --write
pnpm lint        # eslint --max-warnings=0
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest run (no watch)
pnpm build       # tsup + tailwind preset + DTS
```

Pre-commit runs `lint-staged` via Husky (prettier + eslint `--fix` on
staged files only) — you still need the full `pnpm test` + `pnpm build`
locally because lint-staged only touches what's staged.

## Package layout

```
packages/next-shell/
├── components.json              # shadcn CLI config (aliases → src/…)
├── src/
│   ├── index.ts                 # root barrel
│   ├── core/                    # cn(), packageVersion, shared utilities
│   ├── primitives/              # shadcn-vendored primitives (42 of them)
│   ├── providers/               # ThemeProvider + hooks (client)
│   │   └── server/              # SSR cookie helpers (server-safe)
│   ├── tokens/                  # TS view of the semantic-token contract
│   ├── styles/
│   │   ├── tokens.css           # :root + [data-theme='dark'] tokens
│   │   └── preset.css           # Tailwind v4 @theme mappings
│   ├── tailwind-preset/
│   ├── layout/                  # (Phase 4)
│   ├── auth/                    # (Phase 5)
│   └── hooks/                   # (Phase 7)
├── tsup.config.ts
├── vitest.config.ts
└── package.json
```

Subpaths exported through `package.json#exports`:

```
@jonmatum/next-shell                 # root barrel
@jonmatum/next-shell/core            # cn, version
@jonmatum/next-shell/primitives      # shadcn primitives (client)
@jonmatum/next-shell/providers       # ThemeProvider etc. (client)
@jonmatum/next-shell/providers/server # SSR cookie helpers (server-safe)
@jonmatum/next-shell/tokens          # TS token contract
@jonmatum/next-shell/tailwind-preset
@jonmatum/next-shell/styles/{tokens,preset}.css
@jonmatum/next-shell/layout
@jonmatum/next-shell/layout/server
@jonmatum/next-shell/formatters
@jonmatum/next-shell/auth
@jonmatum/next-shell/auth/nextauth
@jonmatum/next-shell/auth/mock
@jonmatum/next-shell/auth/server
@jonmatum/next-shell/hooks
```

## shadcn integration

- Primitives are **vendored verbatim** from [`shadcn-ui/ui`](https://github.com/shadcn-ui/ui),
  pinned to a specific commit SHA (`84d1d476b1d1…` as of Phase 3). To
  update, re-fetch from the new SHA and bump the pin in
  `.claude/skills/README.md` + PR bodies.
- All shadcn-style `@/…` absolute imports are rewritten on vendor:
  - `@/lib/utils` → `@/core/cn`
  - `@/registry/new-york-v4/ui/button` → `@/primitives/button`
  - `@/registry/new-york-v4/ui/dialog` → `@/primitives/dialog`
  - `@/registry/new-york-v4/ui/label` → `@/primitives/label`
  - `@/registry/new-york-v4/ui/toggle` → `@/primitives/toggle`
- Path aliases are wired in `packages/next-shell/tsconfig.json`
  (`@/* → src/*`) and mirrored in `vitest.config.ts` (`resolve.alias`).
- `.mcp.json` at the repo root registers the official shadcn MCP server
  so future sessions get the canonical component catalog automatically.

## Loaded skills

All in `.claude/skills/`, loaded automatically per session:

| Skill                                                               | When it helps                                                                                             |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [`shadcn`](./.claude/skills/shadcn)                                 | Any shadcn primitive work — canonical composition rules, CLI commands                                     |
| [`shadcn-next-shell`](./.claude/skills/shadcn-next-shell)           | **Repo-local layer on top of `shadcn`** — token discipline, client/server split, motion tokens, cva shape |
| [`next-shell-contributor`](./.claude/skills/next-shell-contributor) | Phase model, branch / commit / PR conventions, verification pipeline, common failure modes                |
| [`frontend-design`](./.claude/skills/frontend-design)               | Production-grade UI creation                                                                              |
| [`web-artifacts-builder`](./.claude/skills/web-artifacts-builder)   | Multi-component React + Tailwind + shadcn scaffolding                                                     |
| [`webapp-testing`](./.claude/skills/webapp-testing)                 | Playwright-based UI testing, screenshots, DOM inspection                                                  |
| [`theme-factory`](./.claude/skills/theme-factory)                   | Color + typography theming                                                                                |

## JSDOM test shims — `packages/next-shell/tests/setup.ts`

JSDOM doesn't implement everything Radix + shadcn libraries expect. The
setup file installs no-op stubs for:

- `window.matchMedia` — next-themes' `prefers-color-scheme` watcher
- `ResizeObserver` — Radix Slider, Popover, ScrollArea
- `IntersectionObserver` — embla-carousel-react
- `Element.prototype.scrollIntoView` — cmdk's active-item tracking

**Do not call `vi.restoreAllMocks()` in `afterEach`** — it wipes these
stubs. If a future primitive needs another browser-API stub, add it
here alongside the existing ones.

## Common breakages

| Symptom                                                       | Likely cause                                                                                                                                                                                                          |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install` complains about peerDeps                       | Consumer app needs React 19 + Next 15 + Tailwind 4                                                                                                                                                                    |
| `'use client'` missing from bundled output                    | New top-level subpath not in `CLIENT_ENTRIES` in `tsup.config.ts`                                                                                                                                                     |
| Vitest can't find `matchMedia` / `ResizeObserver` / etc.      | Missing shim in `tests/setup.ts` (or `vi.restoreAllMocks()` wiped it)                                                                                                                                                 |
| Hydration warning in a Next.js consumer                       | Add `suppressHydrationWarning` to `<html>` — next-themes writes `data-theme` before hydration                                                                                                                         |
| Lint fails on a hex literal inside a CSS attribute _selector_ | `no-raw-colors` can't distinguish selector-hex from value-hex; wrap that one className with a targeted `/* eslint-disable next-shell/no-raw-colors */` block + a comment explaining (see `chart.tsx` for the pattern) |
| Lint fails on `text-white` in a destructive variant           | Retheme to `text-destructive-foreground`; resolves to `oklch(0.985 0 0)` in both themes                                                                                                                               |

## Where to look first when stuck

1. The two repo-authored skills (`shadcn-next-shell`, `next-shell-contributor`)
2. The most recently merged phase PR's description (always paints a
   detailed picture of the surface it added)
3. The upstream `shadcn-ui/ui` source at the pinned commit, under
   `apps/v4/registry/new-york-v4/ui/*.tsx`
4. The extraction plan meta-issue [#13](https://github.com/jonmatum/next-shell/issues/13)
   for phase boundaries

## Quick links

- Meta-issue · [#13](https://github.com/jonmatum/next-shell/issues/13)
- Phase 1 (tokens) · [#2](https://github.com/jonmatum/next-shell/issues/2)
- Phase 2 (theme) · [#3](https://github.com/jonmatum/next-shell/issues/3)
- Phase 3 (shadcn primitives) · [#4](https://github.com/jonmatum/next-shell/issues/4)
- Phase 4 (app shell) · [#5](https://github.com/jonmatum/next-shell/issues/5)
- Phase 5 (auth) · [#6](https://github.com/jonmatum/next-shell/issues/6)
- Phase 6 (providers composer) · [#7](https://github.com/jonmatum/next-shell/issues/7)
- Phase 7 (hooks) · [#8](https://github.com/jonmatum/next-shell/issues/8)
- Phase 8 (utilities) · [#9](https://github.com/jonmatum/next-shell/issues/9)
- Phase 9 (docs + Storybook) · [#10](https://github.com/jonmatum/next-shell/issues/10)
- Phase 10 (publishing) · [#11](https://github.com/jonmatum/next-shell/issues/11)
- Phase 11 (integration back into Smart Pad Rules) · [#12](https://github.com/jonmatum/next-shell/issues/12)
