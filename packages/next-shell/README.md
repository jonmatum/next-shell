# @jonmatum/next-shell

Reusable Next.js app shell built on **shadcn/ui** primitives with a strict **semantic-token** design system.

> Status: Phase 0 (scaffolding). Follow progress in the [Epic tracker](https://github.com/jonmatum/next-shell/issues/13).

## Install

```bash
pnpm add @jonmatum/next-shell
# peers
pnpm add next react react-dom
# optional
pnpm add tailwindcss
```

## Subpath entry points

| Import                                   | Purpose                                           |
| ---------------------------------------- | ------------------------------------------------- |
| `@jonmatum/next-shell`                   | Main barrel (re-exports the core surface)         |
| `@jonmatum/next-shell/core`              | Core utilities and shared types                   |
| `@jonmatum/next-shell/layout`            | AppShell, Sidebar, TopBar, CommandBar, etc.       |
| `@jonmatum/next-shell/primitives`        | shadcn/ui primitives (token-audited re-exports)   |
| `@jonmatum/next-shell/providers`         | Theme, Query, Toast, ErrorBoundary, Tooltip, I18n |
| `@jonmatum/next-shell/auth`              | Auth adapter interface + first-party adapters     |
| `@jonmatum/next-shell/hooks`             | Cross-cutting hooks + formatters                  |
| `@jonmatum/next-shell/tokens`            | Semantic token contract (TS view)                 |
| `@jonmatum/next-shell/tailwind-preset`   | Tailwind v4 preset (maps tokens → theme)          |
| `@jonmatum/next-shell/styles/tokens.css` | Token CSS (CSS variables for :root + dark)        |

## License

MIT © Jonatan Mata
