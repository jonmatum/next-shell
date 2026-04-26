'use client';

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppShell,
  TopBar,
  Footer,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarNav,
  SidebarSeparator,
  Breadcrumbs,
  buildNav,
  CommandBarActions,
} from '@jonmatum/next-shell/layout';
import { useUser } from '@jonmatum/next-shell/auth';
import { Button, Avatar, AvatarFallback, Separator } from '@jonmatum/next-shell/primitives';
import { LayoutDashboard, Settings, Shield, Database, Bell, LogOut } from 'lucide-react';
import type { NavConfig, ResolvedNavItem } from '@jonmatum/next-shell/layout';

/* ────────────────────────────────────────────────────────────────────────
 * Navigation config
 * ──────────────────────────────────────────────────────────────────────── */

const NAV_CONFIG: NavConfig = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
  { id: 'data', label: 'Data Table', href: '/data', icon: <Database /> },
  { id: 'admin', label: 'Admin', href: '/admin', icon: <Shield />, requires: ['admin'] },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings /> },
];

/* ────────────────────────────────────────────────────────────────────────
 * Sidebar
 * ──────────────────────────────────────────────────────────────────────── */

function ShellSidebar({ pathname }: { pathname: string }) {
  const user = useUser();
  const { items } = buildNav({
    config: NAV_CONFIG,
    pathname,
    permissions: user?.roles ?? [],
  });
  return (
    <Sidebar>
      <SidebarHeader className="border-sidebar-border flex flex-row items-center gap-3 border-b px-3 py-3">
        <SidebarTrigger />
        <span
          className="truncate text-sm font-semibold tracking-tight"
          style={{ fontFamily: '"BigBlue Terminal", monospace' }}
        >
          next-shell
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav items={items} />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-3 px-1 py-1">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">
              {(user?.name ?? 'DU')
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium">{user?.name ?? 'Demo User'}</p>
            <p className="text-muted-foreground truncate text-xs">
              {user?.email ?? 'demo@example.com'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label="Sign out"
            onClick={() => {
              /* mock sign-out */
              window.location.href = '/';
            }}
          >
            <LogOut className="size-3.5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Top bar
 * ──────────────────────────────────────────────────────────────────────── */

function ShellTopBar({ pathname }: { pathname: string }) {
  const user = useUser();
  return (
    <TopBar
      left={<Breadcrumbs config={NAV_CONFIG} pathname={pathname} />}
      right={
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground hidden text-sm sm:block">
            {user?.name ?? 'Demo User'}
          </span>
          <Separator orientation="vertical" className="mx-1 h-4" />
          <Button variant="ghost" size="icon" className="size-7" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
        </div>
      }
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Shell layout
 * ──────────────────────────────────────────────────────────────────────── */

export default function ShellLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <AppShell
      commandBar
      sidebar={<ShellSidebar pathname={pathname} />}
      topBar={<ShellTopBar pathname={pathname} />}
      footer={<Footer>next-shell example app</Footer>}
    >
      <CommandBarActions
        config={NAV_CONFIG}
        pathname={pathname}
        permissions={['admin']}
        onNavigate={(item: ResolvedNavItem) => {
          if (item.href) router.push(item.href);
        }}
      />
      {children}
    </AppShell>
  );
}
