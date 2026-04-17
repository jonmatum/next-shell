'use client';

/**
 * Providers subpath (client-only surface).
 *
 * Everything re-exported here is safe to use from a Next.js client component.
 * Server-only helpers (e.g. cookie readers) live at
 * `@jonmatum/next-shell/providers/server` so they can be imported from a
 * Server Component without forcing a client boundary.
 */

// ── Composer ───────────────────────────────────────────────────────────────
export { AppProviders } from './app-providers.js';
export type { AppProvidersProps } from './app-providers.js';

// ── Individual providers (opt-in composition) ──────────────────────────────
export { QueryProvider } from './query/query-provider.js';
export type { QueryProviderProps } from './query/query-provider.js';
export { makeServerQueryClient } from './query/query-ssr.js';

export { ToastProvider } from './toast/toast-provider.js';
export type { ToastProviderProps } from './toast/toast-provider.js';

export { ErrorBoundary } from './error/error-boundary.js';
export type { ErrorBoundaryProps, ErrorBoundaryFallbackProps } from './error/error-boundary.js';

export { I18nProvider, useI18n } from './i18n/i18n-provider.js';
export type { I18nProviderProps, I18nAdapter } from './i18n/i18n-provider.js';

// ── Theme (Phase 2) ────────────────────────────────────────────────────────
export { ThemeProvider } from './theme/theme-provider.js';
export type { ThemeProviderProps } from './theme/theme-provider.js';

export { useTheme } from './theme/use-theme.js';
export type { ThemeValue, ResolvedTheme, UseThemeResult } from './theme/use-theme.js';

export { ThemeToggle } from './theme/theme-toggle.js';
export type { ThemeToggleProps } from './theme/theme-toggle.js';

export { ThemeToggleDropdown } from './theme/theme-toggle-dropdown.js';
export type { ThemeToggleDropdownProps } from './theme/theme-toggle-dropdown.js';
