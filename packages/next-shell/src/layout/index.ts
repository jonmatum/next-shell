/**
 * Layout — client-boundary surface.
 *
 * Subpath: `@jonmatum/next-shell/layout`
 *
 * The tsup post-build hook prepends `'use client'` to the bundled
 * output (see `CLIENT_ENTRIES` in tsup.config.ts) because `Sidebar` +
 * `SidebarProvider` use React context and effects.
 *
 * For Server-Component consumption of the stateless surfaces
 * (ContentContainer, PageHeader, Footer, status states) + the SSR
 * cookie helpers, import from `@jonmatum/next-shell/layout/server`
 * instead — it has no client boundary.
 */

// Stateless content surfaces — also re-exported from `/layout/server`
// for RSC consumers. Duplicated on both subpaths so the ergonomics are
// straightforward regardless of the consumer's render context.
export { ContentContainer, contentContainerVariants } from './content-container.js';
export type { ContentContainerProps } from './content-container.js';
export { Footer } from './footer.js';
export type { FooterProps } from './footer.js';
export { PageHeader } from './page-header.js';
export type { PageHeaderProps } from './page-header.js';
export { EmptyState, ErrorState, LoadingState } from './status-states.js';
export type { EmptyStateProps, ErrorStateProps, LoadingStateProps } from './status-states.js';
export { TopBar } from './topbar.js';
export type { TopBarProps } from './topbar.js';

// Command palette (⌘K).
export {
  CommandBar,
  CommandBarProvider,
  CommandBarTrigger,
  useCommandBar,
  useCommandBarActions,
} from './command-bar.js';
export type {
  CommandAction,
  CommandBarProps,
  CommandBarProviderProps,
  CommandBarTriggerProps,
} from './command-bar.js';

// AppShell root orchestrator (Phase 4f).
export { AppShell } from './app-shell.js';
export type { AppShellDensity, AppShellProps } from './app-shell.js';

// Interactive sidebar (client-only).
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './sidebar.js';

// Cookie contract types + constants are also safe to import client-
// side (no React, no document access). Re-export for convenience.
export type { SidebarState } from './sidebar-state-cookie.js';
export {
  SIDEBAR_STATE_COOKIE_NAME,
  SIDEBAR_STATE_COOKIE_MAX_AGE,
  isSidebarState,
} from './sidebar-state-cookie.js';
