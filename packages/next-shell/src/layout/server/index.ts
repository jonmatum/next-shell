/**
 * Layout — server-only helpers.
 *
 * These helpers do not depend on React and can be called from Next.js
 * Server Components, Route Handlers, or Middleware. They are deliberately
 * split out from `@jonmatum/next-shell/layout` so importing them does not
 * drag a client boundary into a server module.
 *
 * Currently exposes the SSR-safe sidebar state cookie helpers. Future
 * layout-level SSR helpers (density, topbar state, …) will surface here.
 */

export {
  SIDEBAR_STATE_COOKIE_NAME,
  SIDEBAR_STATE_COOKIE_MAX_AGE,
  getSidebarStateFromCookies,
  buildSidebarStateCookieHeader,
  isSidebarState,
} from '../sidebar-state-cookie.js';
export type { SidebarState } from '../sidebar-state-cookie.js';
