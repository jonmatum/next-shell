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

    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
