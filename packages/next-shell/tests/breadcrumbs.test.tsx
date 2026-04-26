import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Breadcrumbs } from '../src/layout/breadcrumbs.js';
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
];

describe('Breadcrumbs', () => {
  it('renders nothing when no item is active', () => {
    const { container } = render(<Breadcrumbs config={NAV} pathname="/unknown" />);
    expect(container.innerHTML).toBe('');
  });

  it('renders a single breadcrumb for a root-level active item', () => {
    render(<Breadcrumbs config={NAV} pathname="/" />);
    // The last (only) item should render as a BreadcrumbPage (not a link)
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders ancestor + leaf for a nested active item', () => {
    render(<Breadcrumbs config={NAV} pathname="/settings/profile" />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders the last crumb as a BreadcrumbPage (no link)', () => {
    render(<Breadcrumbs config={NAV} pathname="/settings/profile" />);
    // The last crumb ("Profile") should not be wrapped in a link
    const profileEl = screen.getByText('Profile');
    expect(profileEl.closest('a')).toBeNull();
  });

  it('renders ancestor crumbs as links when they have an href', () => {
    render(<Breadcrumbs config={NAV} pathname="/settings/profile" />);
    const settingsLink = screen.getByText('Settings').closest('a');
    expect(settingsLink).not.toBeNull();
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });

  it('respects permissions — excludes gated items from the trail', () => {
    // Security requires 'admin'; without it the breadcrumb should not appear
    render(<Breadcrumbs config={NAV} pathname="/settings/security" permissions={[]} />);
    expect(screen.queryByText('Security')).not.toBeInTheDocument();
  });

  it('includes gated items when the user has the required permission', () => {
    render(<Breadcrumbs config={NAV} pathname="/settings/security" permissions={['admin']} />);
    expect(screen.getByText('Security')).toBeInTheDocument();
  });

  it('uses renderLink for ancestor crumbs when provided', () => {
    const renderLink = (item: { href?: string }, children: React.ReactNode) => (
      <a href={item.href} data-testid={`custom-link-${item.href}`}>
        {children}
      </a>
    );
    render(<Breadcrumbs config={NAV} pathname="/settings/profile" renderLink={renderLink} />);
    expect(screen.getByTestId('custom-link-/settings')).toBeInTheDocument();
  });

  it('forwards extra props to the root Breadcrumb element', () => {
    render(<Breadcrumbs config={NAV} pathname="/" data-testid="bc" aria-label="Breadcrumbs" />);
    const nav = screen.getByTestId('bc');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumbs');
  });
});
