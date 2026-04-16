/**
 * SSR-safe sidebar-state persistence helpers.
 *
 * The layout shell needs to know whether the sidebar is `"open"` or
 * `"closed"` **before** the first paint so the server-rendered HTML
 * matches the client state — avoiding a layout flash when the Sidebar
 * component hydrates and toggles from its default.
 *
 * Persist the state to a cookie (not `localStorage`) so the server can
 * read it during SSR. These helpers are framework-agnostic: pass in any
 * `cookies()` / `request.cookies` / manual cookie-jar object that
 * exposes a `get(name)` method.
 */

import type { CookieReader } from '../providers/server/index.js';

export type SidebarState = 'open' | 'closed';

export const SIDEBAR_STATE_COOKIE_NAME = 'next-shell-sidebar-state';

/** One year, in seconds. */
export const SIDEBAR_STATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Type guard for a well-formed `SidebarState` string. */
export function isSidebarState(value: unknown): value is SidebarState {
  return value === 'open' || value === 'closed';
}

/**
 * Read the persisted sidebar state from a cookie reader. Returns `null`
 * when the cookie is missing or contains an unknown value, letting the
 * caller fall back to a sensible default (typically `"open"` on desktop,
 * `"closed"` on mobile).
 */
export function getSidebarStateFromCookies(cookies: CookieReader): SidebarState | null {
  const cookie = cookies.get(SIDEBAR_STATE_COOKIE_NAME);
  if (!cookie) return null;
  return isSidebarState(cookie.value) ? cookie.value : null;
}

/**
 * Build a `Set-Cookie` header value that persists the sidebar state for
 * one year. Suitable for Next.js Route Handlers or middleware.
 */
export function buildSidebarStateCookieHeader(state: SidebarState): string {
  return [
    `${SIDEBAR_STATE_COOKIE_NAME}=${state}`,
    `Max-Age=${SIDEBAR_STATE_COOKIE_MAX_AGE}`,
    'Path=/',
    'SameSite=Lax',
  ].join('; ');
}
