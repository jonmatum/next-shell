import { describe, expect, it } from 'vitest';

import { buildNav } from '../src/layout/nav-config.js';
import type { NavConfig } from '../src/layout/nav-config.js';

const NAV: NavConfig = [
  { id: 'home', label: 'Home', href: '/', matcher: 'exact' },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    children: [
      { id: 'profile', label: 'Profile', href: '/settings/profile' },
      { id: 'security', label: 'Security', href: '/settings/security', requires: 'admin' },
    ],
  },
  { id: 'admin', label: 'Admin', href: '/admin', requires: 'admin' },
];

describe('buildNav — active matching', () => {
  it('marks exact matcher item active only when pathname matches exactly', () => {
    const { items } = buildNav({ config: NAV, pathname: '/' });
    expect(items.find((i) => i.id === 'home')?.active).toBe(true);
    const { items: items2 } = buildNav({ config: NAV, pathname: '/other' });
    expect(items2.find((i) => i.id === 'home')?.active).toBe(false);
  });

  it('marks prefix item active when pathname starts with href', () => {
    const { items } = buildNav({ config: NAV, pathname: '/settings/profile' });
    const settings = items.find((i) => i.id === 'settings');
    expect(settings?.active).toBe(true);
  });

  it('marks child item active', () => {
    const { items } = buildNav({ config: NAV, pathname: '/settings/profile' });
    const settings = items.find((i) => i.id === 'settings');
    const profile = settings?.children?.find((c) => c.id === 'profile');
    expect(profile?.active).toBe(true);
  });

  it('returns empty breadcrumbs when nothing is active', () => {
    const { breadcrumbs } = buildNav({ config: NAV, pathname: '/unknown' });
    expect(breadcrumbs).toHaveLength(0);
  });

  it('derives breadcrumb trail for a nested active item', () => {
    const { breadcrumbs } = buildNav({ config: NAV, pathname: '/settings/profile' });
    expect(breadcrumbs.map((b) => b.id)).toEqual(['settings', 'profile']);
  });

  it('derives breadcrumb trail for a root active item', () => {
    const { breadcrumbs } = buildNav({ config: NAV, pathname: '/' });
    expect(breadcrumbs.map((b) => b.id)).toEqual(['home']);
  });
});

describe('buildNav — permission filtering', () => {
  it('excludes items that require a permission the user lacks', () => {
    const { items } = buildNav({ config: NAV, pathname: '/', permissions: [] });
    expect(items.find((i) => i.id === 'admin')).toBeUndefined();
  });

  it('includes items when the user has the required permission', () => {
    const { items } = buildNav({ config: NAV, pathname: '/', permissions: ['admin'] });
    expect(items.find((i) => i.id === 'admin')).toBeDefined();
  });

  it('excludes gated children but keeps the parent group', () => {
    const { items } = buildNav({ config: NAV, pathname: '/', permissions: [] });
    const settings = items.find((i) => i.id === 'settings');
    expect(settings?.children?.find((c) => c.id === 'security')).toBeUndefined();
    expect(settings?.children?.find((c) => c.id === 'profile')).toBeDefined();
  });
});

describe('buildNav — regex matcher', () => {
  it('supports RegExp matcher', () => {
    const regexNav: NavConfig = [
      { id: 'docs', label: 'Docs', href: '/docs', matcher: /^\/docs(\/.*)?$/ },
    ];
    const { items } = buildNav({ config: regexNav, pathname: '/docs/getting-started' });
    expect(items[0]?.active).toBe(true);
  });
});
