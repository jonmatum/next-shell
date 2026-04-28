'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  HardHatIcon,
  LayoutDashboardIcon,
  FolderOpenIcon,
  TruckIcon,
  PackageIcon,
  WalletIcon,
  SettingsIcon,
} from 'lucide-react';

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
import { DbInit } from '@/components/db-init';

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
    label: 'Proyectos',
    href: '/projects',
    icon: <FolderOpenIcon className="size-4" />,
    matcher: 'prefix',
  },
  {
    id: 'equipment',
    label: 'Equipos',
    href: '/equipment',
    icon: <TruckIcon className="size-4" />,
    matcher: 'prefix',
  },
  {
    id: 'materials',
    label: 'Materiales',
    href: '/materials',
    icon: <PackageIcon className="size-4" />,
    matcher: 'prefix',
  },
  {
    id: 'budgets',
    label: 'Presupuestos',
    href: '/budgets',
    icon: <WalletIcon className="size-4" />,
    matcher: 'prefix',
  },
  {
    id: 'settings',
    label: 'Configuración',
    href: '/settings',
    icon: <SettingsIcon className="size-4" />,
    matcher: 'prefix',
    requires: 'admin',
  },
];

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useSession();
  const user = useUser();

  const permissions = [...(user?.roles ?? []), ...(user?.scopes ?? [])];

  const { items } = buildNav({ config: NAV_CONFIG, pathname, permissions });

  const handleNavigate = (item: ResolvedNavItem) => {
    if (item.href) router.push(item.href);
  };

  return (
    <AppShell
      commandBar
      sidebar={
        <Sidebar>
          <SidebarHeader className="border-border/50 border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md">
                <HardHatIcon className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-bold">ConstructPro</span>
                <span className="text-muted-foreground text-xs">Gestión de Obras</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarNav items={items} label="Navegación" onNavigate={handleNavigate} />
          </SidebarContent>

          <SidebarFooter className="border-border/50 border-t px-4 py-3">
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
          <span>&copy; {new Date().getFullYear()} ConstructPro</span>
          <span>Powered by @jonmatum/next-shell</span>
        </Footer>
      }
    >
      <CommandBarActions
        config={NAV_CONFIG}
        pathname={pathname}
        permissions={permissions}
        onNavigate={handleNavigate}
      />
      <DbInit />
      <div className="p-4 sm:p-6 lg:p-8">{children}</div>
    </AppShell>
  );
}
