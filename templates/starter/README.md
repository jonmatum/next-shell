# next-shell Starter Template

A minimal Next.js 15 app pre-wired with [@jonmatum/next-shell](https://github.com/jonmatum/next-shell) -- sidebar layout, theme switching, auth scaffolding, and error pages out of the box.

## Quick start

```bash
npx degit jonmatum/next-shell/templates/starter my-app
cd my-app
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## What's included

| File                            | Purpose                                                     |
| ------------------------------- | ----------------------------------------------------------- |
| `app/layout.tsx`                | Root layout with Inter font + `<Providers>`                 |
| `app/providers.tsx`             | `AppProviders` (theme) + `AuthProvider` (mock adapter)      |
| `app/(shell)/layout.tsx`        | Shell layout with `AppShell`, `Sidebar`, `TopBar`, `Footer` |
| `app/(shell)/page.tsx`          | Dashboard page with `PageHeader` + `ContentContainer`       |
| `app/(shell)/settings/page.tsx` | Settings page with profile form + theme toggle              |
| `app/not-found.tsx`             | 404 page using `NotFound` component                         |
| `app/error.tsx`                 | Error boundary using `ErrorPage` component                  |
| `app/globals.css`               | Tailwind CSS v4 + next-shell preset                         |

## Customize the theme

The starter uses system theme detection by default. To change the default:

```tsx
// app/providers.tsx
<AppProviders themeProps={{ defaultTheme: 'dark' }}>
```

To override design tokens, add CSS custom properties to `app/globals.css` after the preset import:

```css
@import 'tailwindcss';
@source '../node_modules/@jonmatum/next-shell/dist/**/*.{js,cjs}';
@import '@jonmatum/next-shell/styles/preset.css';

/* Your overrides */
:root {
  --primary: oklch(0.62 0.19 260);
}
```

## Add a new page

1. Create the route file under `app/(shell)/`:

```tsx
// app/(shell)/analytics/page.tsx
'use client';

import { ContentContainer, PageHeader } from '@jonmatum/next-shell/layout';

export default function AnalyticsPage() {
  return (
    <ContentContainer>
      <PageHeader title="Analytics" description="View your analytics." />
      {/* your content */}
    </ContentContainer>
  );
}
```

2. Add it to the navigation in `app/(shell)/layout.tsx`:

```tsx
import { BarChart3 } from 'lucide-react';

const NAV_CONFIG: NavConfig = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
  { id: 'analytics', label: 'Analytics', href: '/analytics', icon: <BarChart3 /> },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings /> },
];
```

## Swap the auth adapter

The starter uses a mock adapter for instant prototyping. When you are ready to integrate a real identity provider, replace it in `app/providers.tsx`:

```tsx
// Before (mock)
import { createMockAuthAdapter } from '@jonmatum/next-shell/auth/mock';
const authAdapter = createMockAuthAdapter({
  user: {
    /* ... */
  },
});

// After (NextAuth.js)
import { createNextAuthAdapter } from '@jonmatum/next-shell/auth/nextauth';
const authAdapter = createNextAuthAdapter();
```

## Available subpath imports

```
@jonmatum/next-shell/core            -- cn(), version
@jonmatum/next-shell/primitives      -- Button, Card, Input, Label, etc.
@jonmatum/next-shell/layout          -- AppShell, Sidebar, TopBar, Footer, PageHeader, etc.
@jonmatum/next-shell/layout/server   -- NotFound, InternalServerError (server-safe)
@jonmatum/next-shell/providers       -- AppProviders, ThemeToggleDropdown
@jonmatum/next-shell/auth            -- AuthProvider, useUser, SignedIn, SignedOut
@jonmatum/next-shell/auth/mock       -- createMockAuthAdapter
@jonmatum/next-shell/auth/nextauth   -- createNextAuthAdapter
@jonmatum/next-shell/tokens          -- semantic token contract (TS)
@jonmatum/next-shell/hooks           -- shared hooks
@jonmatum/next-shell/formatters      -- formatting utilities
@jonmatum/next-shell/styles/preset.css
@jonmatum/next-shell/styles/tokens.css
```

## Learn more

- [next-shell repository](https://github.com/jonmatum/next-shell)
- [Next.js documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
