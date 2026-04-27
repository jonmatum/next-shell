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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarTrigger,
  SidebarNav,
  Breadcrumbs,
  buildNav,
  CommandBarActions,
  CommandBarTrigger,
} from '@jonmatum/next-shell/layout';
import { useSession, useUser } from '@jonmatum/next-shell/auth';
import { ThemeToggleDropdown } from '@jonmatum/next-shell/providers';
import { packageVersion } from '@jonmatum/next-shell/core';
import {
  Button,
  Avatar,
  AvatarFallback,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@jonmatum/next-shell/primitives';
import {
  LayoutDashboardIcon,
  TableIcon,
  BoxIcon,
  ShieldIcon,
  SettingsIcon,
  UserIcon,
  PaletteIcon,
  BellIcon,
  LogOutIcon,
} from 'lucide-react';
import type { NavConfig, ResolvedNavItem } from '@jonmatum/next-shell/layout';

/* ────────────────────────────────────────────────────────────────────────
 * Navigation config — 6 pages with nested children + separator
 * ──────────────────────────────────────────────────────────────────────── */

const NAV_CONFIG: NavConfig = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboardIcon />,
    keywords: ['home', 'overview', 'stats'],
  },
  {
    id: 'data',
    label: 'Data',
    href: '/data',
    icon: <TableIcon />,
    keywords: ['table', 'grid', 'records'],
  },
  {
    id: 'components',
    label: 'Components',
    href: '/components',
    icon: <BoxIcon />,
    keywords: ['primitives', 'ui', 'widgets'],
  },
  {
    id: 'admin',
    label: 'Admin',
    href: '/admin',
    icon: <ShieldIcon />,
    requires: ['admin'],
    keywords: ['administration', 'manage'],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: <SettingsIcon />,
    keywords: ['preferences', 'config'],
    children: [
      {
        id: 'settings-profile',
        label: 'Profile',
        href: '/settings/profile',
        icon: <UserIcon />,
        keywords: ['account', 'user'],
      },
      {
        id: 'settings-appearance',
        label: 'Appearance',
        href: '/settings/appearance',
        icon: <PaletteIcon />,
        keywords: ['theme', 'colors', 'dark', 'light'],
      },
    ],
  },
];

/* ────────────────────────────────────────────────────────────────────────
 * Sidebar
 * ──────────────────────────────────────────────────────────────────────── */

function ShellSidebar({ pathname }: { pathname: string }) {
  const user = useUser();
  const { items } = buildNav({
    config: NAV_CONFIG,
    pathname,
    permissions: [...(user?.roles ?? []), ...(user?.scopes ?? [])],
  });

  const initials = (user?.name ?? 'DU')
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Sidebar>
      {/* ── Brand header ─────────────────────────────────────────────── */}
      <SidebarHeader className="border-sidebar-border flex flex-row items-center gap-3 border-b px-3 py-3">
        <SidebarTrigger />
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-[family-name:var(--font-terminal)] text-sm font-semibold tracking-tight">
            next-shell
          </span>
          <span className="text-muted-foreground truncate text-[10px] tabular-nums">
            v{packageVersion}
          </span>
        </div>
      </SidebarHeader>

      {/* ── Main navigation ──────────────────────────────────────────── */}
      <SidebarContent>
        <SidebarNav items={items} label="Navigation" />

        <SidebarSeparator />

        {/* Extra group to showcase SidebarGroup + SidebarGroupLabel */}
        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* ── User footer ──────────────────────────────────────────────── */}
      <SidebarFooter>
        <div className="flex items-center gap-3 px-1 py-1">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium">{user?.name ?? 'Demo User'}</p>
            <p className="text-muted-foreground truncate text-xs">
              {user?.email ?? 'demo@example.com'}
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="Sign out"
                onClick={() => {
                  window.location.href = '/';
                }}
              >
                <LogOutIcon className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign out</TooltipContent>
          </Tooltip>
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
  const permissions = [...(user?.roles ?? []), ...(user?.scopes ?? [])];

  return (
    <TopBar
      left={
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <Breadcrumbs config={NAV_CONFIG} pathname={pathname} permissions={permissions} />
        </div>
      }
      center={<CommandBarTrigger />}
      right={
        <div className="flex items-center gap-1">
          <ThemeToggleDropdown />
          <Separator orientation="vertical" className="mx-1 h-4" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8" aria-label="Notifications">
                <BellIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
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
  const { data } = useSession();
  const permissions = [...(data?.user?.roles ?? []), ...(data?.user?.scopes ?? [])];

  return (
    <AppShell
      commandBar
      sidebar={<ShellSidebar pathname={pathname} />}
      topBar={<ShellTopBar pathname={pathname} />}
      footer={
        <Footer>
          <span>&copy; {new Date().getFullYear()} next-shell example app</span>
          <span className="text-muted-foreground text-xs tabular-nums">v{packageVersion}</span>
        </Footer>
      }
    >
      <CommandBarActions
        config={NAV_CONFIG}
        pathname={pathname}
        permissions={permissions}
        onNavigate={(item: ResolvedNavItem) => {
          if (item.href) router.push(item.href);
        }}
      />
      {children}
    </AppShell>
  );
}
