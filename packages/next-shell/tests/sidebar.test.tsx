import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '../src/layout/sidebar.js';

function renderWithProvider(ui: React.ReactElement, { defaultOpen = true } = {}) {
  return render(
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar data-testid="sb">
        <SidebarHeader>HDR</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>BODY</SidebarGroup>
        </SidebarContent>
        <SidebarFooter>FTR</SidebarFooter>
      </Sidebar>
      <SidebarInset>{ui}</SidebarInset>
    </SidebarProvider>,
  );
}

describe('Sidebar (closed-state smoke)', () => {
  it('renders the sidebar root with data-slot + data-state reflecting defaultOpen', () => {
    const { container } = renderWithProvider(<div>content</div>, { defaultOpen: true });
    const sidebars = container.querySelectorAll('[data-slot="sidebar"]');
    expect(sidebars.length).toBeGreaterThan(0);
    // At least one of the rendered sidebar layers carries data-state=expanded.
    const expanded = container.querySelector('[data-state="expanded"]');
    expect(expanded).toBeTruthy();
  });

  it('renders the header, content, and footer sub-slots', () => {
    const { container } = renderWithProvider(<div>content</div>);
    expect(container.querySelector('[data-slot="sidebar-header"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="sidebar-content"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="sidebar-footer"]')).toBeTruthy();
  });

  it('renders SidebarInset as a main-area container', () => {
    const { container } = renderWithProvider(<div>content</div>);
    const inset = container.querySelector('[data-slot="sidebar-inset"]');
    expect(inset).toBeTruthy();
    expect(inset?.textContent).toContain('content');
  });
});

describe('SidebarTrigger', () => {
  it('renders a button that toggles the sidebar open state', () => {
    render(
      <SidebarProvider defaultOpen={false}>
        <SidebarTrigger data-testid="trigger" />
        <Sidebar>
          <SidebarContent>x</SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );
    const btn = screen.getByTestId('trigger');
    expect(btn).toHaveAttribute('data-slot', 'sidebar-trigger');
    expect(btn.tagName).toBe('BUTTON');
  });
});

describe('useSidebar', () => {
  it('throws when used outside a SidebarProvider', () => {
    function Bad() {
      useSidebar();
      return null;
    }
    // Silence the expected React error-boundary-style stack.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Bad />)).toThrow(/useSidebar must be used within a SidebarProvider/);
    spy.mockRestore();
  });

  it('exposes state + toggle within a provider', () => {
    let captured: ReturnType<typeof useSidebar> | null = null;
    function Probe() {
      captured = useSidebar();
      return null;
    }
    render(
      <SidebarProvider defaultOpen>
        <Probe />
      </SidebarProvider>,
    );
    expect(captured).not.toBeNull();
    expect(captured!.open).toBe(true);
    expect(captured!.state).toBe('expanded');
    expect(typeof captured!.toggleSidebar).toBe('function');
    expect(typeof captured!.setOpen).toBe('function');
  });
});

import { vi } from 'vitest';
