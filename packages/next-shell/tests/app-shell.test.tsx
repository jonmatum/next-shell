import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppShell } from '../src/layout/app-shell.js';

describe('AppShell', () => {
  it('renders children', () => {
    render(<AppShell>page content</AppShell>);
    expect(screen.getByText('page content')).toBeInTheDocument();
  });

  it('sets data-slot="app-shell" on the root wrapper', () => {
    const { container } = render(<AppShell>x</AppShell>);
    expect(container.querySelector('[data-slot="app-shell"]')).not.toBeNull();
  });

  it('defaults data-density to "comfortable"', () => {
    const { container } = render(<AppShell>x</AppShell>);
    const root = container.querySelector('[data-slot="app-shell"]');
    expect(root).toHaveAttribute('data-density', 'comfortable');
  });

  it('reflects custom density prop', () => {
    const { container } = render(<AppShell density="compact">x</AppShell>);
    const root = container.querySelector('[data-slot="app-shell"]');
    expect(root).toHaveAttribute('data-density', 'compact');
  });

  it('renders data-slot="topbar"', () => {
    const { container } = render(<AppShell>x</AppShell>);
    expect(container.querySelector('[data-slot="topbar"]')).not.toBeNull();
  });

  it('renders the topBarLeft slot', () => {
    render(<AppShell topBarLeft={<span data-testid="brand">Brand</span>}>x</AppShell>);
    expect(screen.getByTestId('brand')).toBeInTheDocument();
  });

  it('renders the topBarRight slot', () => {
    render(<AppShell topBarRight={<button data-testid="user-menu">User</button>}>x</AppShell>);
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });

  it('renders footer content when footer prop is provided', () => {
    render(<AppShell footer={<span data-testid="footer-content">© 2025</span>}>x</AppShell>);
    expect(screen.getByTestId('footer-content')).toBeInTheDocument();
  });

  it('omits footer when footer prop is absent', () => {
    const { container } = render(<AppShell>x</AppShell>);
    expect(container.querySelector('[data-slot="footer"]')).toBeNull();
  });

  it('omits sidebar when sidebar prop is absent', () => {
    const { container } = render(<AppShell>x</AppShell>);
    expect(container.querySelector('[data-slot="sidebar"]')).toBeNull();
  });

  it('renders data-slot="app-shell-body" wrapping children', () => {
    const { container } = render(<AppShell>x</AppShell>);
    expect(container.querySelector('[data-slot="app-shell-body"]')).not.toBeNull();
  });
});
