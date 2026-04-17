import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useQuery } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import { AppProviders } from '../src/providers/app-providers.js';
import { ErrorBoundary } from '../src/providers/error/error-boundary.js';
import { I18nProvider, useI18n } from '../src/providers/i18n/i18n-provider.js';
import { QueryProvider } from '../src/providers/query/query-provider.js';
import { makeServerQueryClient } from '../src/providers/query/query-ssr.js';
import { ToastProvider } from '../src/providers/toast/toast-provider.js';

/* ── QueryProvider ─────────────────────────────────────────────────────── */

describe('QueryProvider', () => {
  it('provides a QueryClient to descendants', () => {
    function Probe() {
      const { status } = useQuery({ queryKey: ['test'], queryFn: () => 'ok' });
      return <span data-testid="status">{status}</span>;
    }
    render(
      <QueryProvider>
        <Probe />
      </QueryProvider>,
    );
    expect(screen.getByTestId('status')).toBeInTheDocument();
  });

  it('accepts a pre-built client', () => {
    const client = makeServerQueryClient();
    render(
      <QueryProvider client={client}>
        <span data-testid="ok">ok</span>
      </QueryProvider>,
    );
    expect(screen.getByTestId('ok')).toBeInTheDocument();
  });
});

/* ── makeServerQueryClient ─────────────────────────────────────────────── */

describe('makeServerQueryClient', () => {
  it('creates a QueryClient with staleTime Infinity', () => {
    const client = makeServerQueryClient();
    expect(client.getDefaultOptions().queries?.staleTime).toBe(Infinity);
  });

  it('creates a QueryClient with retry false', () => {
    const client = makeServerQueryClient();
    expect(client.getDefaultOptions().queries?.retry).toBe(false);
  });
});

/* ── ToastProvider ─────────────────────────────────────────────────────── */

describe('ToastProvider', () => {
  it('renders children', () => {
    render(
      <ToastProvider>
        <span data-testid="child">hello</span>
      </ToastProvider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});

/* ── ErrorBoundary ─────────────────────────────────────────────────────── */

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <span data-testid="ok">ok</span>
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('ok')).toBeInTheDocument();
  });

  it('renders default fallback when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Bomb(): React.ReactNode {
      throw new Error('boom');
    }
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Bomb(): React.ReactNode {
      throw new Error('kaboom');
    }
    render(
      <ErrorBoundary fallback={({ error }) => <div data-testid="custom">{error.message}</div>}>
        <Bomb />
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('custom')).toHaveTextContent('kaboom');
    spy.mockRestore();
  });

  it('resets when the Try again button is clicked', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let shouldThrow = true;
    function MaybeThrow() {
      if (shouldThrow) throw new Error('oops');
      return <span data-testid="recovered">ok</span>;
    }
    render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(screen.getByTestId('recovered')).toBeInTheDocument();
    spy.mockRestore();
  });
});

/* ── I18nProvider / useI18n ────────────────────────────────────────────── */

describe('I18nProvider + useI18n', () => {
  it('returns null when no provider is mounted', () => {
    function Probe() {
      const i18n = useI18n();
      return <span data-testid="val">{i18n === null ? 'null' : 'defined'}</span>;
    }
    render(<Probe />);
    expect(screen.getByTestId('val')).toHaveTextContent('null');
  });

  it('exposes the adapter t() function', () => {
    const adapter = { t: (key: string) => `translated:${key}` };
    function Probe() {
      const i18n = useI18n();
      return <span data-testid="val">{i18n?.t('hello') ?? 'none'}</span>;
    }
    render(
      <I18nProvider adapter={adapter}>
        <Probe />
      </I18nProvider>,
    );
    expect(screen.getByTestId('val')).toHaveTextContent('translated:hello');
  });
});

/* ── AppProviders (composer) ───────────────────────────────────────────── */

describe('AppProviders', () => {
  it('renders children with all default providers', () => {
    render(
      <AppProviders>
        <span data-testid="child">hello</span>
      </AppProviders>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('opts out of query layer via queryProps={false}', () => {
    // Without QueryProvider, useQuery would throw — verify children render fine
    render(
      <AppProviders queryProps={false}>
        <span data-testid="child">no query</span>
      </AppProviders>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('opts out of i18n layer via i18nProps={false}', () => {
    function Probe() {
      const i18n = useI18n();
      return <span data-testid="val">{i18n === null ? 'null' : 'defined'}</span>;
    }
    render(
      <AppProviders i18nProps={false}>
        <Probe />
      </AppProviders>,
    );
    expect(screen.getByTestId('val')).toHaveTextContent('null');
  });

  it('passes themeProps down to ThemeProvider', () => {
    render(
      <AppProviders themeProps={{ defaultTheme: 'dark' }}>
        <span data-testid="child">themed</span>
      </AppProviders>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
