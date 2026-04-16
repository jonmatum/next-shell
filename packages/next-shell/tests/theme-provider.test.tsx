import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../src/providers/theme/theme-provider.js';

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider>
        <span data-testid="child">hello</span>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('child')).toHaveTextContent('hello');
  });

  it('injects a brand override <style> tag when brand overrides are provided', () => {
    const { container } = render(
      <ThemeProvider
        brand={{
          light: { primary: 'oklch(0.6 0.2 258)' },
          dark: { primary: 'oklch(0.75 0.15 258)' },
        }}
      >
        <span>child</span>
      </ThemeProvider>,
    );
    const style = container.querySelector('style[data-next-shell-brand]');
    expect(style).not.toBeNull();
    expect(style?.innerHTML).toContain('--primary: oklch(0.6 0.2 258);');
    expect(style?.innerHTML).toContain('--primary: oklch(0.75 0.15 258);');
  });

  it('does NOT inject a <style> tag when no brand overrides are provided', () => {
    const { container } = render(
      <ThemeProvider>
        <span>child</span>
      </ThemeProvider>,
    );
    expect(container.querySelector('style[data-next-shell-brand]')).toBeNull();
  });

  it('forwards arbitrary next-themes props through', () => {
    // If the prop threading breaks, next-themes will warn in console.
    render(
      <ThemeProvider defaultTheme="dark" storageKey="my-theme">
        <span>child</span>
      </ThemeProvider>,
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
