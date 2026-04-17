'use client';

import type { AuthSession, AuthStatus, AuthUser, SessionResult } from './auth-types.js';
import { useAuthAdapter } from './auth-provider.js';

export type { AuthSession, AuthStatus, AuthUser, SessionResult };

/** Returns the raw session result (data + status) from the active adapter. */
export function useSession(): SessionResult {
  return useAuthAdapter().useSession();
}

/** Returns the current user or `null` when unauthenticated / loading. */
export function useUser(): AuthUser | null {
  const { data } = useSession();
  return data?.user ?? null;
}

/**
 * Returns the current user and throws a Suspense promise while the
 * session is loading, or a redirect-friendly `AuthRequiredError` when
 * unauthenticated. Pair with `React.Suspense` and an error boundary.
 */
export function useRequireAuth(): AuthUser {
  const { data, status } = useSession();
  if (status === 'loading') {
    // Suspend until the session resolves. Throwing a Promise is the
    // React Suspense contract — not a real error throw.
    throw new Promise<void>(() => {});
  }
  if (status !== 'authenticated' || !data?.user) {
    throw new AuthRequiredError();
  }
  return data.user;
}

/**
 * Returns `true` when the current user holds ALL of the given roles or
 * scopes. Checks both `user.roles` and `user.scopes`, so a single
 * `requires` value can refer to either.
 */
export function useHasPermission(roleOrScope: string | ReadonlyArray<string>): boolean {
  const user = useUser();
  if (!user) return false;
  const required = Array.isArray(roleOrScope) ? roleOrScope : [roleOrScope];
  const granted = [...(user.roles ?? []), ...(user.scopes ?? [])];
  return required.every((r) => granted.includes(r));
}

export class AuthRequiredError extends Error {
  constructor() {
    super('Authentication required');
    this.name = 'AuthRequiredError';
  }
}
