---
name: next-shell-builder
description: Build production-grade Next.js applications using @jonmatum/next-shell. Use this skill when scaffolding new apps, adding pages, wiring up auth, composing layouts, or building features with the library's primitives, hooks, and formatters. Provides the complete API surface, import paths, composition patterns, and token system rules needed for rapid prototyping and production builds.
license: MIT
---

# Building with @jonmatum/next-shell

This skill gives you everything needed to build a Next.js application using `@jonmatum/next-shell`. Use it when:

- Scaffolding a new app from scratch
- Adding pages, layouts, or features to an existing next-shell app
- Composing primitives into custom components
- Wiring up authentication, theming, or navigation
- Using hooks, formatters, or the command bar

## Quick setup (new app)

```bash
npx degit jonmatum/next-shell/templates/starter my-app
cd my-app && pnpm install && pnpm dev
```

Or manually:

```bash
pnpm add @jonmatum/next-shell next@^15 react@^19 react-dom@^19 tailwindcss@^4
```

### globals.css (required)

```css
@import 'tailwindcss';
@source "node_modules/@jonmatum/next-shell/dist/**/*.{js,cjs}";
@import '@jonmatum/next-shell/styles/preset.css';
```

The `@source` line is mandatory — Tailwind v4 skips node_modules by default.

## Subpath imports (complete map)

| Import | What it provides |
|--------|-----------------|
| `@jonmatum/next-shell/primitives` | 42 shadcn/ui primitives: Button, Card, Dialog, Sheet, DropdownMenu, Table, Tabs, Form, Input, Select, Checkbox, Switch, etc. |
| `@jonmatum/next-shell/layout` | AppShell, Sidebar, SidebarNav, TopBar, CommandBar, CommandBarTrigger, CommandBarProvider, useCommandBar, useCommandBarActions, Breadcrumbs, ContentContainer, PageHeader, Footer, buildNav, EmptyState, ErrorState, LoadingState, ErrorPage, NotFound, etc. |
| `@jonmatum/next-shell/layout/server` | getSidebarStateFromCookies, buildSidebarStateCookieHeader (server-safe) |
| `@jonmatum/next-shell/providers` | AppProviders, ThemeProvider, ThemeToggle, ThemeToggleDropdown, useTheme, QueryProvider, ToastProvider, ErrorBoundary, I18nProvider |
| `@jonmatum/next-shell/providers/server` | getThemeFromCookies, buildThemeCookieHeader (server-safe) |
| `@jonmatum/next-shell/auth` | AuthProvider, useSession, useUser, useHasPermission, useRequireAuth, SignedIn, SignedOut, RoleGate |
| `@jonmatum/next-shell/auth/nextauth` | createNextAuthAdapter (Auth.js v5) |
| `@jonmatum/next-shell/auth/mock` | createMockAuthAdapter (testing/prototyping) |
| `@jonmatum/next-shell/auth/server` | requireSession (Route Handler protection) |
| `@jonmatum/next-shell/hooks` | useDisclosure, useLocalStorage, useSessionStorage, useCopyToClipboard, useHotkey, useBreakpoint, useMediaQuery, useIsMobile, useMounted, useDebouncedValue, useDebouncedCallback, useControllableState, useIsomorphicLayoutEffect, useLocale |
| `@jonmatum/next-shell/formatters` | formatDate, formatRelativeTime, formatNumber, formatCurrency, formatPercent, formatCompact, formatFileSize, truncate, pluralize, toTitleCase, toKebabCase, slugify |
| `@jonmatum/next-shell/tokens` | colorTokens, radiusTokens, tokenSchemaVersion, BrandOverrides, hexToOklch, preset palettes (neutralPreset, greenPreset, orangePreset, redPreset, violetPreset) |
| `@jonmatum/next-shell/styles/preset.css` | Tailwind v4 preset (tokens + tw-animate-css + @theme mappings) |
| `@jonmatum/next-shell/styles/presets/{green,neutral,orange,red,violet}.css` | Color palette presets |

## Hard rules

1. **No raw colors.** Every color must use semantic tokens: `bg-background`, `text-foreground`, `border-border`, `text-primary`, `bg-destructive`, `text-muted-foreground`, etc. Never use `bg-white`, `text-gray-500`, `#hex`, `rgb()`, or `oklch()` in component code.

2. **'use client' is explicit.** Any file using hooks, event handlers, or browser APIs needs `'use client'` at the top. Server Components are the default in Next.js App Router.

3. **Import from subpaths, not the root.** Use `@jonmatum/next-shell/primitives` not `@jonmatum/next-shell`. Tree-shaking depends on subpath imports.

4. **Server-safe imports for RSC.** In Server Components, import from `/layout/server`, `/providers/server`, or `/auth/server` — never from the client-boundary barrels.

## App shell pattern

```tsx
// app/(shell)/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import {
  AppShell, TopBar, Footer, Sidebar, SidebarContent, SidebarHeader,
  SidebarFooter, SidebarNav, SidebarSeparator, SidebarTrigger,
  Breadcrumbs, CommandBarActions, buildNav,
} from '@jonmatum/next-shell/layout';
import type { NavConfig } from '@jonmatum/next-shell/layout';

const NAV: NavConfig = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <SettingsIcon />,
    children: [
      { id: 'profile', label: 'Profile', href: '/settings/profile' },
      { id: 'billing', label: 'Billing', href: '/settings/billing', requires: 'billing' },
    ],
  },
  { id: 'admin', label: 'Admin', href: '/admin', icon: <ShieldIcon />, requires: 'admin' },
];

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const permissions = ['billing']; // from your auth system
  const { items, breadcrumbs } = buildNav({ config: NAV, pathname, permissions });

  return (
    <AppShell
      commandBar
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <span className="text-lg font-bold">My App</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav items={items} />
          </SidebarContent>
          <SidebarFooter>
            <span className="text-sm text-muted-foreground">v1.0</span>
          </SidebarFooter>
        </Sidebar>
      }
      topBar={
        <TopBar
          left={<><SidebarTrigger /><Breadcrumbs config={NAV} pathname={pathname} permissions={permissions} /></>}
          right={<ThemeToggleDropdown />}
        />
      }
      footer={<Footer>Built with next-shell</Footer>}
    >
      <CommandBarActions config={NAV} pathname={pathname} permissions={permissions} />
      {children}
    </AppShell>
  );
}
```

## Page pattern

```tsx
// app/(shell)/dashboard/page.tsx
'use client';

import { PageHeader, ContentContainer } from '@jonmatum/next-shell/layout';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@jonmatum/next-shell/primitives';
import { formatCurrency, formatRelativeTime } from '@jonmatum/next-shell/formatters';

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your account"
        actions={<Button>New project</Button>}
      />
      <ContentContainer size="lg" className="py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(48295, { currency: 'USD' })}</p>
            </CardContent>
          </Card>
        </div>
      </ContentContainer>
    </>
  );
}
```

## Auth pattern

```tsx
// app/providers.tsx
'use client';

import { AppProviders } from '@jonmatum/next-shell/providers';
import { AuthProvider } from '@jonmatum/next-shell/auth';
import { createMockAuthAdapter } from '@jonmatum/next-shell/auth/mock';

const mockAuth = createMockAuthAdapter({
  user: { id: '1', name: 'Demo User', email: 'demo@example.com', roles: ['admin'] },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders themeProps={{ defaultTheme: 'system', enableSystem: true }}>
      <AuthProvider adapter={mockAuth}>
        {children}
      </AuthProvider>
    </AppProviders>
  );
}
```

### Auth guards in pages

```tsx
import { SignedIn, SignedOut, RoleGate, useUser } from '@jonmatum/next-shell/auth';

function AdminPage() {
  const user = useUser();
  return (
    <>
      <SignedOut><p>Please sign in</p></SignedOut>
      <SignedIn>
        <p>Welcome, {user?.name}</p>
        <RoleGate role="admin" fallback={<p>Admin access required</p>}>
          <AdminPanel />
        </RoleGate>
      </SignedIn>
    </>
  );
}
```

## Hooks cheat sheet

```tsx
import {
  useDisclosure,      // { isOpen, open, close, toggle, onOpenChange }
  useLocalStorage,    // [value, setValue] — persists across sessions
  useCopyToClipboard, // { copy, isCopied }
  useHotkey,          // useHotkey('k', callback, { meta: true })
  useBreakpoint,      // { current, isMobile, isDesktop }
  useDebouncedValue,  // debounced version of a value
} from '@jonmatum/next-shell/hooks';
```

## Error pages

```tsx
// app/not-found.tsx (Server Component — import from /layout/server)
import { NotFound } from '@jonmatum/next-shell/layout/server';
export default function NotFoundPage() { return <NotFound />; }

// app/error.tsx (Client Component)
'use client';
import { ErrorPage } from '@jonmatum/next-shell/layout';
export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorPage status="500" title="Something went wrong" description={error.message}
    actions={<Button onClick={reset}>Try again</Button>} />;
}
```

## Theming

### Brand overrides (JS)

```tsx
import type { BrandOverrides } from '@jonmatum/next-shell/tokens';

const brand: BrandOverrides = {
  light: { primary: 'oklch(0.6 0.2 145)', 'primary-foreground': 'oklch(1 0 0)' },
  dark: { primary: 'oklch(0.75 0.15 145)' },
  radius: '0.75rem',
};

<ThemeProvider brand={brand}>{children}</ThemeProvider>
```

### Preset palettes (CSS)

```css
@import '@jonmatum/next-shell/styles/preset.css';
@import '@jonmatum/next-shell/styles/presets/green.css';
```

Available: `green.css`, `neutral.css`, `orange.css`, `red.css`, `violet.css`

### Generate from hex

```bash
npx next-shell-theme --color '#10b981' --format both
```

## Semantic token reference

### Colors (all have Tailwind utilities)

Surface pairs: `background/foreground`, `card/card-foreground`, `popover/popover-foreground`, `muted/muted-foreground`, `accent/accent-foreground`, `primary/primary-foreground`, `secondary/secondary-foreground`, `destructive/destructive-foreground`, `success/success-foreground`, `warning/warning-foreground`, `info/info-foreground`

Standalone: `border`, `input`, `ring`, `overlay`

Sidebar: `sidebar-background`, `sidebar-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring`

Charts: `chart-1` through `chart-5`

### Other tokens

- Radius: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl` (all derived from `--radius`)
- Motion: `duration-fast` (150ms), `duration-normal` (250ms), `duration-slow` (400ms)
- Easing: `ease-standard`, `ease-emphasized`, `ease-decelerate`, `ease-accelerate`
- Shadows: `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`

## Composition recipes

### DatePicker

```tsx
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '@jonmatum/next-shell/primitives';
import { cn } from '@jonmatum/next-shell/core';
```

### DataTable

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@jonmatum/next-shell/primitives';
// + @tanstack/react-table for sorting/filtering/pagination
```

### Combobox

```tsx
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
  Popover, PopoverContent, PopoverTrigger } from '@jonmatum/next-shell/primitives';
```

## Common patterns

### Toast notifications

```tsx
import { toast } from 'sonner'; // direct import, not from next-shell

toast.success('Saved!');
toast.error('Failed', { description: 'Try again' });
toast.promise(saveData(), { loading: 'Saving...', success: 'Done!', error: 'Failed' });
```

### Form with validation

```tsx
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
  Input, Button } from '@jonmatum/next-shell/primitives';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
```

### Dialog with useDisclosure

```tsx
import { useDisclosure } from '@jonmatum/next-shell/hooks';
import { Dialog, DialogContent, DialogTitle, Button } from '@jonmatum/next-shell/primitives';

function MyDialog() {
  const { isOpen, open, onOpenChange } = useDisclosure();
  return (
    <>
      <Button onClick={open}>Open</Button>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent><DialogTitle>Title</DialogTitle></DialogContent>
      </Dialog>
    </>
  );
}
```
