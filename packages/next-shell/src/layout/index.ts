/**
 * Layout — client surface.
 *
 * Subpath: `@jonmatum/next-shell/layout`
 *
 * The app-shell composition surface (Phase 4): AppShell, Sidebar, TopBar,
 * CommandBar, PageHeader, ContentContainer, Footer, EmptyState,
 * ErrorState, LoadingState. Currently the stateless content surfaces +
 * types + isomorphic cookie helpers are exposed. The interactive islands
 * (Sidebar, TopBar, CommandBar, AppShell) land in subsequent 4c–4f PRs.
 *
 * Every component in this module is server-renderable — safe to import
 * from a Next.js Server Component without forcing a client boundary.
 * Server-only SSR cookie helpers also live at
 * `@jonmatum/next-shell/layout/server`.
 */

export { ContentContainer, contentContainerVariants } from './content-container.js';
export type { ContentContainerProps } from './content-container.js';
export { Footer } from './footer.js';
export type { FooterProps } from './footer.js';
export { PageHeader } from './page-header.js';
export type { PageHeaderProps } from './page-header.js';
export { EmptyState, ErrorState, LoadingState } from './status-states.js';
export type { EmptyStateProps, ErrorStateProps, LoadingStateProps } from './status-states.js';

export type { SidebarState } from './sidebar-state-cookie.js';
export {
  SIDEBAR_STATE_COOKIE_NAME,
  SIDEBAR_STATE_COOKIE_MAX_AGE,
  isSidebarState,
} from './sidebar-state-cookie.js';
