import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { TopBar } from '../src/layout/index.js';

describe('TopBar', () => {
  it('renders a banner landmark with data-slot and sticky positioning by default', () => {
    render(<TopBar left={<span>Brand</span>} />);
    const bar = screen.getByRole('banner');
    expect(bar).toHaveAttribute('data-slot', 'topbar');
    expect(bar.className).toMatch(/sticky/);
    expect(bar.className).toMatch(/top-0/);
  });

  it('omits sticky classes when sticky={false}', () => {
    render(<TopBar left={<span>Brand</span>} sticky={false} />);
    const bar = screen.getByRole('banner');
    expect(bar.className).not.toMatch(/sticky/);
  });

  it('renders all three slots with their data-slot attributes when provided', () => {
    render(
      <TopBar
        left={<span data-testid="brand">Brand</span>}
        center={<input data-testid="search" placeholder="Search" />}
        right={<button data-testid="user">User</button>}
      />,
    );
    expect(screen.getByTestId('brand').parentElement).toHaveAttribute('data-slot', 'topbar-left');
    expect(screen.getByTestId('search').parentElement).toHaveAttribute(
      'data-slot',
      'topbar-center',
    );
    expect(screen.getByTestId('user').parentElement).toHaveAttribute('data-slot', 'topbar-right');
  });

  it('omits optional slots when not provided', () => {
    const { container } = render(<TopBar left={<span>Brand</span>} right={<span>User</span>} />);
    expect(container.querySelector('[data-slot="topbar-left"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="topbar-center"]')).toBeNull();
    expect(container.querySelector('[data-slot="topbar-right"]')).toBeTruthy();
  });

  it('inserts a flex spacer when center is absent so right stays right-aligned', () => {
    const { container } = render(<TopBar left={<span>L</span>} right={<span>R</span>} />);
    const header = container.querySelector('[data-slot="topbar"]');
    const spacer = header?.querySelector('[aria-hidden]');
    expect(spacer).toBeTruthy();
    expect(spacer?.className).toMatch(/flex-1/);
  });

  it('uses semantic tokens only (no raw palette / white / black)', () => {
    render(<TopBar left={<span>x</span>} />);
    const bar = screen.getByRole('banner');
    expect(bar.className).not.toMatch(
      /(bg|text|border)-(slate|gray|zinc|neutral|stone|red|blue|indigo|violet|purple)-\d+/,
    );
    expect(bar.className).not.toMatch(/(bg|text|border)-(white|black)\b/);
    expect(bar.className).toMatch(/bg-background/);
    expect(bar.className).toMatch(/border-border/);
  });

  it('passes extra props through to the underlying header element', () => {
    render(<TopBar data-testid="t" aria-label="Application header" />);
    const bar = screen.getByTestId('t');
    expect(bar).toHaveAttribute('aria-label', 'Application header');
    expect(bar.tagName).toBe('HEADER');
  });
});
