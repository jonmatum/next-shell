'use client';

import * as React from 'react';

import { cn } from '@/core/cn';
import { CommandBar } from './command-bar.js';
import { CommandBarProvider } from './command-bar-context.js';
import type { CommandBarProviderProps } from './command-bar-context.js';
import { Footer } from './footer.js';
import { Sidebar, SidebarInset, SidebarProvider } from './sidebar.js';
import { TopBar } from './topbar.js';
import type { TopBarProps } from './topbar.js';

export type AppShellDensity = 'compact' | 'comfortable' | 'spacious';

export interface AppShellProps {
  /** Content rendered inside the sidebar panel. Omit to hide the sidebar. */
  readonly sidebar?: React.ReactNode;
  /** Default sidebar open state (uncontrolled). Pass the SSR cookie value here. */
  readonly defaultSidebarOpen?: boolean;
  /** Controlled sidebar open state. */
  readonly sidebarOpen?: boolean;
  /** Called when sidebar open state changes. */
  readonly onSidebarOpenChange?: (open: boolean) => void;
  /** Left slot for TopBar — typically brand + breadcrumbs. */
  readonly topBarLeft?: React.ReactNode;
  /** Center slot for TopBar — typically `<CommandBarTrigger />`. */
  readonly topBarCenter?: React.ReactNode;
  /** Right slot for TopBar — typically user menu + theme toggle. */
  readonly topBarRight?: React.ReactNode;
  /** Sticky TopBar. Defaults to `true`. */
  readonly topBarSticky?: TopBarProps['sticky'];
  /** Content rendered as children of `<Footer>`. Omit to hide the footer. */
  readonly footer?: React.ReactNode;
  /**
   * Keyboard shortcut that opens the command bar. Defaults to `'k'` (⌘K / Ctrl+K).
   * Set `null` to disable the global listener.
   */
  readonly commandBarShortcut?: CommandBarProviderProps['shortcut'];
  /** Controlled open state for the command bar. */
  readonly commandBarOpen?: CommandBarProviderProps['open'];
  /** Called when command bar open state changes. */
  readonly onCommandBarOpenChange?: CommandBarProviderProps['onOpenChange'];
  /**
   * Space-density preset. Sets `data-density` on the root element so
   * descendants can scope padding/gap via `[data-density=compact]` selectors.
   * Defaults to `'comfortable'`.
   */
  readonly density?: AppShellDensity;
  readonly className?: string;
  readonly children: React.ReactNode;
}

/**
 * Root app-shell orchestrator. Composes SidebarProvider + Sidebar,
 * TopBar, CommandBarProvider + CommandBar, and an optional Footer into a
 * full-screen chrome layout.
 *
 * ```tsx
 * <AppShell
 *   defaultSidebarOpen={sidebarState === 'open'}
 *   sidebar={<AppSidebar />}
 *   topBarLeft={<Brand />}
 *   topBarCenter={<CommandBarTrigger />}
 *   topBarRight={<UserMenu />}
 * >
 *   {children}
 * </AppShell>
 * ```
 */
export function AppShell({
  sidebar,
  defaultSidebarOpen = true,
  sidebarOpen,
  onSidebarOpenChange,
  topBarLeft,
  topBarCenter,
  topBarRight,
  topBarSticky = true,
  footer,
  commandBarShortcut = 'k',
  commandBarOpen,
  onCommandBarOpenChange,
  density = 'comfortable',
  className,
  children,
}: AppShellProps) {
  const hasSidebar = sidebar !== undefined && sidebar !== null;
  const hasFooter = footer !== undefined && footer !== null;

  return (
    <CommandBarProvider
      shortcut={commandBarShortcut}
      open={commandBarOpen}
      onOpenChange={onCommandBarOpenChange}
    >
      <SidebarProvider
        defaultOpen={defaultSidebarOpen}
        open={sidebarOpen}
        onOpenChange={onSidebarOpenChange}
        data-slot="app-shell"
        data-density={density}
        className={cn(className)}
      >
        {hasSidebar ? <Sidebar>{sidebar}</Sidebar> : null}
        <SidebarInset>
          <TopBar
            left={topBarLeft}
            center={topBarCenter}
            right={topBarRight}
            sticky={topBarSticky}
          />
          <CommandBar />
          <div data-slot="app-shell-body" className="flex flex-1 flex-col">
            {children}
          </div>
          {hasFooter ? <Footer>{footer}</Footer> : null}
        </SidebarInset>
      </SidebarProvider>
    </CommandBarProvider>
  );
}
