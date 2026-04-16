import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { buildNav } from '../src/layout/nav-config.js';
import { SidebarNav } from '../src/layout/sidebar-nav.js';
import { SidebarProvider } from '../src/layout/sidebar.js';

const NAV = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    children: [{ id: 'profile', label: 'Profile', href: '/settings/profile' }],
  },
];

function Wrapper({ children }: { children: React.ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}

describe('SidebarNav', () => {
  it('renders top-level nav items', () => {
    const { items } = buildNav({ config: NAV, pathname: '/' });
    render(<SidebarNav items={items} />, { wrapper: Wrapper });
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders optional group label', () => {
    const { items } = buildNav({ config: NAV, pathname: '/' });
    render(<SidebarNav items={items} label="Main Navigation" />, { wrapper: Wrapper });
    expect(screen.getByText('Main Navigation')).toBeInTheDocument();
  });

  it('renders child items inside collapsible', () => {
    const { items } = buildNav({ config: NAV, pathname: '/settings/profile' });
    render(<SidebarNav items={items} />, { wrapper: Wrapper });
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('marks active items with data-active attribute', () => {
    const { items } = buildNav({ config: NAV, pathname: '/' });
    render(<SidebarNav items={items} />, { wrapper: Wrapper });
    const homeBtn = screen.getByText('Home').closest('[data-nav-id="home"]');
    expect(homeBtn).toHaveAttribute('data-active');
  });
});
