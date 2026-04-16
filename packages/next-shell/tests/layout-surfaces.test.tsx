import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import {
  ContentContainer,
  EmptyState,
  ErrorState,
  Footer,
  LoadingState,
  PageHeader,
  contentContainerVariants,
} from '../src/layout/index.js';

describe('ContentContainer', () => {
  it('renders a div with the default lg size and data-slot', () => {
    render(<ContentContainer data-testid="cc">child</ContentContainer>);
    const el = screen.getByTestId('cc');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveAttribute('data-slot', 'content-container');
    expect(el).toHaveAttribute('data-size', 'lg');
    expect(el.className).toMatch(/max-w-7xl/);
  });

  it('switches max-width via the size prop', () => {
    render(
      <ContentContainer size="sm" data-testid="cc">
        x
      </ContentContainer>,
    );
    const el = screen.getByTestId('cc');
    expect(el).toHaveAttribute('data-size', 'sm');
    expect(el.className).toMatch(/max-w-3xl/);
  });

  it('renders as a main landmark when `as="main"`', () => {
    render(
      <ContentContainer as="main" data-testid="cc">
        x
      </ContentContainer>,
    );
    expect(screen.getByTestId('cc').tagName).toBe('MAIN');
  });

  it('exposes contentContainerVariants as a standalone cva function', () => {
    expect(typeof contentContainerVariants).toBe('function');
    expect(contentContainerVariants({ size: 'xl' })).toMatch(/max-w-\[96rem\]/);
    expect(contentContainerVariants({ size: 'full' })).toMatch(/max-w-none/);
  });
});

describe('PageHeader', () => {
  it('renders a header element with an h1 title by default', () => {
    render(<PageHeader title="Users" />);
    const hdr = screen.getByRole('banner');
    expect(hdr).toHaveAttribute('data-slot', 'page-header');
    const h1 = screen.getByRole('heading', { level: 1, name: 'Users' });
    expect(h1).toHaveAttribute('data-slot', 'page-header-title');
  });

  it('renders breadcrumb + description + actions slots when provided', () => {
    render(
      <PageHeader
        breadcrumb={<nav data-testid="bc">Home / Users</nav>}
        title="Users"
        description="Manage user accounts."
        actions={<button>New user</button>}
      />,
    );
    expect(screen.getByTestId('bc').parentElement).toHaveAttribute(
      'data-slot',
      'page-header-breadcrumb',
    );
    expect(screen.getByText('Manage user accounts.')).toHaveAttribute(
      'data-slot',
      'page-header-description',
    );
    expect(screen.getByRole('button', { name: 'New user' }).parentElement).toHaveAttribute(
      'data-slot',
      'page-header-actions',
    );
  });

  it('omits optional slots when not provided', () => {
    const { container } = render(<PageHeader title="Solo" />);
    expect(container.querySelector('[data-slot="page-header-breadcrumb"]')).toBeNull();
    expect(container.querySelector('[data-slot="page-header-description"]')).toBeNull();
    expect(container.querySelector('[data-slot="page-header-actions"]')).toBeNull();
  });

  it('supports a different heading level via headingAs', () => {
    render(<PageHeader title="Sub" headingAs="h2" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Sub' })).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('renders a footer element with data-slot', () => {
    render(<Footer>© 2026</Footer>);
    const ft = screen.getByRole('contentinfo');
    expect(ft).toHaveAttribute('data-slot', 'footer');
    expect(ft).toHaveTextContent('© 2026');
  });
});

describe('EmptyState', () => {
  it('renders a status surface with a default Inbox icon', () => {
    render(
      <EmptyState
        data-testid="empty"
        title="No results"
        description="Try adjusting your filters."
      />,
    );
    const el = screen.getByTestId('empty');
    expect(el).toHaveAttribute('data-slot', 'empty-state');
    expect(el).toHaveAttribute('role', 'status');
    expect(screen.getByText('No results')).toHaveAttribute('data-slot', 'empty-state-title');
    expect(screen.getByText('Try adjusting your filters.')).toHaveAttribute(
      'data-slot',
      'empty-state-description',
    );
  });

  it('accepts a custom icon + action slot', () => {
    render(
      <EmptyState
        title="Search"
        icon={<svg data-testid="custom-icon" />}
        action={<button>Clear</button>}
      />,
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' }).parentElement).toHaveAttribute(
      'data-slot',
      'empty-state-action',
    );
  });
});

describe('ErrorState', () => {
  it('renders with role=alert and destructive-tinted icon wrapper', () => {
    const { container } = render(
      <ErrorState title="Something went wrong" description="Please try again." />,
    );
    const el = container.querySelector('[data-slot="error-state"]');
    expect(el).toHaveAttribute('role', 'alert');
    const iconWrapper = container.querySelector('[data-slot="error-state-icon"]') as HTMLElement;
    expect(iconWrapper.className).toMatch(/text-destructive/);
  });
});

describe('LoadingState', () => {
  it('renders with an animated spinner icon by default', () => {
    const { container } = render(<LoadingState title="Loading…" />);
    const el = container.querySelector('[data-slot="loading-state"]');
    expect(el).toHaveAttribute('role', 'status');
    const icon = container.querySelector('[data-slot="loading-state-icon"] svg');
    expect(icon?.getAttribute('class')).toMatch(/animate-spin/);
  });
});
