/**
 * Auth server helpers — safe to import from Server Components and
 * Route Handlers. No `'use client'` directive; no React imports.
 *
 * ```ts
 * import { requireSession } from '@jonmatum/next-shell/auth/server';
 * ```
 */

export type { AuthSession, AuthUser, AuthStatus, SessionResult } from '../auth-types.js';

export class AuthRequiredError extends Error {
  readonly statusCode = 401;

  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthRequiredError';
  }
}

/**
 * Asserts that a session exists, throwing `AuthRequiredError` (HTTP 401)
 * when not. Use inside Route Handlers and async Server Components.
 *
 * ```ts
 * // app/api/protected/route.ts
 * import { requireSession } from '@jonmatum/next-shell/auth/server';
 * import { auth } from '@/auth';  // your Auth.js handler
 *
 * export async function GET() {
 *   const session = await requireSession(auth);
 *   return Response.json({ user: session.user });
 * }
 * ```
 */
export async function requireSession<T extends { user: unknown; expires: string }>(
  getSession: () => Promise<T | null>,
): Promise<T> {
  const session = await getSession();
  if (!session) throw new AuthRequiredError();
  return session;
}
