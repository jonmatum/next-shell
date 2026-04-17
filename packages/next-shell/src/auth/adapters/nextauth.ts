'use client';

/**
 * Auth.js v5 (next-auth@5) adapter for `<AuthProvider>`.
 *
 * Peer dependency: `next-auth >= 5.0.0-beta.0` (optional — only
 * needed when this adapter is used).
 *
 * ```tsx
 * // app/layout.tsx
 * import { createNextAuthAdapter } from '@jonmatum/next-shell/auth/nextauth';
 * import { auth } from '@/auth';     // your Auth.js handler
 * import { AuthProvider } from '@jonmatum/next-shell/auth';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <AuthProvider adapter={createNextAuthAdapter({ getServerSession: auth })}>
 *       {children}
 *     </AuthProvider>
 *   );
 * }
 * ```
 */

// next-auth is an optional peer dependency — consumers must install it.
// Types are declared in `./next-auth-react.d.ts` so TypeScript resolves
// without the package being installed locally.
import {
  useSession as useNextAuthSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from 'next-auth/react';

import type { AuthAdapter, AuthSession } from '../auth-types.js';

export interface CreateNextAuthAdapterOptions {
  /**
   * Server-side session getter — pass your Auth.js `auth` export here.
   * Used by `requireSession()` in Route Handlers and Server Components.
   */
  readonly getServerSession?: () => Promise<AuthSession | null>;
}

export function createNextAuthAdapter(options?: CreateNextAuthAdapterOptions): AuthAdapter {
  return {
    useSession() {
      const { data, status } = useNextAuthSession();
      return {
        data: data as AuthSession | null,
        status,
      };
    },

    async signIn(opts) {
      const { provider, ...rest } = (opts ?? {}) as { provider?: string } & Record<string, unknown>;
      await nextAuthSignIn(provider, rest);
    },

    async signOut(opts) {
      await nextAuthSignOut(opts);
    },

    getServerSession: options?.getServerSession,
  };
}
