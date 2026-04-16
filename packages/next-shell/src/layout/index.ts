/**
 * Layout — client surface.
 *
 * Subpath: `@jonmatum/next-shell/layout`
 *
 * The app-shell composition surface (Phase 4): AppShell, Sidebar, TopBar,
 * CommandBar, PageHeader, ContentContainer, Footer, EmptyState,
 * ErrorState, LoadingState. Currently only the types + isomorphic cookie
 * helpers are exposed; the components land in subsequent 4b–4f PRs.
 *
 * Server-only counterparts (SSR cookie readers) live at
 * `@jonmatum/next-shell/layout/server`.
 */

export type { SidebarState } from './sidebar-state-cookie.js';
export {
  SIDEBAR_STATE_COOKIE_NAME,
  SIDEBAR_STATE_COOKIE_MAX_AGE,
  isSidebarState,
} from './sidebar-state-cookie.js';
