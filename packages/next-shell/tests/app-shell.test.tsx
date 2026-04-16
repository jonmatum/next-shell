import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppShell } from '../src/layout/app-shell.js';
import { useCommandBar } from '../src/layout/command-bar.js';
import { useSidebar } from '../src/layout/sidebar.js';

describe('AppShell — no sidebar', () => {
  it('renders children in a flex column without SidebarProvider', () => {
    render(
      <AppShell data-testid="shell">
        <p data-testid="content">hello</p>
      </AppShell>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders topBar and footer slots', () => {
    render(
      <AppShell
        topBar={<header data-testid="topbar">Top</header>}
        footer={<footer data-testid="footer">Bottom</footer>}
      >
        <p>content</p>
      </AppShell>,
    );
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('omits topBar / footer when not provided', () => {
    const { container } = render(
      <AppShell>
        <p>x</p>
      </AppShell>,
    );
    expect(container.querySelector('header')).toBeNull();
    expect(container.querySelector('footer')).toBeNull();
  });
});

describe('AppShell — with sidebar', () => {
  it('renders SidebarProvider when sidebar prop is provided', () => {
    function SidebarProbe() {
      useSidebar(); // throws when outside SidebarProvider
      return <nav data-testid="nav">Nav</nav>;
    }
    render(
      <AppShell sidebar={<SidebarProbe />}>
        <p data-testid="content">content</p>
      </AppShell>,
    );
    expect(screen.getByTestId('nav')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('defaults sidebar to open when initialSidebarState is "open"', () => {
    function StateProbe() {
      const { open } = useSidebar();
      return <span data-testid="state">{String(open)}</span>;
    }
    render(
      <AppShell sidebar={<StateProbe />} initialSidebarState="open">
        <p>c</p>
      </AppShell>,
    );
    expect(screen.getByTestId('state')).toHaveTextContent('true');
  });

  it('defaults sidebar to closed when initialSidebarState is "closed"', () => {
    function StateProbe() {
      const { open } = useSidebar();
      return <span data-testid="state">{String(open)}</span>;
    }
    render(
      <AppShell sidebar={<StateProbe />} initialSidebarState="closed">
        <p>c</p>
      </AppShell>,
    );
    expect(screen.getByTestId('state')).toHaveTextContent('false');
  });
});

describe('AppShell — commandBar', () => {
  it('does NOT mount CommandBarProvider when commandBar is false', () => {
    function Probe() {
      // useCommandBar throws when outside CommandBarProvider
      try {
        useCommandBar();
        return <span data-testid="inside">inside</span>;
      } catch {
        return <span data-testid="outside">outside</span>;
      }
    }
    render(
      <AppShell>
        <Probe />
      </AppShell>,
    );
    expect(screen.getByTestId('outside')).toBeInTheDocument();
  });

  it('mounts CommandBarProvider when commandBar is true', () => {
    function Probe() {
      const { open } = useCommandBar();
      return <span data-testid="cb-open">{String(open)}</span>;
    }
    render(
      <AppShell commandBar>
        <Probe />
      </AppShell>,
    );
    expect(screen.getByTestId('cb-open')).toHaveTextContent('false');
  });

  it('works with commandBar + sidebar together', () => {
    function SidebarProbe() {
      useSidebar();
      return <nav data-testid="nav">Nav</nav>;
    }
    function CBProbe() {
      const { open } = useCommandBar();
      return <span data-testid="cb">{String(open)}</span>;
    }
    render(
      <AppShell commandBar sidebar={<SidebarProbe />}>
        <CBProbe />
      </AppShell>,
    );
    expect(screen.getByTestId('nav')).toBeInTheDocument();
    expect(screen.getByTestId('cb')).toHaveTextContent('false');
  });
});
