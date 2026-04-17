/**
 * Locale-aware date / time formatters built on the `Intl` platform APIs.
 * All functions are pure — no React dependency — so they can be used in
 * Server Components, Route Handlers, and test code without a provider.
 *
 * Pass a `locale` string to override; defaults to `'en'`.
 */

export interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  readonly locale?: string;
}

/**
 * Format a date value (Date, timestamp, or ISO string) with
 * `Intl.DateTimeFormat`. Defaults to a short date representation.
 *
 * ```ts
 * formatDate(new Date()) // "4/16/2026"
 * formatDate(new Date(), { dateStyle: 'long', locale: 'de' }) // "16. April 2026"
 * ```
 */
export function formatDate(date: Date | number | string, options: FormatDateOptions = {}): string {
  const { locale = 'en', ...intlOptions } = options;
  const d = date instanceof Date ? date : new Date(date);
  const opts: Intl.DateTimeFormatOptions =
    Object.keys(intlOptions).length === 0 ? { dateStyle: 'short' } : intlOptions;
  return new Intl.DateTimeFormat(locale, opts).format(d);
}

export interface FormatRelativeTimeOptions {
  readonly locale?: string;
  readonly style?: Intl.RelativeTimeFormatStyle;
  /**
   * Anchor date to measure from. Defaults to `Date.now()`.
   * Passing a fixed anchor makes tests deterministic.
   */
  readonly now?: Date | number;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Format a date as a relative time string (e.g. "3 days ago", "in 2 hours").
 *
 * ```ts
 * formatRelativeTime(subDays(new Date(), 3)) // "3 days ago"
 * ```
 */
export function formatRelativeTime(
  date: Date | number | string,
  options: FormatRelativeTimeOptions = {},
): string {
  const { locale = 'en', style = 'long', now } = options;
  const d = date instanceof Date ? date.getTime() : new Date(date).getTime();
  const anchor = now instanceof Date ? now.getTime() : (now ?? Date.now());
  const diffMs = d - anchor;
  const absMs = Math.abs(diffMs);

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (absMs < MINUTE) {
    value = Math.round(diffMs / SECOND);
    unit = 'second';
  } else if (absMs < HOUR) {
    value = Math.round(diffMs / MINUTE);
    unit = 'minute';
  } else if (absMs < DAY) {
    value = Math.round(diffMs / HOUR);
    unit = 'hour';
  } else if (absMs < WEEK) {
    value = Math.round(diffMs / DAY);
    unit = 'day';
  } else if (absMs < MONTH) {
    value = Math.round(diffMs / WEEK);
    unit = 'week';
  } else if (absMs < YEAR) {
    value = Math.round(diffMs / MONTH);
    unit = 'month';
  } else {
    value = Math.round(diffMs / YEAR);
    unit = 'year';
  }

  return new Intl.RelativeTimeFormat(locale, { style, numeric: 'auto' }).format(value, unit);
}
