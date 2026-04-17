# @jonmatum/next-shell

Reusable Next.js app shell built on **shadcn/ui** primitives with a strict **semantic-token** design system.

> **Status:** All 11 phases complete. Published via Changesets. 508 tests, docs site, and a working example app all on `main`.

## Install

```bash
pnpm add @jonmatum/next-shell
# Required peers
pnpm add next@^15 react@^19 react-dom@^19
# Recommended
pnpm add tailwindcss@^4
```

Runtime deps (pulled in automatically): `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `lucide-react`, `vaul`, `cmdk`, `sonner`, `date-fns`, `react-hook-form`, `react-day-picker`, `input-otp`, `embla-carousel-react`, `react-resizable-panels`, `recharts`, `next-themes`.

## Quick start

### 1. Load the preset (Tailwind v4)

```css
/* app/globals.css */
@import 'tailwindcss';
@source "node_modules/@jonmatum/next-shell/dist/**/*.{js,cjs}";
@import '@jonmatum/next-shell/styles/preset.css';
```

The `@source` line tells Tailwind v4 to scan the library's bundled output for class names — required because Tailwind only generates CSS for classes it finds in scanned files, and library code in `node_modules` is not scanned by default.

The preset pulls in `tokens.css` + `tw-animate-css` (inlined, no extra dep needed) and wires every semantic token to the Tailwind `@theme` scale. Utilities like `bg-background`, `text-foreground`, `border-border`, `ring-ring`, `animate-in`, and `duration-fast` are now live.

### 2. Mount the theme provider (client)

```tsx
// app/providers.tsx
'use client';

import { ThemeProvider } from '@jonmatum/next-shell/providers';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
```

### 3. Optional: SSR-safe theme via cookie (no first-paint flash)

```tsx
// app/layout.tsx  (Server Component)
import { cookies } from 'next/headers';
import { getThemeFromCookies } from '@jonmatum/next-shell/providers/server';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = getThemeFromCookies(await cookies()) ?? 'system';
  return (
    <html lang="en" data-theme={theme} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 4. Import primitives

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@jonmatum/next-shell/primitives';

export function UserCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm">
          Invite
        </Button>
      </CardContent>
    </Card>
  );
}
```

Every primitive ships with `data-slot` attributes for custom-styling hooks, `aria-*` semantics preserved from Radix, and variant systems driven by `class-variance-authority`.

## Subpath entry points

| Import                                   | Surface                                                                                                             | Status |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------ |
| `@jonmatum/next-shell`                   | Root barrel — `cn`, `packageVersion`, `tokenSchemaVersion`                                                          | ✅     |
| `@jonmatum/next-shell/core`              | `cn`, `packageVersion`                                                                                              | ✅     |
| `@jonmatum/next-shell/primitives`        | 42 shadcn/ui primitives (client)                                                                                    | ✅     |
| `@jonmatum/next-shell/providers`         | `AppProviders`, `ThemeProvider`, `QueryProvider`, `ToastProvider`, `ErrorBoundary`, `I18nProvider` (client)         | ✅     |
| `@jonmatum/next-shell/providers/server`  | SSR theme cookie helpers (server-safe)                                                                              | ✅     |
| `@jonmatum/next-shell/layout`            | `AppShell`, `Sidebar`, `TopBar`, `CommandBar`, `ContentContainer`, `PageHeader`, `Footer`, nav + status helpers     | ✅     |
| `@jonmatum/next-shell/layout/server`     | SSR sidebar-state cookie helpers (server-safe)                                                                      | ✅     |
| `@jonmatum/next-shell/auth`              | `AuthProvider`, `useSession`, `useUser`, `useHasPermission`, `useRequireAuth`, `SignedIn`, `SignedOut`, `RoleGate`  | ✅     |
| `@jonmatum/next-shell/auth/server`       | `requireSession` — throws `AuthRequiredError` (401) for Route Handlers (server-safe)                                | ✅     |
| `@jonmatum/next-shell/auth/nextauth`     | `createNextAuthAdapter` — Auth.js v5 wrapper (optional peer: `next-auth >= 5`)                                      | ✅     |
| `@jonmatum/next-shell/auth/mock`         | `createMockAuthAdapter` — zero-dep adapter for tests and Storybook                                                  | ✅     |
| `@jonmatum/next-shell/tokens`            | TS view of the semantic-token contract — literal unions, `cssVar`, brand overrides                                  | ✅     |
| `@jonmatum/next-shell/tailwind-preset`   | Tailwind v4 preset (maps tokens → `@theme` keys)                                                                    | ✅     |
| `@jonmatum/next-shell/styles/tokens.css` | Token CSS (custom properties for `:root` + `[data-theme="dark"]`)                                                   | ✅     |
| `@jonmatum/next-shell/styles/preset.css` | Combined preset (tokens + `tw-animate-css` + Tailwind `@theme` mappings)                                            | ✅     |
| `@jonmatum/next-shell/hooks`             | `useDisclosure`, `useLocalStorage`, `useBreakpoint`, `useHotkey`, `useDebouncedValue`, `useMounted`, `useLocale`, … | ✅     |
| `@jonmatum/next-shell/formatters`        | `formatDate`, `formatRelativeTime`, `formatCurrency`, `formatFileSize`, `truncate`, `slugify`, …                    | ✅     |

Subpath imports tree-shake cleanly — importing only `@jonmatum/next-shell/primitives` does not pull in providers, and vice versa.

## Auth adapter pattern

Wire in Auth.js v5 (or any backend) in three lines:

```tsx
// app/layout.tsx
import { createNextAuthAdapter } from '@jonmatum/next-shell/auth/nextauth';
import { auth } from '@/auth'; // your Auth.js handler
import { AuthProvider } from '@jonmatum/next-shell/auth';

<AuthProvider adapter={createNextAuthAdapter({ getServerSession: auth })}>{children}</AuthProvider>;
```

Guard routes and UI with the built-in hooks and components:

```tsx
import { SignedIn, SignedOut, RoleGate, useUser } from '@jonmatum/next-shell/auth';

function Nav() {
  const user = useUser();
  return (
    <>
      <SignedIn>
        <span>Hello, {user?.name}</span>
      </SignedIn>
      <SignedOut>
        <a href="/login">Sign in</a>
      </SignedOut>
      <RoleGate role="admin">
        <a href="/admin">Admin</a>
      </RoleGate>
    </>
  );
}
```

Protect Route Handlers server-side:

```ts
import { requireSession } from '@jonmatum/next-shell/auth/server';
import { auth } from '@/auth';

export async function GET() {
  const session = await requireSession(auth); // throws 401 if unauthenticated
  return Response.json({ user: session.user });
}
```

Swap to the mock adapter for tests — no config changes needed in components:

```tsx
import { createMockAuthAdapter } from '@jonmatum/next-shell/auth/mock';

render(
  <AuthProvider adapter={createMockAuthAdapter({ user: { id: '1', roles: ['admin'] } })}>
    <MyComponent />
  </AuthProvider>,
);
```

## Semantic tokens

Every color reaches the DOM through one of the semantic tokens declared in `styles/tokens.css`:

```
background        foreground
surface           surface-foreground
card              card-foreground
popover           popover-foreground
muted             muted-foreground
accent            accent-foreground
primary           primary-foreground
secondary         secondary-foreground
destructive       destructive-foreground
success           success-foreground
warning           warning-foreground
info              info-foreground
border  input  ring  overlay
sidebar + 7 sidebar-* surfaces
chart-1..chart-5
```

Plus radius (7 sizes on a single `--radius` base), typography (3 families, 9-step fluid type scale, leading, tracking), motion (5 durations + 4 easings), elevation (6 shadow sizes), and density (4 scalars).

**No raw color literals** in library code — the `next-shell/no-raw-colors` ESLint rule fails CI on regressions. If a color concept doesn't fit an existing token, the token set grows; consumers never hardcode.

### Brand overrides

```tsx
import { ThemeProvider } from '@jonmatum/next-shell/providers';
import type { BrandOverrides } from '@jonmatum/next-shell/tokens';

const brand: BrandOverrides = {
  light: { primary: 'oklch(0.6 0.2 258)', 'primary-foreground': 'oklch(1 0 0)' },
  dark: { primary: 'oklch(0.75 0.15 258)' },
  radius: '0.5rem',
  fontSans: 'Inter, sans-serif',
};

<ThemeProvider brand={brand}>{children}</ThemeProvider>;
```

Brand overrides cascade via CSS custom properties — zero JS re-render on theme switch.

## Contributing

See the root [`CONTRIBUTING.md`](../../CONTRIBUTING.md) for day-to-day workflow, and the repo-local skills under [`.claude/skills/`](../../.claude/skills/) if you're iterating with Claude Code.

## License

MIT © Jonatan Mata
