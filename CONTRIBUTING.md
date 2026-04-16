# Contributing to next-shell

Thanks for your interest in `@jonmatum/next-shell`. This document covers the setup and the conventions you need to know.

## Prerequisites

- Node.js 22 (see [`.nvmrc`](./.nvmrc))
- pnpm 10+

## Setup

```bash
pnpm install
```

## Day-to-day commands

| Command             | What it does                       |
| ------------------- | ---------------------------------- |
| `pnpm build`        | Build all packages via tsup        |
| `pnpm dev`          | Watch-build all packages           |
| `pnpm lint`         | Run ESLint across the repo         |
| `pnpm format`       | Format everything with Prettier    |
| `pnpm format:check` | Verify formatting (used in CI)     |
| `pnpm typecheck`    | Run `tsc --noEmit` across packages |
| `pnpm test`         | Run Vitest once                    |
| `pnpm test:watch`   | Run Vitest in watch mode           |

A pre-commit hook runs `lint-staged` — it will fix fixable issues automatically.

## The semantic-token rule

The single most important rule in this repo is: **no raw color values in component source.**

This is enforced by the custom `next-shell/no-raw-colors` ESLint rule:

- No hex literals (`#fff`, `#abcdef`, ...)
- No raw CSS color functions (`rgb()`, `hsl()`, `oklch()`, ...)
- No Tailwind palette utilities (`bg-red-500`, `text-slate-700`, `bg-white`, `bg-black`, ...)

Use semantic tokens instead: `bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `bg-destructive`, etc.

Token definition files (anything under `src/tokens/` or matching `tokens.css`) are exempt — those are where the mapping to real colors lives.

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(layout): add Sidebar floating variant
fix(primitives): correct tooltip positioning in RTL
chore(ci): cache pnpm store
```

## Pull requests

- Target `main`
- Keep PRs focused on a single issue
- Include tests for behavior changes
- Fill out the PR template

## Releasing

Releases are automated via Changesets (lands in Phase 10). Don't publish manually.
