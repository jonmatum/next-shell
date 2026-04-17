'use client';

import * as React from 'react';

export interface I18nAdapter {
  /**
   * Translate a key. The minimal contract — extend the adapter type for
   * interpolation, pluralisation, etc.
   */
  readonly t: (key: string, options?: Record<string, unknown>) => string;
}

const I18nContext = React.createContext<I18nAdapter | null>(null);

/**
 * Read the current i18n adapter. Returns `null` when no `I18nProvider`
 * is mounted — callers should fall back to the raw key when null.
 */
export function useI18n(): I18nAdapter | null {
  return React.useContext(I18nContext);
}

export interface I18nProviderProps {
  readonly children: React.ReactNode;
  /**
   * An i18n adapter. Plug in any library (next-intl, react-i18next, …)
   * by wrapping its `t` function. When omitted the provider is a no-op
   * and `useI18n()` returns `null`.
   */
  readonly adapter?: I18nAdapter;
}

/**
 * Thin adapter wrapper for i18n. Defaults to a no-op so it can be
 * included in `<AppProviders>` without forcing a dependency on any i18n
 * library. Plug in `next-intl`, `react-i18next`, etc. via the `adapter`
 * prop.
 *
 * ```tsx
 * import { useTranslations } from 'next-intl';
 *
 * function Root({ children }: { children: React.ReactNode }) {
 *   const t = useTranslations();
 *   return (
 *     <I18nProvider adapter={{ t }}>
 *       {children}
 *     </I18nProvider>
 *   );
 * }
 * ```
 */
export function I18nProvider({ children, adapter }: I18nProviderProps) {
  return <I18nContext.Provider value={adapter ?? null}>{children}</I18nContext.Provider>;
}
