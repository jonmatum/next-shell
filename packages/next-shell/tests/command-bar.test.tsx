import * as React from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  CommandBarProvider,
  CommandBarTrigger,
  useCommandBar,
  useCommandBarActions,
} from '../src/layout/command-bar.js';

function wrapper({ children }: { children: React.ReactNode }) {
  return <CommandBarProvider>{children}</CommandBarProvider>;
}

describe('CommandBarProvider + useCommandBar', () => {
  it('throws when useCommandBar is called outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useCommandBar())).toThrow(
      /CommandBar components must be used within a <CommandBarProvider>/,
    );
    spy.mockRestore();
  });

  it('exposes open/setOpen/toggle', () => {
    const { result } = renderHook(() => useCommandBar(), { wrapper });
    expect(result.current.open).toBe(false);
    act(() => result.current.setOpen(true));
    expect(result.current.open).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.open).toBe(false);
  });

  it('respects controlled mode', () => {
    function Probe() {
      const { open } = useCommandBar();
      return <span data-testid="state">{String(open)}</span>;
    }
    const { rerender } = render(
      <CommandBarProvider open={true}>
        <Probe />
      </CommandBarProvider>,
    );
    expect(screen.getByTestId('state')).toHaveTextContent('true');
    rerender(
      <CommandBarProvider open={false}>
        <Probe />
      </CommandBarProvider>,
    );
    expect(screen.getByTestId('state')).toHaveTextContent('false');
  });

  it('fires the ⌘K shortcut to toggle open', async () => {
    function Probe() {
      const { open } = useCommandBar();
      return <span data-testid="state">{String(open)}</span>;
    }
    render(
      <CommandBarProvider>
        <Probe />
      </CommandBarProvider>,
    );
    expect(screen.getByTestId('state')).toHaveTextContent('false');
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    });
    expect(screen.getByTestId('state')).toHaveTextContent('true');
  });
});

describe('useCommandBarActions', () => {
  it('registers actions without throwing', () => {
    function Capture() {
      useCommandBarActions([{ id: 'noop', label: 'Noop', perform: () => {} }]);
      return <span data-testid="ok">ok</span>;
    }
    render(
      <CommandBarProvider>
        <Capture />
      </CommandBarProvider>,
    );
    expect(screen.getByTestId('ok')).toBeInTheDocument();
  });
});

describe('CommandBarTrigger', () => {
  it('renders a button with data-slot + label + shortcut hint', () => {
    render(
      <CommandBarProvider>
        <CommandBarTrigger data-testid="trigger" />
      </CommandBarProvider>,
    );
    const btn = screen.getByTestId('trigger');
    expect(btn).toHaveAttribute('data-slot', 'command-bar-trigger');
    expect(btn).toHaveTextContent('Search…');
    expect(btn).toHaveTextContent('⌘K');
  });

  it('clicking the trigger toggles open state', async () => {
    const user = userEvent.setup();
    function Probe() {
      const { open } = useCommandBar();
      return <span data-testid="state">{String(open)}</span>;
    }
    render(
      <CommandBarProvider>
        <CommandBarTrigger data-testid="trigger" />
        <Probe />
      </CommandBarProvider>,
    );
    expect(screen.getByTestId('state')).toHaveTextContent('false');
    await user.click(screen.getByTestId('trigger'));
    expect(screen.getByTestId('state')).toHaveTextContent('true');
  });
});
