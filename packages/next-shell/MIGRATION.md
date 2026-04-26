# Migration Guide

This document tracks breaking changes between versions of `@jonmatum/next-shell` and provides upgrade instructions.

---

## Migration entry template

When documenting a new version, use this structure:

> **## vX.Y.Z**
>
> **Release date:** YYYY-MM-DD
>
> **Breaking changes** — list each change with before/after code snippets.
>
> **Deprecations** — list deprecated APIs and their replacements.
>
> **Migration steps** — numbered, independently verifiable steps.
>
> **Codemods / find-and-replace** — regex or codemod commands if applicable.

---

## What counts as a breaking change

Any of the following constitutes a breaking change and requires a major (or pre-1.0 minor) version bump:

| Category                               | Examples                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------- |
| **Token renames**                      | `--primary` renamed to `--brand-primary`; `ColorToken` union changes                  |
| **Token removals**                     | A token deleted from `tokens.css` / `preset.css` / the `colorTokens` array            |
| **Removed exports**                    | A named export dropped from any public subpath barrel                                 |
| **Changed component props**            | Required prop added, prop type narrowed, prop renamed or removed                      |
| **CSS class / data-attribute changes** | `data-theme` attribute renamed, Tailwind utility class prefix changed                 |
| **Peer dependency bumps**              | Minimum React, Next.js, or Tailwind version increased                                 |
| **Subpath removals**                   | A `package.json#exports` entry removed or path changed                                |
| **Default behavior changes**           | A component's default variant, size, or behavior changes in a way consumers depend on |

---

## v0.1.0 — Baseline

**Release date:** 2025 (initial extraction)

This is the first published version. There are no prior versions to migrate from. This entry documents the initial API surface as the baseline contract that future versions are compared against.

### Subpath exports

| Subpath                                     | Description                                                                                                                                                                                                                                                                       |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@jonmatum/next-shell`                      | Root barrel (re-exports core + primitives + providers + tokens)                                                                                                                                                                                                                   |
| `@jonmatum/next-shell/core`                 | `cn()`, `packageVersion`                                                                                                                                                                                                                                                          |
| `@jonmatum/next-shell/primitives`           | 42 shadcn/ui primitives (client)                                                                                                                                                                                                                                                  |
| `@jonmatum/next-shell/providers`            | `AppProviders`, `ThemeProvider`, `QueryProvider`, `ToastProvider`, `ErrorBoundary`, `I18nProvider` (client)                                                                                                                                                                       |
| `@jonmatum/next-shell/providers/server`     | SSR cookie helpers (server-safe)                                                                                                                                                                                                                                                  |
| `@jonmatum/next-shell/tokens`               | TypeScript token contract, `BrandOverrides`, `buildRootOverrides()`, `brandOverridesCss()`, `cssVar()`, `hexToOklch()`, presets                                                                                                                                                   |
| `@jonmatum/next-shell/layout`               | `AppShell`, `Sidebar`, `TopBar`, `CommandBar`, `Footer`, `PageHeader`, `ContentContainer`, error pages, status states (client)                                                                                                                                                    |
| `@jonmatum/next-shell/layout/server`        | Server-safe layout utilities                                                                                                                                                                                                                                                      |
| `@jonmatum/next-shell/auth`                 | `AuthProvider`, `useSession`, auth guards, auth components (client)                                                                                                                                                                                                               |
| `@jonmatum/next-shell/auth/server`          | Server-side auth helpers                                                                                                                                                                                                                                                          |
| `@jonmatum/next-shell/auth/nextauth`        | NextAuth.js v5 adapter                                                                                                                                                                                                                                                            |
| `@jonmatum/next-shell/auth/mock`            | Mock auth adapter for development/testing                                                                                                                                                                                                                                         |
| `@jonmatum/next-shell/hooks`                | `useIsMobile`, `useMediaQuery`, `useBreakpoint`, `useMounted`, `useIsomorphicLayoutEffect`, `useDisclosure`, `useControllableState`, `useLocalStorage`, `useSessionStorage`, `useCopyToClipboard`, `useDebouncedValue`, `useDebouncedCallback`, `useHotkey`, `useLocale` (client) |
| `@jonmatum/next-shell/formatters`           | `formatDate`, `formatNumber`, `formatCurrency`, `truncate`, and string/number/date utilities                                                                                                                                                                                      |
| `@jonmatum/next-shell/tailwind-preset`      | Tailwind v4 preset (programmatic)                                                                                                                                                                                                                                                 |
| `@jonmatum/next-shell/styles/tokens.css`    | CSS custom property definitions (`:root` + `[data-theme='dark']`)                                                                                                                                                                                                                 |
| `@jonmatum/next-shell/styles/preset.css`    | Tailwind v4 `@theme` mappings                                                                                                                                                                                                                                                     |
| `@jonmatum/next-shell/styles/presets/*.css` | Color palette presets: `neutral`, `green`, `orange`, `red`, `violet`                                                                                                                                                                                                              |

### Semantic color tokens

Defined in `src/styles/tokens.css` and mirrored in `src/tokens/index.ts`:

`background`, `foreground`, `surface`, `surface-foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `destructive`, `destructive-foreground`, `success`, `success-foreground`, `warning`, `warning-foreground`, `info`, `info-foreground`, `border`, `input`, `ring`, `overlay`, `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring`, `chart-1` through `chart-5`

Token schema version: `1.0.0`

### Other token categories

- **Radius:** `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `full`
- **Font families:** `sans`, `mono`, `display`
- **Text sizes:** `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`
- **Leading:** `tight`, `snug`, `normal`, `relaxed`, `loose`
- **Tracking:** `tight`, `normal`, `wide`, `wider`
- **Duration:** `instant`, `fast`, `normal`, `slow`, `slowest`
- **Easing:** `standard`, `emphasized`, `decelerate`, `accelerate`
- **Shadows:** `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
- **Density:** `pad-x`, `pad-y`, `gap`, `row-height`

### Key component props (baseline)

- **Button:** `variant` (`default | destructive | outline | secondary | ghost | link`), `size` (`default | sm | lg | icon`)
- **Badge:** `variant` (`default | secondary | destructive | outline`)
- **Toggle:** `variant` (`default | outline`), `size` (`default | sm | lg`)
- **Tabs:** `TabsList` accepts `variant` via `tabsListVariants`
- **AppShell:** `sidebar`, `topBar`, `commandBar`, `footer` props
- **AppProviders:** `themeProps`, `queryProps`, `toastProps`, `i18nProps`, `authProps`
- **ThemeProvider:** wraps `next-themes` with `data-theme` attribute

### Peer dependencies

| Package          | Version                     |
| ---------------- | --------------------------- |
| `next`           | `^15.0.0`                   |
| `react`          | `^19.0.0`                   |
| `react-dom`      | `^19.0.0`                   |
| `tailwindcss`    | `^4.0.0` (optional)         |
| `tw-animate-css` | `^1.0.0` (optional)         |
| `next-auth`      | `>=5.0.0-beta.0` (optional) |
