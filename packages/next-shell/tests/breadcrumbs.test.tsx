import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Breadcrumbs } from '../src/layout/breadcrumbs.js';
import type { NavConfig } from '../src/layout/nav-config.js';

const NAV: NavConfig = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    children: [
      { id: 'profile', label: 'Profile', href: '/settings/profile' },
      { id: 'security', label: 'Security', href: '/settings/security', requires: 'admin' },
    ],
  },
];

describe('Breadcrumbs', () => {
  it('renders nothing when no item is active', () => {
    const { container } = render(<Breadcrumbs config={NAV} pathname="/unknown" />);
    expect(container.innerHTML).toBe('');
  });

  it('renders a single breadcrumb for a root item', () => {
    render(<Breadcrumbs config={NAV} pathname="/" />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders ancestor + leaf for nested items', () => {
    render(<Breadcrumbs config={NAV} pathname="/settings/profile" />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('ancestor crumbs render as links', () => {
    render(<Breadcrumbs config={NAV} pathname="/settings/profile" />);
    const settingsLink = screen.getByText('Settings').closest('a');
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });

  it('respects permission gating', () => {
    render(<Breadcrumbs config={NAV} pathname="/settings/security" permissions={[]} />);
    expect(screen.queryByText('Security')).toBeNull();
  });

  it('shows gated items when user has permission', () => {
    render(<Breadcrumbs config={NAV} pathname="/settings/security" permissions={['admin']} />);
    expect(screen.getByText('Security')).toBeInTheDocument();
  });

  it('supports custom renderLink', () => {
    render(
      <Breadcrumbs
        config={NAV}
        pathname="/settings/profile"
        renderLink={(item, children) => (
          <a data-testid={`link-${item.id}`} href={item.href!}>
            {children}
          </a>
        )}
      />,
    );
    expect(screen.getByTestId('link-settings')).toBeInTheDocument();
  });
});
