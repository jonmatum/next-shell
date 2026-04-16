/**
 * SSR-safe theme persistence helpers.
 *
 * `next-themes` persists the theme to `localStorage` on the client, which is
 * only readable after hydration. That leaves a one-frame window on first
 * paint where the server-rendered HTML uses the default theme, and the
 * client immediately swaps to the stored preference — the classic "theme
 * flash" problem.
 *
 * The fix: also persist the theme to a cookie, which the server *can* read
 * before rendering. The consumer app can then render `<html data-theme="…">`
 * with the correct attribute on the first paint.
 *
 * These helpers are deliberately framework-agnostic — pass in any
 * `cookies()` / `request.cookies` / manual cookie-jar object that exposes
 * a `get(name)` method.
 */

import type { ThemeValue } from './use-theme.js';

export const THEME_COOKIE_NAME = 'next-shell-theme';

/** One year, in seconds. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Minimal interface compatible with Next.js `cookies()` (from `next/headers`)
 * and standard cookie-jar libraries. Accepts any shape exposing a `get(name)`
 * method that returns `{ value: string } | undefined`.
 */
export interface CookieReader {
  readonly get: (name: string) => { readonly value: string } | undefined;
}

/** Type guard for a well-formed `ThemeValue` string. */
export function isThemeValue(value: unknown): value is ThemeValue {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Read the persisted theme from a cookie reader. Returns `null` when the
 * cookie is missing or contains an unknown value.
 */
export function getThemeFromCookies(cookies: CookieReader): ThemeValue | null {
  const cookie = cookies.get(THEME_COOKIE_NAME);
  if (!cookie) return null;
  return isThemeValue(cookie.value) ? cookie.value : null;
}

/**
 * Build a `Set-Cookie` header value that persists a theme for one year.
 * Suitable for Next.js Route Handlers or middleware.
 */
export function buildThemeCookieHeader(theme: ThemeValue): string {
  return [
    `${THEME_COOKIE_NAME}=${theme}`,
    `Max-Age=${THEME_COOKIE_MAX_AGE}`,
    'Path=/',
    'SameSite=Lax',
  ].join('; ');
}
