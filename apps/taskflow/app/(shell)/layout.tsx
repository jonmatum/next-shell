'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { LayoutDashboardIcon, FolderKanbanIcon, UsersIcon, SettingsIcon } from 'lucide-react';

import {
  AppShell,
  buildNav,
  SidebarNav,
  Breadcrumbs,
  CommandBarActions,
  TopBar,
  Footer,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from '@jonmatum/next-shell/layout';
import type { NavConfig, ResolvedNavItem } from '@jonmatum/next-shell/layout';
import { ThemeToggleDropdown } from '@jonmatum/next-shell/providers';
import { useSession, useUser } from '@jonmatum/next-shell/auth';
import { Avatar, AvatarFallback } from '@jonmatum/next-shell/primitives';

/* ────────────────────────────────────────────────────────────────────────
 * Navigation config
 * ──────────────────────────────────────────────────────────────────────── */

const NAV_CONFIG: NavConfig = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboardIcon className="size-4" />,
    matcher: 'prefix',
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/projects',
    icon: <FolderKanbanIcon className="size-4" />,
    matcher: 'prefix',
  },
  {
    id: 'team',
    label: 'Team',
    href: '/team',
    icon: <UsersIcon className="size-4" />,
    requires: 'pm',
    matcher: 'prefix',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: <SettingsIcon className="size-4" />,
    matcher: 'prefix',
  },
];

/* ────────────────────────────────────────────────────────────────────────
 * Shell layout
 * ──────────────────────────────────────────────────────────────────────── */

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useSession();
  const user = useUser();

  const permissions = [...(user?.roles ?? []), ...(user?.scopes ?? [])];

  const { items } = buildNav({
    config: NAV_CONFIG,
    pathname,
    permissions,
  });

  const handleNavigate = (item: ResolvedNavItem) => {
    if (item.href) router.push(item.href);
  };

  return (
    <AppShell
      commandBar
      sidebar={
        <Sidebar>
          <SidebarHeader className="border-border border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md text-sm font-bold">
                TF
              </div>
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-semibold">TaskFlow</span>
                <span className="text-muted-foreground text-xs">Project Management</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarNav items={items} label="Navigation" onNavigate={handleNavigate} />
          </SidebarContent>

          <SidebarFooter className="border-border border-t px-4 py-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {user.name
                      ? user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                      : '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="text-foreground truncate text-sm font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                </div>
              </div>
            ) : null}
          </SidebarFooter>
        </Sidebar>
      }
      topBar={
        <TopBar
          left={
            <>
              <SidebarTrigger />
              <Breadcrumbs config={NAV_CONFIG} pathname={pathname} permissions={permissions} />
            </>
          }
          right={<ThemeToggleDropdown />}
        />
      }
      footer={
        <Footer>
          <span>&copy; {new Date().getFullYear()} TaskFlow</span>
          <span>Built with @jonmatum/next-shell</span>
        </Footer>
      }
    >
      <CommandBarActions
        config={NAV_CONFIG}
        pathname={pathname}
        permissions={permissions}
        onNavigate={handleNavigate}
      />
      <div className="p-4 sm:p-6 lg:p-8">{children}</div>
    </AppShell>
  );
}
