'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  AppShell,
  TopBar,
  Footer,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarNav,
  Breadcrumbs,
  buildNav,
} from '@jonmatum/next-shell/layout';
import { useUser } from '@jonmatum/next-shell/auth';
import { Button } from '@jonmatum/next-shell/primitives';
import { LayoutDashboard, Settings, Shield, Database, Bell } from 'lucide-react';
import type { NavConfig } from '@jonmatum/next-shell/layout';

const NAV_CONFIG: NavConfig = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
  { id: 'data', label: 'Data Table', href: '/data', icon: <Database /> },
  { id: 'admin', label: 'Admin', href: '/admin', icon: <Shield />, requires: ['admin'] },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings /> },
];

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
    </Sidebar>
  );
}

function ShellTopBar({ pathname }: { pathname: string }) {
  const user = useUser();
  return (
    <TopBar
      left={<Breadcrumbs config={NAV_CONFIG} pathname={pathname} />}
      right={
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground hidden text-sm sm:block">
            {user?.name ?? 'Demo User'}
          </span>
          <Button variant="ghost" size="icon" className="size-7" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
        </div>
      }
    />
  );
}

export default function ShellLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <AppShell
      commandBar
      sidebar={<ShellSidebar pathname={pathname} />}
      topBar={<ShellTopBar pathname={pathname} />}
      footer={<Footer>next-shell example app</Footer>}
    >
      {children}
    </AppShell>
  );
}
