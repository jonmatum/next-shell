#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'next-shell', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

const SUBPATHS = {
  '@jonmatum/next-shell': 'Root barrel — cn, packageVersion, tokenSchemaVersion',
  '@jonmatum/next-shell/core': 'cn utility, packageVersion',
  '@jonmatum/next-shell/primitives': '42 shadcn/ui primitives (client)',
  '@jonmatum/next-shell/providers':
    'AppProviders, ThemeProvider, QueryProvider, ToastProvider, ErrorBoundary, I18nProvider',
  '@jonmatum/next-shell/providers/server': 'SSR theme cookie helpers (server-safe)',
  '@jonmatum/next-shell/layout':
    'AppShell, Sidebar, TopBar, CommandBar, ContentContainer, PageHeader, Footer, nav helpers, status states, error pages',
  '@jonmatum/next-shell/layout/server': 'SSR sidebar-state cookie helpers (server-safe)',
  '@jonmatum/next-shell/tokens':
    'Token types, colorTokens, radiusTokens, BrandOverrides, hexToOklch, preset palettes',
  '@jonmatum/next-shell/tailwind-preset': 'Tailwind v4 preset descriptor + CSS import paths',
  '@jonmatum/next-shell/auth': 'AuthProvider, useSession, useUser, SignedIn, SignedOut, RoleGate',
  '@jonmatum/next-shell/auth/nextauth': 'Auth.js v5 adapter',
  '@jonmatum/next-shell/auth/mock': 'Mock adapter for tests',
  '@jonmatum/next-shell/auth/server': 'Server-safe auth helpers',
  '@jonmatum/next-shell/hooks':
    'useDisclosure, useLocalStorage, useHotkey, useBreakpoint, useDebouncedValue, and more',
  '@jonmatum/next-shell/formatters':
    'formatDate, formatCurrency, formatFileSize, truncate, slugify, pluralize',
};

const COLOR_TOKENS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'success',
  'success-foreground',
  'warning',
  'warning-foreground',
  'info',
  'info-foreground',
  'border',
  'input',
  'ring',
  'overlay',
  'sidebar-background',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
];

const RADIUS_TOKENS = ['radius', 'radius-sm', 'radius-md', 'radius-lg', 'radius-xl'];

const COMPONENTS: Record<string, { subpath: string; props: string[]; description: string }> = {
  AppShell: {
    subpath: 'layout',
    props: [
      'children',
      'sidebar',
      'topBar',
      'footer',
      'commandBar',
      'initialSidebarState',
      'className',
    ],
    description: 'Root layout orchestrator composing Sidebar, TopBar, CommandBar, and Footer',
  },
  TopBar: {
    subpath: 'layout',
    props: ['left', 'center', 'right', 'sticky', 'className'],
    description: 'App header with three slots: left (brand), center (search), right (user menu)',
  },
  Sidebar: {
    subpath: 'layout',
    props: ['side', 'variant', 'collapsible', 'className', 'children'],
    description: 'Collapsible sidebar with 4 variants, mobile drawer, cookie persistence',
  },
  PageHeader: {
    subpath: 'layout',
    props: ['title', 'description', 'breadcrumb', 'actions', 'headingAs', 'className'],
    description: 'Page title + description + actions + optional breadcrumb',
  },
  ContentContainer: {
    subpath: 'layout',
    props: ['size', 'as', 'className', 'children'],
    description: 'Max-width content column with responsive padding. Sizes: sm, md, lg, xl, full',
  },
  Footer: {
    subpath: 'layout',
    props: ['className', 'children'],
    description: 'App footer with border-top and muted text',
  },
  CommandBar: {
    subpath: 'layout',
    props: ['title', 'description', 'placeholder', 'emptyState'],
    description: 'Command palette dialog (cmdk-based). Register actions with useCommandBarActions',
  },
  CommandBarProvider: {
    subpath: 'layout',
    props: ['children', 'open', 'onOpenChange', 'shortcut'],
    description: 'Context provider for command bar. Binds Cmd+K shortcut by default',
  },
  CommandBarTrigger: {
    subpath: 'layout',
    props: ['label', 'shortcut', 'variant', 'className'],
    description: 'Button trigger for command bar with search icon and shortcut hint',
  },
  SidebarNav: {
    subpath: 'layout',
    props: ['items', 'label', 'onNavigate', 'className'],
    description: 'Config-driven sidebar navigation from buildNav() output',
  },
  Breadcrumbs: {
    subpath: 'layout',
    props: ['config', 'pathname', 'permissions', 'renderLink'],
    description: 'Auto-derived breadcrumb trail from NavConfig + pathname',
  },
  ErrorPage: {
    subpath: 'layout',
    props: ['status', 'title', 'description', 'icon', 'actions', 'className'],
    description:
      'Full-page error with status code, icon, and action buttons. Presets: BadRequest, Unauthorized, Forbidden, NotFound, InternalServerError, ServiceUnavailable',
  },
  EmptyState: {
    subpath: 'layout',
    props: ['title', 'description', 'icon', 'action', 'className'],
    description: 'Empty content placeholder with icon and optional action',
  },
  ErrorState: {
    subpath: 'layout',
    props: ['title', 'description', 'icon', 'action', 'className'],
    description: 'Error content state with destructive tone and role=alert',
  },
  LoadingState: {
    subpath: 'layout',
    props: ['title', 'description', 'icon', 'className'],
    description: 'Loading spinner with role=status',
  },
  ThemeProvider: {
    subpath: 'providers',
    props: ['defaultTheme', 'enableSystem', 'disableTransitionOnChange', 'brand', 'children'],
    description: 'Theme context (next-themes). Supports brand overrides via BrandOverrides prop',
  },
  AppProviders: {
    subpath: 'providers',
    props: ['themeProps', 'queryProps', 'toastProps', 'i18nProps', 'children'],
    description:
      'Composes ThemeProvider > QueryProvider > ToastProvider > ErrorBoundary > I18nProvider',
  },
  AuthProvider: {
    subpath: 'auth',
    props: ['adapter', 'children'],
    description: 'Pluggable auth context. Pass a nextauth, mock, or custom adapter',
  },
  Button: {
    subpath: 'primitives',
    props: ['variant', 'size', 'asChild', 'disabled', 'className', 'children'],
    description:
      'Primary action button. Variants: default, destructive, outline, secondary, ghost, link. Sizes: default, sm, lg, icon',
  },
};

const RECIPES = [
  {
    name: 'DatePicker',
    components: ['Popover', 'Calendar', 'Button'],
    description: 'Date selection with popover calendar',
  },
  {
    name: 'DataTable',
    components: ['Table', '@tanstack/react-table'],
    description: 'Sortable, filterable data table',
  },
  {
    name: 'Combobox',
    components: ['Popover', 'Command'],
    description: 'Searchable select with command palette',
  },
  {
    name: 'Typography',
    components: ['prose classes'],
    description: 'Heading and paragraph styling guide',
  },
];

const SCAFFOLDS: Record<string, { description: string; code: string }> = {
  page: {
    description: 'A standard page with PageHeader and ContentContainer',
    code: `'use client';

import { PageHeader, ContentContainer } from '@jonmatum/next-shell/layout';
import { Button } from '@jonmatum/next-shell/primitives';

export default function MyPage() {
  return (
    <>
      <PageHeader
        title="Page Title"
        description="Brief description of this page"
        actions={<Button>Action</Button>}
      />
      <ContentContainer size="lg" className="py-6 space-y-6">
        {/* Page content here */}
      </ContentContainer>
    </>
  );
}`,
  },
  'shell-layout': {
    description: 'App shell layout with sidebar, topbar, footer, and command bar',
    code: `'use client';

import { usePathname } from 'next/navigation';
import {
  AppShell, TopBar, Footer, Sidebar, SidebarContent, SidebarHeader,
  SidebarFooter, SidebarNav, SidebarTrigger, Breadcrumbs,
  CommandBarActions, buildNav,
} from '@jonmatum/next-shell/layout';
import type { NavConfig } from '@jonmatum/next-shell/layout';
import { ThemeToggleDropdown } from '@jonmatum/next-shell/providers';
import { HomeIcon, SettingsIcon } from 'lucide-react';

const NAV: NavConfig = [
  { id: 'home', label: 'Home', href: '/', icon: <HomeIcon />, matcher: 'exact' },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <SettingsIcon /> },
];

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { items } = buildNav({ config: NAV, pathname });

  return (
    <AppShell
      commandBar
      sidebar={
        <Sidebar>
          <SidebarHeader><span className="text-lg font-bold">My App</span></SidebarHeader>
          <SidebarContent><SidebarNav items={items} /></SidebarContent>
          <SidebarFooter><span className="text-xs text-muted-foreground">v1.0</span></SidebarFooter>
        </Sidebar>
      }
      topBar={
        <TopBar
          left={<><SidebarTrigger /><Breadcrumbs config={NAV} pathname={pathname} /></>}
          right={<ThemeToggleDropdown />}
        />
      }
      footer={<Footer>Built with next-shell</Footer>}
    >
      <CommandBarActions config={NAV} pathname={pathname} />
      {children}
    </AppShell>
  );
}`,
  },
  providers: {
    description: 'Root providers with theme + mock auth',
    code: `'use client';

import { AppProviders } from '@jonmatum/next-shell/providers';
import { AuthProvider } from '@jonmatum/next-shell/auth';
import { createMockAuthAdapter } from '@jonmatum/next-shell/auth/mock';

const mockAuth = createMockAuthAdapter({
  user: { id: '1', name: 'Demo User', email: 'demo@example.com', roles: ['admin'] },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders themeProps={{ defaultTheme: 'system', enableSystem: true }}>
      <AuthProvider adapter={mockAuth}>{children}</AuthProvider>
    </AppProviders>
  );
}`,
  },
  'globals-css': {
    description: 'globals.css with Tailwind v4 + next-shell preset',
    code: `@import 'tailwindcss';
@source "node_modules/@jonmatum/next-shell/dist/**/*.{js,cjs}";
@import '@jonmatum/next-shell/styles/preset.css';`,
  },
  'error-pages': {
    description: 'Error boundary + not-found pages',
    code: `// app/not-found.tsx (Server Component)
import { NotFound } from '@jonmatum/next-shell/layout/server';
export default function NotFoundPage() { return <NotFound />; }

// app/error.tsx (Client Component)
'use client';
import { ErrorPage } from '@jonmatum/next-shell/layout';
import { Button } from '@jonmatum/next-shell/primitives';
export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorPage
      status="500"
      title="Something went wrong"
      description={error.message}
      actions={<Button onClick={reset}>Try again</Button>}
    />
  );
}`,
  },
  hooks: {
    description: 'Common hooks usage patterns',
    code: `import {
  useDisclosure,      // { isOpen, open, close, toggle, onOpenChange }
  useLocalStorage,    // [value, setValue] — persists across sessions
  useCopyToClipboard, // { copy, isCopied }
  useHotkey,          // useHotkey('k', callback, { meta: true })
  useBreakpoint,      // { current, isMobile, isDesktop }
  useDebouncedValue,  // debounced version of a value
  useMediaQuery,      // boolean — matches a CSS media query
  useIsMobile,        // boolean — max-width: 767px
} from '@jonmatum/next-shell/hooks';`,
  },
};

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_tokens',
      description: 'Get the full semantic token catalog (colors, radii, version)',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_subpaths',
      description: 'Get all package subpath exports with descriptions',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_component_api',
      description: 'Get props and description for a specific component',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Component name (e.g. AppShell, Button, TopBar)' },
        },
        required: ['name'],
      },
    },
    {
      name: 'get_recipes',
      description: 'Get composition patterns for common UI patterns',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'list_components',
      description: 'List all available components with their subpaths',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'scaffold',
      description:
        'Get boilerplate code for common patterns (page, shell-layout, providers, globals-css, error-pages, hooks)',
      inputSchema: {
        type: 'object',
        properties: {
          template: {
            type: 'string',
            description:
              'Template name: page, shell-layout, providers, globals-css, error-pages, hooks',
          },
        },
        required: ['template'],
      },
    },
    {
      name: 'list_scaffolds',
      description: 'List all available scaffold templates',
      inputSchema: { type: 'object', properties: {} },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'get_tokens':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              { colorTokens: COLOR_TOKENS, radiusTokens: RADIUS_TOKENS, tokenSchemaVersion: 1 },
              null,
              2,
            ),
          },
        ],
      };

    case 'get_subpaths':
      return { content: [{ type: 'text', text: JSON.stringify(SUBPATHS, null, 2) }] };

    case 'get_component_api': {
      const componentName = (args as Record<string, string>).name;
      const component = COMPONENTS[componentName];
      if (!component) {
        const available = Object.keys(COMPONENTS).join(', ');
        return {
          content: [
            {
              type: 'text',
              text: `Component "${componentName}" not found. Available: ${available}`,
            },
          ],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                name: componentName,
                importPath: `@jonmatum/next-shell/${component.subpath}`,
                ...component,
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    case 'get_recipes':
      return { content: [{ type: 'text', text: JSON.stringify(RECIPES, null, 2) }] };

    case 'list_components':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              Object.entries(COMPONENTS).map(([n, c]) => ({
                name: n,
                subpath: c.subpath,
                description: c.description,
              })),
              null,
              2,
            ),
          },
        ],
      };

    case 'scaffold': {
      const template = (args as Record<string, string>).template;
      const scaffold = SCAFFOLDS[template];
      if (!scaffold) {
        const available = Object.keys(SCAFFOLDS).join(', ');
        return {
          content: [
            { type: 'text', text: `Template "${template}" not found. Available: ${available}` },
          ],
          isError: true,
        };
      }
      return {
        content: [{ type: 'text', text: `// ${scaffold.description}\n\n${scaffold.code}` }],
      };
    }

    case 'list_scaffolds':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              Object.entries(SCAFFOLDS).map(([name, s]) => ({ name, description: s.description })),
              null,
              2,
            ),
          },
        ],
      };

    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
