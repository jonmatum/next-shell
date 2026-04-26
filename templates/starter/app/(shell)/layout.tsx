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
  SidebarFooter,
  SidebarTrigger,
  SidebarNav,
  SidebarSeparator,
  Breadcrumbs,
  buildNav,
} from '@jonmatum/next-shell/layout';
import { useUser } from '@jonmatum/next-shell/auth';
import { Button, Avatar, AvatarFallback } from '@jonmatum/next-shell/primitives';
import { LayoutDashboard, Settings, LogOut } from 'lucide-react';
import type { NavConfig } from '@jonmatum/next-shell/layout';

/* ── Navigation config ────────────────────────────────────────────────── */

const NAV_CONFIG: NavConfig = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings /> },
];

/* ── Sidebar ──────────────────────────────────────────────────────────── */

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
        <span className="truncate text-sm font-semibold tracking-tight">My App</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav items={items} />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-3 px-1 py-1">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">
              {(user?.name ?? 'U')
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium">{user?.name ?? 'User'}</p>
            <p className="text-muted-foreground truncate text-xs">{user?.email ?? ''}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label="Sign out"
            onClick={() => {
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

/* ── Top bar ──────────────────────────────────────────────────────────── */

function ShellTopBar({ pathname }: { pathname: string }) {
  return <TopBar left={<Breadcrumbs config={NAV_CONFIG} pathname={pathname} />} />;
}

/* ── Shell layout ─────────────────────────────────────────────────────── */

export default function ShellLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AppShell
      sidebar={<ShellSidebar pathname={pathname} />}
      topBar={<ShellTopBar pathname={pathname} />}
      footer={<Footer>My App</Footer>}
    >
      {children}
    </AppShell>
  );
}
