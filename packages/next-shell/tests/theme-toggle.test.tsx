import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from '../src/providers/theme/theme-provider.js';
import { ThemeToggle } from '../src/providers/theme/theme-toggle.js';

function renderToggle(defaultTheme = 'light') {
  return render(
    <ThemeProvider defaultTheme={defaultTheme} disableTransitionOnChange>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders a button with an accessible label', () => {
    renderToggle('light');
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-label');
    expect(btn.getAttribute('aria-label')).toMatch(/theme/i);
  });

  it('carries data-theme-value matching the current preference', async () => {
    renderToggle('dark');
    // ThemeProvider needs a tick to mount and hydrate state.
    await act(async () => {});
    expect(screen.getByRole('button')).toHaveAttribute('data-theme-value', 'dark');
  });

  it('cycles light → dark → system → light on successive clicks', async () => {
    renderToggle('light');
    const user = userEvent.setup();
    const btn = screen.getByRole('button');

    await act(async () => {});
    expect(btn).toHaveAttribute('data-theme-value', 'light');

    await user.click(btn);
    expect(btn).toHaveAttribute('data-theme-value', 'dark');

    await user.click(btn);
    expect(btn).toHaveAttribute('data-theme-value', 'system');

    await user.click(btn);
    expect(btn).toHaveAttribute('data-theme-value', 'light');
  });

  it('uses only semantic-token classNames (no raw colors)', () => {
    renderToggle('light');
    const cls = screen.getByRole('button').className;
    // The className must reference only semantic tokens — not palette
    // utilities like `bg-slate-*` or `text-white`.
    expect(cls).not.toMatch(
      /(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/,
    );
    expect(cls).not.toMatch(/(bg|text|border)-(white|black)\b/);
    expect(cls).toMatch(/text-foreground|bg-accent|ring-ring/);
  });

  it('respects a custom className prop', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle className="custom-extra" data-testid="toggle" />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('toggle').className).toContain('custom-extra');
  });
});
