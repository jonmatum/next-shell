# next-shell

Monorepo for [`@jonmatum/next-shell`](./packages/next-shell) — a reusable Next.js app shell built on **shadcn/ui** primitives with a strict **semantic-token** design system.

> Status: **Phase 0 — scaffolding in progress.** Track the rollout in [Epic #13](https://github.com/jonmatum/next-shell/issues/13).

## What's in the box

- **All 69+ shadcn/ui components**, each audited to use only semantic tokens
- **No hardcoded colors anywhere** — enforced in CI by a custom ESLint rule (`next-shell/no-raw-colors`)
- **Latest stack** — Next.js 15, React 19, TypeScript 5.x, Tailwind CSS v4
- **App shell layout** — `AppShell`, `Sidebar`, `TopBar`, `CommandBar`, `PageHeader`, and more
- **Pluggable adapters** for auth and i18n so consumer apps stay decoupled
- **Tree-shakeable** subpath exports, **RSC-friendly** by default

## Workspace layout

```
next-shell/
├── packages/
│   └── next-shell/               # The published @jonmatum/next-shell package
├── tools/
│   └── eslint-plugin-next-shell/ # Custom ESLint rules (no-raw-colors)
├── eslint.config.js              # Flat config, used at the repo root
├── tsconfig.base.json            # Shared TS compiler options
└── pnpm-workspace.yaml
```

## Quick start (development)

```bash
nvm use
pnpm install
pnpm build
pnpm test
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full day-to-day workflow.

## The semantic-token rule

Every component in this repo uses semantic tokens (`bg-background`, `text-foreground`, `border-border`, ...) — **never** a hex literal, raw CSS color function, or Tailwind palette utility like `bg-slate-500`. The rule is enforced at `pnpm lint` time.

Token definitions land in Phase 1 (see [issue #2](https://github.com/jonmatum/next-shell/issues/2)).

## License

MIT © Jonatan Mata
