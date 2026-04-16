/**
 * Providers — server-only helpers.
 *
 * These helpers do not depend on React and can be called from Next.js
 * Server Components, Route Handlers, or Middleware. They are deliberately
 * split out from `@jonmatum/next-shell/providers` so importing them does
 * not drag a client boundary into a server module.
 */

export {
  THEME_COOKIE_NAME,
  THEME_COOKIE_MAX_AGE,
  getThemeFromCookies,
  buildThemeCookieHeader,
  isThemeValue,
} from '../theme/theme-cookie.js';
export type { CookieReader } from '../theme/theme-cookie.js';
