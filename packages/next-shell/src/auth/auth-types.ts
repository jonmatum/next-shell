/**
 * Core auth types — shared between client surface, server helpers,
 * and all adapters. No runtime code; safe to import anywhere.
 */

export interface AuthUser {
  readonly id: string;
  readonly email?: string | null;
  readonly name?: string | null;
  readonly image?: string | null;
  /** Role or permission keys — matched against nav `requires` fields. */
  readonly roles?: ReadonlyArray<string>;
  /** OAuth / custom scopes. */
  readonly scopes?: ReadonlyArray<string>;
}

export interface AuthSession {
  readonly user: AuthUser;
  /** ISO-8601 expiry timestamp. */
  readonly expires: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface SessionResult {
  readonly data: AuthSession | null;
  readonly status: AuthStatus;
}

/**
 * Minimal adapter contract. Plug in Auth.js, Clerk, Supabase Auth, etc.
 * by implementing this interface and passing the instance to `<AuthProvider>`.
 *
 * `useSession` is intentionally a hook signature — it will be called inside
 * React render. Adapters that wrap third-party hooks (e.g. `next-auth/react`)
 * should forward to those hooks here.
 */
export interface AuthAdapter {
  useSession(): SessionResult;
  signIn(options?: Record<string, unknown>): Promise<void>;
  signOut(options?: Record<string, unknown>): Promise<void>;
  /**
   * Optional server-side session getter for Route Handlers and Server
   * Components. Returns `null` when no session is active.
   */
  getServerSession?(): Promise<AuthSession | null>;
}
