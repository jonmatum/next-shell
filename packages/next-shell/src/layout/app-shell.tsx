'use client';

import * as React from 'react';

import { cn } from '@/core/cn';

import { CommandBarProvider } from './command-bar.js';
import { SidebarInset, SidebarProvider } from './sidebar.js';
import type { SidebarState } from './sidebar-state-cookie.js';

export interface AppShellProps {
  /**
   * Page content. Rendered inside the main scrollable area between
   * `topBar` and `footer`.
   */
  readonly children: React.ReactNode;
  /**
   * Sidebar nav tree. When omitted the sidebar rail and provider are not
   * rendered and the content stretches to full width.
   */
  readonly sidebar?: React.ReactNode;
  /**
   * Top bar. Pass a `<TopBar … />` or any element — rendered as a sticky
   * `<header>` inside `SidebarInset`.
   */
  readonly topBar?: React.ReactNode;
  /**
   * Footer. Rendered below the content area inside `SidebarInset`.
   */
  readonly footer?: React.ReactNode;
  /**
   * Mount a `CommandBarProvider` wrapping the whole shell. Consumers can
   * then call `useCommandBarActions` anywhere in the tree.
   */
  readonly commandBar?: boolean;
  /**
   * Initial sidebar open/closed state read from the SSR cookie so the
   * server render matches the first client paint without a flash.
   */
  readonly initialSidebarState?: SidebarState;
  readonly className?: string;
}

/**
 * Root orchestrator for the app shell. Composes `SidebarProvider`,
 * optional `CommandBarProvider`, and the grid that houses the sidebar,
 * top bar, content, and footer.
 *
 * Usage:
 * ```tsx
 * <AppShell
 *   sidebar={<Nav />}
 *   topBar={<TopBar left={<Brand />} right={<UserMenu />} />}
 *   footer={<Footer />}
 *   commandBar
 *   initialSidebarState={cookieSidebarState}
 * >
 *   {children}
 * </AppShell>
 * ```
 */
export function AppShell({
  children,
  sidebar,
  topBar,
  footer,
  commandBar = false,
  initialSidebarState,
  className,
}: AppShellProps) {
  const hasSidebar = Boolean(sidebar);
  const defaultOpen = initialSidebarState !== 'closed';

  const shell = hasSidebar ? (
    <SidebarProvider defaultOpen={defaultOpen}>
      {sidebar}
      <SidebarInset className={cn('flex min-h-svh flex-col', className)}>
        {topBar}
        <div className="flex-1">{children}</div>
        {footer}
      </SidebarInset>
    </SidebarProvider>
  ) : (
    <div className={cn('flex min-h-svh flex-col', className)}>
      {topBar}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  );

  return commandBar ? <CommandBarProvider>{shell}</CommandBarProvider> : shell;
}
