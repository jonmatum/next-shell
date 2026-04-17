'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AppShell, TopBar, SidebarNav, Breadcrumbs, buildNav } from '@jonmatum/next-shell/layout';
import { ThemeToggleDropdown } from '@jonmatum/next-shell/providers';
import { useUser } from '@jonmatum/next-shell/auth';
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
  return <SidebarNav items={items} label="Menu" />;
}

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
          <ThemeToggleDropdown />
          <Bell className="text-muted-foreground size-4 cursor-pointer" />
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
      footer={
        <footer className="border-border text-muted-foreground border-t px-6 py-3 text-xs">
          next-shell example app
        </footer>
      }
    >
      {children}
    </AppShell>
  );
}
