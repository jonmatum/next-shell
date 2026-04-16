import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  Button,
  Input,
  Label,
  Separator,
  Skeleton,
  Textarea,
  buttonVariants,
} from '../src/primitives/index.js';

describe('Button', () => {
  it('renders with default variant + size and a data-slot marker', () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveAttribute('data-slot', 'button');
    expect(btn).toHaveAttribute('data-variant', 'default');
    expect(btn).toHaveAttribute('data-size', 'default');
  });

  it('applies variant + size class names via cva', () => {
    render(
      <Button variant="destructive" size="sm">
        Delete
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Delete' });
    expect(btn.className).toMatch(/bg-destructive/);
    expect(btn.className).toMatch(/h-8/);
  });

  it('renders as a child slot when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveAttribute('data-slot', 'button');
  });

  it('fires onClick handlers', async () => {
    const user = userEvent.setup();
    let count = 0;
    render(<Button onClick={() => count++}>Tap</Button>);
    await user.click(screen.getByRole('button', { name: 'Tap' }));
    expect(count).toBe(1);
  });

  it('exposes buttonVariants as a standalone cva function', () => {
    expect(typeof buttonVariants).toBe('function');
    const className = buttonVariants({ variant: 'outline', size: 'lg' });
    expect(className).toMatch(/border/);
    expect(className).toMatch(/h-10/);
  });

  it('uses the destructive-foreground semantic token (no raw white)', () => {
    render(<Button variant="destructive">X</Button>);
    const btn = screen.getByRole('button', { name: 'X' });
    expect(btn.className).toMatch(/text-destructive-foreground/);
    expect(btn.className).not.toMatch(/text-white\b/);
  });
});

describe('Input', () => {
  it('renders an input with a data-slot marker', () => {
    render(<Input placeholder="Name" />);
    const input = screen.getByPlaceholderText('Name');
    expect(input).toHaveAttribute('data-slot', 'input');
    expect(input.tagName).toBe('INPUT');
  });

  it('accepts typed input', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="email" />);
    const input = screen.getByLabelText('email');
    await user.type(input, 'hi@next.sh');
    expect(input).toHaveValue('hi@next.sh');
  });
});

describe('Label', () => {
  it('renders a label element with a data-slot marker', () => {
    render(<Label htmlFor="email">Email</Label>);
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('data-slot', 'label');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'email');
  });
});

describe('Separator', () => {
  it('renders a horizontal separator by default', () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveAttribute('data-slot', 'separator');
    expect(sep).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('supports a vertical orientation', () => {
    render(<Separator data-testid="sep" orientation="vertical" />);
    expect(screen.getByTestId('sep')).toHaveAttribute('data-orientation', 'vertical');
  });
});

describe('Skeleton', () => {
  it('renders a pulsing placeholder div', () => {
    render(<Skeleton data-testid="sk" className="h-6 w-24" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveAttribute('data-slot', 'skeleton');
    expect(el.className).toMatch(/animate-pulse/);
    expect(el.className).toMatch(/bg-accent/);
    expect(el.className).toMatch(/h-6/);
  });
});

describe('Textarea', () => {
  it('renders a textarea with a data-slot marker', () => {
    render(<Textarea placeholder="Bio" />);
    const ta = screen.getByPlaceholderText('Bio');
    expect(ta).toHaveAttribute('data-slot', 'textarea');
    expect(ta.tagName).toBe('TEXTAREA');
  });

  it('accepts multi-line input', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="bio" />);
    const ta = screen.getByLabelText('bio');
    await user.type(ta, 'line one{enter}line two');
    expect(ta).toHaveValue('line one\nline two');
  });
});
