'use client';

/**
 * Auth subpath — client surface.
 *
 * ```tsx
 * import { AuthProvider, useSession, SignedIn, RoleGate } from '@jonmatum/next-shell/auth';
 * ```
 *
 * Plug in an adapter (nextauth, mock, or custom) via `<AuthProvider adapter={...}>`.
 * Server helpers live at `@jonmatum/next-shell/auth/server`.
 * The Auth.js v5 adapter lives at `@jonmatum/next-shell/auth/nextauth`.
 * The mock adapter for tests lives at `@jonmatum/next-shell/auth/mock`.
 */

// ── Context + adapter contract ─────────────────────────────────────────────
export { AuthProvider } from './auth-provider.js';
export type { AuthProviderProps, AuthAdapter } from './auth-provider.js';

// ── Hooks ──────────────────────────────────────────────────────────────────
export {
  useSession,
  useUser,
  useRequireAuth,
  useHasPermission,
  AuthRequiredError,
} from './hooks.js';
export type { AuthSession, AuthUser, AuthStatus, SessionResult } from './hooks.js';

// ── Components ────────────────────────────────────────────────────────────
export { SignedIn, SignedOut, RoleGate } from './components.js';
export type { SignedInProps, SignedOutProps, RoleGateProps } from './components.js';
