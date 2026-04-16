import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from '../src/providers/theme/theme-provider.js';
import { ThemeToggleDropdown } from '../src/providers/theme/theme-toggle-dropdown.js';

function renderDropdown(defaultTheme = 'light') {
  return render(
    <ThemeProvider defaultTheme={defaultTheme} disableTransitionOnChange>
      <ThemeToggleDropdown />
    </ThemeProvider>,
  );
}

describe('ThemeToggleDropdown', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders a trigger button with the default "Theme" accessible label', () => {
    renderDropdown('light');
    const trigger = screen.getByRole('button', { name: 'Theme' });
    expect(trigger).toHaveAttribute('data-slot', 'dropdown-menu-trigger');
  });

  it('accepts a custom label prop', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggleDropdown label="Choose theme" />
      </ThemeProvider>,
    );
    expect(screen.getByRole('button', { name: 'Choose theme' })).toBeInTheDocument();
  });

  it('exposes data-theme-value reflecting the current theme preference', async () => {
    renderDropdown('dark');
    await act(async () => {});
    const trigger = screen.getByRole('button', { name: 'Theme' });
    expect(trigger).toHaveAttribute('data-theme-value', 'dark');
  });

  it('uses only semantic-token classNames (no raw palette utilities)', () => {
    renderDropdown('light');
    const trigger = screen.getByRole('button', { name: 'Theme' });
    expect(trigger.className).not.toMatch(
      /(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/,
    );
    expect(trigger.className).not.toMatch(/(bg|text|border)-(white|black)\b/);
  });

  it('forwards extra props to the trigger button', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggleDropdown data-testid="tt" className="custom-extra" />
      </ThemeProvider>,
    );
    const trigger = screen.getByTestId('tt');
    expect(trigger.className).toContain('custom-extra');
  });
});
