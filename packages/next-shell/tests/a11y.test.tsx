import * as React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Assertion<T> {
    toHaveNoViolations(): void;
  }
}

import { AppShell } from '../src/layout/app-shell.js';
import { TopBar } from '../src/layout/topbar.js';
import { PageHeader } from '../src/layout/page-header.js';
import { Footer } from '../src/layout/footer.js';
import { EmptyState, ErrorState, LoadingState } from '../src/layout/status-states.js';

describe('Accessibility — axe-core automated checks', () => {
  it('AppShell (no sidebar) has no a11y violations', async () => {
    const { container } = render(
      <AppShell topBar={<TopBar left={<span>Brand</span>} />} footer={<Footer>© 2026</Footer>}>
        <h1>Dashboard</h1>
        <p>Welcome to the app.</p>
      </AppShell>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('TopBar has no a11y violations', async () => {
    const { container } = render(
      <TopBar
        left={<span>Brand</span>}
        center={<input aria-label="Search" placeholder="Search..." />}
        right={<button type="button">Menu</button>}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('PageHeader has no a11y violations', async () => {
    const { container } = render(
      <PageHeader
        title="Settings"
        description="Manage your account preferences."
        actions={<button type="button">Save</button>}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('PageHeader with custom heading level has no a11y violations', async () => {
    const { container } = render(<PageHeader title="Sub-section" headingAs="h2" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('EmptyState has no a11y violations', async () => {
    const { container } = render(
      <EmptyState
        title="No items yet"
        description="Create your first item to get started."
        action={<button type="button">Create</button>}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ErrorState has no a11y violations', async () => {
    const { container } = render(
      <ErrorState
        title="Something went wrong"
        description="We could not load your data. Please try again."
        action={<button type="button">Retry</button>}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('LoadingState has no a11y violations', async () => {
    const { container } = render(
      <LoadingState title="Loading..." description="Please wait while we fetch your data." />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Footer has no a11y violations', async () => {
    const { container } = render(
      <Footer>
        <span>© 2026 Acme Inc.</span>
        <nav aria-label="Footer navigation">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </Footer>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
