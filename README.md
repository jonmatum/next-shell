# next-shell

Monorepo for [`@jonmatum/next-shell`](./packages/next-shell) — a reusable Next.js app shell built on **shadcn/ui** primitives with a strict **semantic-token** design system.

> **Status:** All 11 phases complete — extraction finished. Open-source readiness ([epic #54](https://github.com/jonmatum/next-shell/issues/54)) done. 712 tests, full docs site, release pipeline, starter template, and a working example app all on `main`.

## What's in the box today

| Phase | Surface                                                                                                                                                                      | Status    |
| ----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
|     0 | Monorepo scaffold + CI + publishing skeleton                                                                                                                                 | ✅ Landed |
|     1 | Semantic-token contract + Tailwind v4 preset + OKLCH color tokens                                                                                                            | ✅ Landed |
|     2 | `ThemeProvider` · `useTheme` · `ThemeToggle` (cycle + dropdown) · SSR cookie helpers                                                                                         | ✅ Landed |
|     3 | **42 shadcn/ui primitives** vendored from [`shadcn-ui/ui@84d1d476`](https://github.com/shadcn-ui/ui/commit/84d1d476b1d1c6a01c6eeadd95885ce109969b08), each token-audited     | ✅ Landed |
|     4 | `AppShell` · `Sidebar` (4 variants, mobile drawer) · `TopBar` · `CommandBar` (⌘K) · `ContentContainer` · `PageHeader` · `Footer` · status states · SSR sidebar cookie        | ✅ Landed |
|     5 | Navigation system — `buildNav`, `SidebarNav`, `Breadcrumbs`, `CommandBarActions`; permission-gated nav via `requires`                                                        | ✅ Landed |
|     6 | Providers composer — `AppProviders`, `QueryProvider` (TanStack Query v5), `ToastProvider` (Sonner), `ErrorBoundary`, `I18nProvider`                                          | ✅ Landed |
|     7 | Auth adapter pattern — `AuthProvider`, `useSession`, `useUser`, `useHasPermission`, `useRequireAuth`, `SignedIn`, `SignedOut`, `RoleGate`, `requireSession` (server)         | ✅ Landed |
|     8 | Hooks + formatters — `useDisclosure`, `useLocalStorage`, `useDebounced*`, `useHotkey`, `useBreakpoint`, `useCopyToClipboard` + `formatDate`, `formatCurrency`, `truncate`, … | ✅ Landed |
|     9 | Docs site (fumadocs v14) — 10 content pages covering all phases + recipes & migration; Storybook deferred                                                                    | ✅ Landed |
|    10 | Publishing + changeset release workflow — `changesets/action`, npm provenance, `release.yml`                                                                                 | ✅ Landed |
|    11 | Example consumer app — dashboard, data table, auth guards, settings form, toast demos                                                                                        | ✅ Landed |

**42 primitives** (Phase 3): Accordion, Alert, AlertDialog, AspectRatio, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, Dialog, Drawer, DropdownMenu, Form, HoverCard, Input, InputOTP, Label, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Skeleton, Slider, Switch, Table, Tabs, Textarea, Toaster (Sonner), Toggle, ToggleGroup, Tooltip.

**712 unit tests** across 29 test files cover render, interaction, SSR helpers, provider composition, auth adapter contracts, and export-surface completeness.

Deliberately **not** vendored (composed patterns documented as consumer-side recipes): DatePicker (Popover + Calendar + Button), DataTable (Table + `@tanstack/react-table`), Typography (styling-guide h1/h2/p patterns).

## Design principles

- **No hardcoded colors anywhere.** Every color reaches the DOM through semantic tokens (`bg-background`, `text-foreground`, `border-border`, …). A custom ESLint rule (`next-shell/no-raw-colors`) fails CI on regressions.
- **Latest stack.** Next.js 15, React 19, TypeScript 5.x, Tailwind CSS v4, Radix UI (via the `radix-ui` unified package).
- **Tree-shakeable subpaths.** Every surface area has its own export entry so consumers pay only for what they import.
- **RSC-friendly by default.** Server-safe helpers live under `<subpath>/server/` so they can be imported from a Server Component without dragging a client boundary.
- **Motion + opacity tokens.** `duration-fast|normal|slow`, `ease-standard|emphasized|decelerate|accelerate`, and the animation utilities from `tw-animate-css` are wired in via the preset.

## Workspace layout

```
next-shell/
├── packages/
│   └── next-shell/               # The published @jonmatum/next-shell package
├── apps/
│   ├── docs/                     # Documentation site (fumadocs v14)
│   └── example/                  # Example consumer app
├── templates/
│   └── starter/                  # Starter template (degit-ready)
├── tools/
│   ├── eslint-plugin-next-shell/ # Custom ESLint rules (no-raw-colors)
│   └── next-shell-mcp/           # MCP server for AI tools
├── .claude/skills/               # Repo-local Claude Code skills
├── CLAUDE.md                     # Session onboarding guide
└── pnpm-workspace.yaml
```

## Quick start (contributors)

```bash
nvm use              # Node version from .nvmrc
pnpm install
pnpm lint            # eslint --max-warnings=0
pnpm typecheck
pnpm test            # vitest run (712 tests)
pnpm build           # tsup + tailwind preset + DTS
```

`lint-staged` runs automatically on `git commit` (Husky). You still want `pnpm test` + `pnpm build` locally before committing — the hook only checks staged files.

## For AI-assisted contributions

This repo is set up for Claude Code sessions with a handful of durable conventions:

- **[`CLAUDE.md`](./CLAUDE.md)** — session onboarding. Hard rules (no raw colors, client/server boundaries, a11y), standing auto-merge rule for green PRs, verification pipeline, shadcn vendor workflow, JSDOM test shims inventory, common-breakage troubleshooting, phase-issue quick-links.
- **[`.claude/skills/`](./.claude/skills/)** — repo-local skills:
  - `shadcn-next-shell` — semantic-token discipline + cva + client/server split specifics for this repo
  - `next-shell-contributor` — phase model, branch / commit / PR conventions, verification pipeline
- **[`.mcp.json`](./.mcp.json)** — the official shadcn MCP server is registered automatically so every session gets the canonical shadcn catalog.
- **GitHub MCP is restricted to this repo** — sessions can't accidentally open PRs elsewhere.

New session picking up the work: `git pull`, read `CLAUDE.md`, check the most recently merged phase PR for the current state, then continue on a `claude/phase-N-<slug>` branch.

## Resources

- **[Documentation site](https://jonmatum.github.io/next-shell/)** — full guides for every phase (fumadocs v14)
- **[Starter template](./templates/starter/)** — degit-ready scaffold: `npx degit jonmatum/next-shell/templates/starter my-app`
- **[Example app](./apps/example/)** — dashboard, data table, auth guards, settings form, toast demos
- **[MCP server](./tools/next-shell-mcp/)** — Model Context Protocol server for AI tools

## Links

- Package README · [`packages/next-shell/README.md`](./packages/next-shell/README.md)
- Session onboarding · [`CLAUDE.md`](./CLAUDE.md)
- Extraction plan · [Epic #13](https://github.com/jonmatum/next-shell/issues/13)
- Open-source readiness · [Epic #54](https://github.com/jonmatum/next-shell/issues/54)
- Per-phase tracking issues · [#1](https://github.com/jonmatum/next-shell/issues/1) · [#2](https://github.com/jonmatum/next-shell/issues/2) · [#3](https://github.com/jonmatum/next-shell/issues/3) · [#4](https://github.com/jonmatum/next-shell/issues/4) · [#5](https://github.com/jonmatum/next-shell/issues/5) · [#6](https://github.com/jonmatum/next-shell/issues/6) · [#7](https://github.com/jonmatum/next-shell/issues/7) · [#8](https://github.com/jonmatum/next-shell/issues/8) · [#9](https://github.com/jonmatum/next-shell/issues/9) · [#10](https://github.com/jonmatum/next-shell/issues/10) · [#11](https://github.com/jonmatum/next-shell/issues/11) · [#12](https://github.com/jonmatum/next-shell/issues/12)

## License

MIT © Jonatan Mata
