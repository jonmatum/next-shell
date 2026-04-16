/**
 * Layout — server-safe surface.
 *
 * Subpath: `@jonmatum/next-shell/layout/server`
 *
 * Everything exposed here is callable from a Next.js Server Component,
 * Route Handler, or Middleware without dragging a client boundary into
 * the caller's module graph. Includes:
 *   - SSR sidebar-state cookie helpers
 *   - The stateless content surfaces (ContentContainer, PageHeader,
 *     Footer, EmptyState, ErrorState, LoadingState) — duplicated here
 *     so RSC consumers can compose them in a Server Component page
 *     without importing the client-boundary `/layout` barrel
 *
 * The interactive islands (Sidebar, SidebarProvider, TopBar,
 * CommandBar, AppShell, useSidebar) are client-only and live at
 * `@jonmatum/next-shell/layout`.
 */

// SSR sidebar-state cookie helpers
export {
  SIDEBAR_STATE_COOKIE_NAME,
  SIDEBAR_STATE_COOKIE_MAX_AGE,
  getSidebarStateFromCookies,
  buildSidebarStateCookieHeader,
  isSidebarState,
} from '../sidebar-state-cookie.js';
export type { SidebarState } from '../sidebar-state-cookie.js';

// Stateless content surfaces — re-exported for RSC consumption.
export { ContentContainer, contentContainerVariants } from '../content-container.js';
export type { ContentContainerProps } from '../content-container.js';
export { Footer } from '../footer.js';
export type { FooterProps } from '../footer.js';
export { PageHeader } from '../page-header.js';
export type { PageHeaderProps } from '../page-header.js';
export { EmptyState, ErrorState, LoadingState } from '../status-states.js';
export type { EmptyStateProps, ErrorStateProps, LoadingStateProps } from '../status-states.js';
