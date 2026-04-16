---
name: shadcn-next-shell
description: Repo-specific conventions for vendoring shadcn/ui primitives into @jonmatum/next-shell. Use this skill when adding, updating, or modifying any component under packages/next-shell/src/primitives/, wiring up shadcn components, or touching the semantic-token system. Enforces the Tailwind v4 semantic-token discipline, `'use client'` placement, and the client/server subpath split.
license: MIT (same as the surrounding repo)
---

# shadcn/ui in next-shell

`@jonmatum/next-shell` ships a curated subset of shadcn/ui primitives wired to the next-shell semantic-token system. This skill codifies the rules for doing that correctly.

## When to invoke

- Adding a new primitive (Button, Dialog, DropdownMenu, Popover, Command, etc.)
- Updating an existing primitive to a newer shadcn version
- Authoring a compound component that wraps one or more primitives
- Anywhere a raw color literal, `bg-white`, or `text-slate-500` creeps in

## Setup (one time per session)

The shadcn MCP server is registered in `.mcp.json` at the repo root. It exposes the official shadcn catalog (primitives, blocks, examples, registries). No separate install step is required — the `npx shadcn@latest mcp` command is launched on demand.

If the MCP server isn't available in this session, you can still install primitives manually:

```bash
cd packages/next-shell
npx shadcn@latest add button dialog dropdown-menu   # etc.
```

…then manually port the generated components into `src/primitives/<component-name>/` and apply the token discipline below.

## Hard rules

### 1. Semantic tokens only — no raw colors

Every primitive must style through the semantic token set defined in `src/tokens/tokens.css` and surfaced by `src/tokens/brand.ts`:

| Intent                    | Use                                                    | Never                              |
| ------------------------- | ------------------------------------------------------ | ---------------------------------- |
| Surface background        | `bg-background`, `bg-card`, `bg-popover`               | `bg-white`, `bg-slate-*`           |
| Text                      | `text-foreground`, `text-muted-foreground`             | `text-black`, `text-gray-500`      |
| Borders                   | `border-border`, `border-input`                        | `border-gray-200`                  |
| Interactive / focus ring  | `ring-ring`, `focus-visible:ring-ring`                 | `ring-blue-500`                    |
| Destructive               | `bg-destructive`, `text-destructive-foreground`        | `bg-red-500`                       |
| Primary / accent / muted  | `bg-primary`, `bg-accent`, `bg-muted` (+ `-foreground`)| Palette utilities                  |

The `no-raw-colors` ESLint rule in `tools/eslint-plugin-next-shell` will fail the build if a raw color literal slips in. Consider that rule the ground truth.

### 2. Client vs. server boundaries

- A component that uses `useState`, `useEffect`, `useRef`, a React context, portals, or refs to `window` / `document` is a **client component** — add `'use client'` as the first line of its source file.
- The `providers` subpath has a post-build hook in `tsup.config.ts` that re-prepends `'use client'` to the bundled output. If you introduce a **new** top-level client entry under `src/<subpath>/index.ts`, update the `CLIENT_ENTRIES` list in `tsup.config.ts` accordingly.
- Server-safe helpers (cookie readers, formatters, URL builders) live under an explicit `<subpath>/server/` folder so consumers can import them from a Server Component without forcing a client boundary. See `src/providers/server/` for the existing pattern.

### 3. Class-variance-authority for variants

All primitives that expose style variants use `cva` (class-variance-authority). The canonical shape is:

```tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);
```

### 4. Accessibility is non-negotiable

- Every interactive primitive has an accessible name (aria-label or visible text).
- Focus rings are token-driven (`ring-ring`, never `outline` removal without a replacement).
- Radix primitives (`@radix-ui/react-*`) are the default substrate — do not substitute homegrown equivalents without discussing tradeoffs first.

### 5. Motion tokens

Animation uses the motion tokens exposed in `tokens.css`:

```
duration-fast | duration-base | duration-slow    (via theme.extend)
ease-standard | ease-emphasized | ease-decelerate (custom cubic-bezier values)
```

Never hard-code `duration-200` / `ease-in-out` when a semantic motion token exists.

## When in doubt

- Read an existing primitive (once Phase 3 lands, `src/primitives/button/` is the canonical reference).
- Consult the upstream shadcn docs via the MCP server; re-theme the generated output through the semantic tokens before committing.
- If a new token is genuinely needed, add it in `src/tokens/brand.ts` + `src/tokens/tokens.css` *first*, update tests, then use it.
