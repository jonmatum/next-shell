'use client';

import * as React from 'react';
import { TooltipProvider } from '@/primitives/tooltip';

import { ErrorBoundary } from './error/error-boundary.js';
import type { ErrorBoundaryProps } from './error/error-boundary.js';
import { I18nProvider } from './i18n/i18n-provider.js';
import type { I18nProviderProps } from './i18n/i18n-provider.js';
import { QueryProvider } from './query/query-provider.js';
import type { QueryProviderProps } from './query/query-provider.js';
import { ThemeProvider } from './theme/theme-provider.js';
import type { ThemeProviderProps } from './theme/theme-provider.js';
import { ToastProvider } from './toast/toast-provider.js';
import type { ToastProviderProps } from './toast/toast-provider.js';

export interface AppProvidersProps {
  readonly children: React.ReactNode;

  // ── ThemeProvider ──────────────────────────────────────────────────────
  /**
   * Props forwarded to `<ThemeProvider>`. Pass `false` to disable the
   * theme layer entirely (rare — only if the consumer manages themes
   * separately).
   */
  readonly themeProps?: Partial<ThemeProviderProps> | false;

  // ── QueryProvider ──────────────────────────────────────────────────────
  /**
   * Props forwarded to `<QueryProvider>`. Pass `false` to opt out of the
   * TanStack Query layer (e.g. when the consumer wraps it separately).
   */
  readonly queryProps?: Partial<QueryProviderProps> | false;

  // ── ToastProvider ──────────────────────────────────────────────────────
  /**
   * Props forwarded to `<ToastProvider>`. Pass `false` to opt out.
   */
  readonly toastProps?: Partial<ToastProviderProps> | false;

  // ── ErrorBoundary ──────────────────────────────────────────────────────
  /**
   * Props forwarded to `<ErrorBoundary>`. Pass `false` to opt out.
   */
  readonly errorProps?: Partial<Omit<ErrorBoundaryProps, 'children'>> | false;

  // ── TooltipProvider ────────────────────────────────────────────────────
  /**
   * Props forwarded to Radix `<TooltipProvider>`. Pass `false` to opt out.
   */
  readonly tooltipProps?: Partial<React.ComponentProps<typeof TooltipProvider>> | false;

  // ── I18nProvider ───────────────────────────────────────────────────────
  /**
   * Props forwarded to `<I18nProvider>`. Omit to skip the i18n layer
   * (it defaults to a no-op anyway, but pass `false` to remove the wrapper
   * entirely).
   */
  readonly i18nProps?: Partial<I18nProviderProps> | false;
}

/**
 * One-import composer that nests all standard providers in the correct
 * order:
 *
 * ```
 * ThemeProvider
 *   QueryProvider
 *     ToastProvider (mounts Sonner Toaster)
 *       ErrorBoundary
 *         TooltipProvider
 *           I18nProvider
 *             {children}
 * ```
 *
 * Each layer can be replaced or disabled via its `*Props` prop. Usage:
 *
 * ```tsx
 * // app/layout.tsx
 * <html suppressHydrationWarning>
 *   <body>
 *     <AppProviders
 *       themeProps={{ defaultTheme: 'dark' }}
 *       queryProps={{ client: serverQueryClient }}
 *       i18nProps={false}
 *     >
 *       {children}
 *     </AppProviders>
 *   </body>
 * </html>
 * ```
 */
export function AppProviders({
  children,
  themeProps,
  queryProps,
  toastProps,
  errorProps,
  tooltipProps,
  i18nProps,
}: AppProvidersProps) {
  let tree = children;

  // Build inside-out so the outermost wrapper is applied last.

  if (i18nProps !== false) {
    tree = <I18nProvider {...(i18nProps ?? {})}>{tree}</I18nProvider>;
  }

  if (tooltipProps !== false) {
    tree = <TooltipProvider {...(tooltipProps ?? {})}>{tree}</TooltipProvider>;
  }

  if (errorProps !== false) {
    tree = <ErrorBoundary {...(errorProps ?? {})}>{tree}</ErrorBoundary>;
  }

  if (toastProps !== false) {
    tree = <ToastProvider {...(toastProps ?? {})}>{tree}</ToastProvider>;
  }

  if (queryProps !== false) {
    tree = <QueryProvider {...(queryProps ?? {})}>{tree}</QueryProvider>;
  }

  if (themeProps !== false) {
    tree = <ThemeProvider {...(themeProps ?? {})}>{tree}</ThemeProvider>;
  }

  return <>{tree}</>;
}
