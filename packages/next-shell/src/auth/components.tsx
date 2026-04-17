'use client';

import * as React from 'react';

import { useHasPermission, useSession } from './hooks.js';

export interface SignedInProps {
  readonly children: React.ReactNode;
  /** Content to render while the session status is `'loading'`. */
  readonly fallback?: React.ReactNode;
}

/** Renders `children` only when the user is authenticated. */
export function SignedIn({ children, fallback = null }: SignedInProps): React.ReactNode {
  const { status } = useSession();
  if (status === 'loading') return fallback;
  if (status !== 'authenticated') return null;
  return <>{children}</>;
}

export interface SignedOutProps {
  readonly children: React.ReactNode;
  readonly fallback?: React.ReactNode;
}

/** Renders `children` only when the user is NOT authenticated. */
export function SignedOut({ children, fallback = null }: SignedOutProps): React.ReactNode {
  const { status } = useSession();
  if (status === 'loading') return fallback;
  if (status !== 'unauthenticated') return null;
  return <>{children}</>;
}

export interface RoleGateProps {
  /**
   * Role(s) or scope(s) the current user must hold (AND semantics —
   * every listed value must be present). Mirrors the nav `requires` field.
   */
  readonly role: string | ReadonlyArray<string>;
  readonly children: React.ReactNode;
  /** Rendered when the permission check fails. Defaults to `null`. */
  readonly fallback?: React.ReactNode;
}

/** Renders `children` only when the user holds all required roles/scopes. */
export function RoleGate({ role, children, fallback = null }: RoleGateProps): React.ReactNode {
  const allowed = useHasPermission(role);
  if (!allowed) return fallback;
  return <>{children}</>;
}
