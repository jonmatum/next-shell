/**
 * Mock auth adapter — deterministic, zero-dependency, no React required.
 *
 * Designed for unit / integration tests and Storybook. Swap in place of
 * `createNextAuthAdapter` without touching consumer component code.
 *
 * ```tsx
 * import { createMockAuthAdapter } from '@jonmatum/next-shell/auth/mock';
 * import { AuthProvider } from '@jonmatum/next-shell/auth';
 *
 * render(
 *   <AuthProvider adapter={createMockAuthAdapter({ user: { id: '1', roles: ['admin'] } })}>
 *     <MyComponent />
 *   </AuthProvider>,
 * );
 * ```
 */

import type { AuthAdapter, AuthSession, AuthUser } from '../auth-types.js';

export interface MockAuthOptions {
  /**
   * Pre-seeded user. Omit to simulate an unauthenticated session.
   * Pass `null` explicitly to simulate a signed-out state.
   */
  readonly user?: AuthUser | null;
  /**
   * Override the session expiry (ISO-8601). Defaults to a date far in
   * the future so tests don't have to care about it.
   */
  readonly expires?: string;
  /** Simulate the loading state. Defaults to `false`. */
  readonly loading?: boolean;
  /** Spy on sign-in calls in tests. */
  readonly onSignIn?: (options?: Record<string, unknown>) => void;
  /** Spy on sign-out calls in tests. */
  readonly onSignOut?: (options?: Record<string, unknown>) => void;
}

export function createMockAuthAdapter(options?: MockAuthOptions): AuthAdapter {
  const {
    user = null,
    expires = '2099-12-31T23:59:59.000Z',
    loading = false,
    onSignIn,
    onSignOut,
  } = options ?? {};

  const session: AuthSession | null = user != null ? { user, expires } : null;

  return {
    useSession() {
      if (loading) return { data: null, status: 'loading' };
      return {
        data: session,
        status: session ? 'authenticated' : 'unauthenticated',
      };
    },

    async signIn(opts) {
      onSignIn?.(opts);
    },

    async signOut(opts) {
      onSignOut?.(opts);
    },

    async getServerSession() {
      if (loading) return null;
      return session;
    },
  };
}
