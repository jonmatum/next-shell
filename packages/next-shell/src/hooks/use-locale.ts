'use client';

import { useI18n } from '../providers/i18n/i18n-provider.js';

/**
 * Returns the current locale string. Reads from `I18nProvider` if the
 * adapter exposes a `locale` property, otherwise falls back to
 * `navigator.language` on the client or `'en'` on the server.
 *
 * Use this to pass a consistent locale to the pure formatter functions:
 *
 * ```ts
 * const locale = useLocale();
 * const formatted = formatCurrency(price, 'USD', { locale });
 * ```
 */
export function useLocale(): string {
  const i18n = useI18n();
  // If the adapter exposes a locale, use it.
  if (i18n && 'locale' in i18n && typeof (i18n as { locale?: unknown }).locale === 'string') {
    return (i18n as { locale: string }).locale;
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }
  return 'en';
}
