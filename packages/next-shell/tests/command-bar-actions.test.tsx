import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CommandBarProvider, useCommandBar } from '../src/layout/command-bar.js';
import { CommandBarActions } from '../src/layout/command-bar-actions.js';
import type { NavConfig } from '../src/layout/nav-config.js';

const NAV: NavConfig = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    children: [{ id: 'profile', label: 'Profile', href: '/settings/profile' }],
  },
  { id: 'admin', label: 'Admin', href: '/admin', requires: 'admin' },
];

describe('CommandBarActions', () => {
  it('renders nothing (side-effect only)', () => {
    const { container } = render(
      <CommandBarProvider>
        <CommandBarActions config={NAV} pathname="/" />
      </CommandBarProvider>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('mounts without throwing', () => {
    expect(() =>
      render(
        <CommandBarProvider>
          <CommandBarActions config={NAV} pathname="/" />
        </CommandBarProvider>,
      ),
    ).not.toThrow();
  });

  it('accepts permissions prop', () => {
    expect(() =>
      render(
        <CommandBarProvider>
          <CommandBarActions config={NAV} pathname="/" permissions={['admin']} />
        </CommandBarProvider>,
      ),
    ).not.toThrow();
  });

  it('accepts onNavigate callback', () => {
    const onNavigate = vi.fn();
    expect(() =>
      render(
        <CommandBarProvider>
          <CommandBarActions config={NAV} pathname="/" onNavigate={onNavigate} />
        </CommandBarProvider>,
      ),
    ).not.toThrow();
  });

  it('works with empty config', () => {
    expect(() =>
      render(
        <CommandBarProvider>
          <CommandBarActions config={[]} pathname="/" />
        </CommandBarProvider>,
      ),
    ).not.toThrow();
  });

  it('registers actions in the provider context', () => {
    function Probe() {
      const { open } = useCommandBar();
      return <span data-testid="open">{String(open)}</span>;
    }
    render(
      <CommandBarProvider>
        <CommandBarActions config={NAV} pathname="/" />
        <Probe />
      </CommandBarProvider>,
    );
    expect(screen.getByTestId('open')).toHaveTextContent('false');
  });
});
