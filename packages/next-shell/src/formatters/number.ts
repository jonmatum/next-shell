/**
 * Locale-aware number / currency / file-size formatters built on `Intl`.
 * Pure functions — safe in Server Components, Route Handlers, and tests.
 */

export interface FormatNumberOptions extends Intl.NumberFormatOptions {
  readonly locale?: string;
}

/**
 * Format a number with `Intl.NumberFormat`.
 *
 * ```ts
 * formatNumber(1234567.89) // "1,234,567.89"
 * formatNumber(1234567.89, { locale: 'de' }) // "1.234.567,89"
 * ```
 */
export function formatNumber(value: number, options: FormatNumberOptions = {}): string {
  const { locale = 'en', ...intlOptions } = options;
  return new Intl.NumberFormat(locale, intlOptions).format(value);
}

/**
 * Format a number as currency.
 *
 * ```ts
 * formatCurrency(9.99, 'USD') // "$9.99"
 * formatCurrency(9.99, 'EUR', { locale: 'de' }) // "9,99 €"
 * ```
 */
export function formatCurrency(
  value: number,
  currency: string,
  options: FormatNumberOptions = {},
): string {
  const { locale = 'en', ...intlOptions } = options;
  return new Intl.NumberFormat(locale, { style: 'currency', currency, ...intlOptions }).format(
    value,
  );
}

/**
 * Format a number as a percentage (0–1 input, e.g. 0.75 → "75%").
 *
 * ```ts
 * formatPercent(0.75) // "75%"
 * formatPercent(0.123, { maximumFractionDigits: 1 }) // "12.3%"
 * ```
 */
export function formatPercent(value: number, options: FormatNumberOptions = {}): string {
  const { locale = 'en', ...intlOptions } = options;
  return new Intl.NumberFormat(locale, { style: 'percent', ...intlOptions }).format(value);
}

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

export interface FormatFileSizeOptions {
  readonly locale?: string;
  /** Number of decimal places. Default: `1`. */
  readonly decimals?: number;
}

/**
 * Format a byte count as a human-readable file size string.
 *
 * ```ts
 * formatFileSize(1536) // "1.5 KB"
 * formatFileSize(1073741824) // "1.0 GB"
 * ```
 */
export function formatFileSize(bytes: number, options: FormatFileSizeOptions = {}): string {
  const { locale = 'en', decimals = 1 } = options;
  if (bytes === 0) return '0 B';
  const i = Math.min(
    Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)),
    FILE_SIZE_UNITS.length - 1,
  );
  const value = bytes / Math.pow(1024, i);
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(value)} ${FILE_SIZE_UNITS[i]}`;
}

export interface FormatDurationOptions {
  readonly locale?: string;
  /** How many parts to show. Default: `2` (e.g. "2 hr, 3 min"). */
  readonly parts?: number;
}

/**
 * Format a duration in milliseconds as a human-readable string.
 *
 * ```ts
 * formatDuration(7383000) // "2 hr, 3 min"
 * formatDuration(90000, { parts: 1 }) // "1 min"
 * ```
 */
export function formatDuration(ms: number, options: FormatDurationOptions = {}): string {
  const { parts = 2 } = options;
  const abs = Math.abs(ms);
  const segments: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [Math.floor(abs / 3_600_000), 'hour'],
    [Math.floor((abs % 3_600_000) / 60_000), 'minute'],
    [Math.floor((abs % 60_000) / 1_000), 'second'],
  ];
  const active = segments.filter(([v]) => v > 0);
  if (active.length === 0) return '0 sec';
  return active
    .slice(0, parts)
    .map(([v, u]) => `${v} ${v === 1 ? u : `${u}s`}`)
    .join(', ');
}
