import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  AuthProvider,
  useSession,
  useUser,
  useHasPermission,
  SignedIn,
  SignedOut,
  RoleGate,
  AuthRequiredError,
} from '../src/auth/index.js';
import { createMockAuthAdapter } from '../src/auth/adapters/mock.js';
import {
  requireSession,
  AuthRequiredError as ServerAuthRequiredError,
} from '../src/auth/server/index.js';

/* ── helpers ──────────────────────────────────────────────────────────────── */

function renderWithAuth(ui: React.ReactElement, adapter = createMockAuthAdapter()) {
  return render(<AuthProvider adapter={adapter}>{ui}</AuthProvider>);
}

/* ── createMockAuthAdapter ────────────────────────────────────────────────── */

describe('createMockAuthAdapter', () => {
  it('returns unauthenticated status when no user provided', () => {
    const adapter = createMockAuthAdapter();
    expect(adapter.useSession()).toEqual({ data: null, status: 'unauthenticated' });
  });

  it('returns authenticated status when user is provided', () => {
    const adapter = createMockAuthAdapter({ user: { id: '1', name: 'Alice' } });
    const { data, status } = adapter.useSession();
    expect(status).toBe('authenticated');
    expect(data?.user.name).toBe('Alice');
  });

  it('returns loading status when loading=true', () => {
    const adapter = createMockAuthAdapter({ loading: true });
    expect(adapter.useSession().status).toBe('loading');
  });

  it('calls onSignIn spy', async () => {
    const onSignIn = vi.fn();
    const adapter = createMockAuthAdapter({ onSignIn });
    await adapter.signIn({ provider: 'github' });
    expect(onSignIn).toHaveBeenCalledWith({ provider: 'github' });
  });

  it('calls onSignOut spy', async () => {
    const onSignOut = vi.fn();
    const adapter = createMockAuthAdapter({ onSignOut });
    await adapter.signOut();
    expect(onSignOut).toHaveBeenCalled();
  });

  it('getServerSession returns session when user is set', async () => {
    const adapter = createMockAuthAdapter({ user: { id: '42' } });
    const session = await adapter.getServerSession!();
    expect(session?.user.id).toBe('42');
  });

  it('getServerSession returns null when no user', async () => {
    const adapter = createMockAuthAdapter();
    expect(await adapter.getServerSession!()).toBeNull();
  });
});

/* ── useSession / useUser ─────────────────────────────────────────────────── */

describe('useSession', () => {
  it('exposes status from adapter', () => {
    function Probe() {
      const { status } = useSession();
      return <span data-testid="status">{status}</span>;
    }
    renderWithAuth(<Probe />, createMockAuthAdapter({ user: { id: '1' } }));
    expect(screen.getByTestId('status')).toHaveTextContent('authenticated');
  });
});

describe('useUser', () => {
  it('returns null when unauthenticated', () => {
    function Probe() {
      const user = useUser();
      return <span data-testid="val">{user === null ? 'null' : user.id}</span>;
    }
    renderWithAuth(<Probe />);
    expect(screen.getByTestId('val')).toHaveTextContent('null');
  });

  it('returns user when authenticated', () => {
    function Probe() {
      const user = useUser();
      return <span data-testid="val">{user?.name ?? 'none'}</span>;
    }
    renderWithAuth(<Probe />, createMockAuthAdapter({ user: { id: '1', name: 'Bob' } }));
    expect(screen.getByTestId('val')).toHaveTextContent('Bob');
  });
});

/* ── useHasPermission ─────────────────────────────────────────────────────── */

describe('useHasPermission', () => {
  it('returns false when unauthenticated', () => {
    function Probe() {
      const ok = useHasPermission('admin');
      return <span data-testid="val">{ok ? 'yes' : 'no'}</span>;
    }
    renderWithAuth(<Probe />);
    expect(screen.getByTestId('val')).toHaveTextContent('no');
  });

  it('returns true when user has the role', () => {
    function Probe() {
      const ok = useHasPermission('admin');
      return <span data-testid="val">{ok ? 'yes' : 'no'}</span>;
    }
    renderWithAuth(
      <Probe />,
      createMockAuthAdapter({ user: { id: '1', roles: ['admin', 'editor'] } }),
    );
    expect(screen.getByTestId('val')).toHaveTextContent('yes');
  });

  it('returns true when user has the scope', () => {
    function Probe() {
      const ok = useHasPermission('read:posts');
      return <span data-testid="val">{ok ? 'yes' : 'no'}</span>;
    }
    renderWithAuth(<Probe />, createMockAuthAdapter({ user: { id: '1', scopes: ['read:posts'] } }));
    expect(screen.getByTestId('val')).toHaveTextContent('yes');
  });

  it('returns false when user lacks role', () => {
    function Probe() {
      const ok = useHasPermission('superadmin');
      return <span data-testid="val">{ok ? 'yes' : 'no'}</span>;
    }
    renderWithAuth(<Probe />, createMockAuthAdapter({ user: { id: '1', roles: ['editor'] } }));
    expect(screen.getByTestId('val')).toHaveTextContent('no');
  });

  it('AND semantics — all roles must be present', () => {
    function Probe() {
      const ok = useHasPermission(['admin', 'editor']);
      return <span data-testid="val">{ok ? 'yes' : 'no'}</span>;
    }
    renderWithAuth(<Probe />, createMockAuthAdapter({ user: { id: '1', roles: ['admin'] } }));
    expect(screen.getByTestId('val')).toHaveTextContent('no');
  });
});

/* ── SignedIn / SignedOut ─────────────────────────────────────────────────── */

describe('SignedIn', () => {
  it('renders children when authenticated', () => {
    renderWithAuth(
      <SignedIn>
        <span data-testid="content">secret</span>
      </SignedIn>,
      createMockAuthAdapter({ user: { id: '1' } }),
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('hides children when unauthenticated', () => {
    renderWithAuth(
      <SignedIn>
        <span data-testid="content">secret</span>
      </SignedIn>,
    );
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('renders fallback while loading', () => {
    renderWithAuth(
      <SignedIn fallback={<span data-testid="loading">…</span>}>
        <span data-testid="content">secret</span>
      </SignedIn>,
      createMockAuthAdapter({ loading: true }),
    );
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });
});

describe('SignedOut', () => {
  it('renders children when unauthenticated', () => {
    renderWithAuth(
      <SignedOut>
        <span data-testid="login">login</span>
      </SignedOut>,
    );
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });

  it('hides children when authenticated', () => {
    renderWithAuth(
      <SignedOut>
        <span data-testid="login">login</span>
      </SignedOut>,
      createMockAuthAdapter({ user: { id: '1' } }),
    );
    expect(screen.queryByTestId('login')).not.toBeInTheDocument();
  });
});

/* ── RoleGate ─────────────────────────────────────────────────────────────── */

describe('RoleGate', () => {
  it('renders children when user has role', () => {
    renderWithAuth(
      <RoleGate role="admin">
        <span data-testid="content">admin panel</span>
      </RoleGate>,
      createMockAuthAdapter({ user: { id: '1', roles: ['admin'] } }),
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('hides children when user lacks role', () => {
    renderWithAuth(
      <RoleGate role="admin">
        <span data-testid="content">admin panel</span>
      </RoleGate>,
      createMockAuthAdapter({ user: { id: '1', roles: ['editor'] } }),
    );
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('renders fallback when user lacks role', () => {
    renderWithAuth(
      <RoleGate role="admin" fallback={<span data-testid="denied">denied</span>}>
        <span data-testid="content">admin panel</span>
      </RoleGate>,
      createMockAuthAdapter({ user: { id: '1' } }),
    );
    expect(screen.getByTestId('denied')).toBeInTheDocument();
  });
});

/* ── AuthRequiredError ───────────────────────────────────────────────────── */

describe('AuthRequiredError', () => {
  it('is an Error instance with correct name', () => {
    const err = new AuthRequiredError();
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('AuthRequiredError');
    expect(err.message).toBe('Authentication required');
  });
});

/* ── requireSession (server) ─────────────────────────────────────────────── */

describe('requireSession', () => {
  it('returns the session when one exists', async () => {
    const fakeSession = { user: { id: '7' }, expires: '2099-01-01' };
    const getSession = async () => fakeSession;
    const result = await requireSession(getSession);
    expect(result).toBe(fakeSession);
  });

  it('throws ServerAuthRequiredError when session is null', async () => {
    await expect(requireSession(async () => null)).rejects.toBeInstanceOf(ServerAuthRequiredError);
  });

  it('ServerAuthRequiredError has statusCode 401', () => {
    const err = new ServerAuthRequiredError();
    expect(err.statusCode).toBe(401);
  });
});
