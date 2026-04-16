'use client';

/**
 * Providers subpath (client-only surface).
 *
 * Everything re-exported here is safe to use from a Next.js client component.
 * Server-only helpers (e.g. cookie readers) live at
 * `@jonmatum/next-shell/providers/server` so they can be imported from a
 * Server Component without forcing a client boundary.
 */

export { ThemeProvider } from './theme/theme-provider.js';
export type { ThemeProviderProps } from './theme/theme-provider.js';

export { useTheme } from './theme/use-theme.js';
export type { ThemeValue, ResolvedTheme, UseThemeResult } from './theme/use-theme.js';

export { ThemeToggle } from './theme/theme-toggle.js';
export type { ThemeToggleProps } from './theme/theme-toggle.js';
