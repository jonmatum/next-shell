/**
 * Formatters subpath — locale-aware, pure functions, no React dependency.
 *
 * ```ts
 * import { formatDate, formatCurrency, truncate } from '@jonmatum/next-shell/formatters';
 * ```
 *
 * All formatters accept an optional `locale` string. For React components,
 * compose with `useI18n()` or `useLocale()` from the hooks subpath to
 * derive the locale from context.
 */

// ── Date / time ────────────────────────────────────────────────────────────
export { formatDate, formatRelativeTime } from './date.js';
export type { FormatDateOptions, FormatRelativeTimeOptions } from './date.js';

// ── Numbers ────────────────────────────────────────────────────────────────
export {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatFileSize,
  formatDuration,
} from './number.js';
export type {
  FormatNumberOptions,
  FormatFileSizeOptions,
  FormatDurationOptions,
} from './number.js';

// ── Strings ───────────────────────────────────────────────────────────────
export { truncate, pluralize, toTitleCase, toKebabCase, slugify } from './string.js';
